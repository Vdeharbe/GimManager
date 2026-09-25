import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerRutinas,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
} from "../services/rutinasService";

import { obtenerSocios } from "../services/sociosService";

import { useAuth } from "../context/AuthContext";

import GestionEjercicios from "../components/rutinas/GestionEjercicios";

const Rutinas = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const esAdmin = usuario?.rol === "admin";

  // ==========================================
  // ESTADOS
  // ==========================================

  const [rutinas, setRutinas] = useState([]);
  const [socios, setSocios] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [rutinaEditando, setRutinaEditando] =
    useState(null);

  const [rutinaSeleccionada, setRutinaSeleccionada] =
    useState(null);

  const [formulario, setFormulario] = useState({
    socio_id: "",
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "Activa",
  });

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [datosRutinas, datosSocios] =
        await Promise.all([
          obtenerRutinas(),
          obtenerSocios(),
        ]);

      setRutinas(datosRutinas);
      setSocios(datosSocios);
    } catch (error) {
      console.error(
        "Error al cargar rutinas:",
        error
      );

      setError(
        "No se pudieron cargar las rutinas."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==========================================
  // CAMBIOS EN FORMULARIO
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setFormulario({
      socio_id: "",
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "Activa",
    });

    setRutinaEditando(null);
  };

  // ==========================================
  // GUARDAR RUTINA
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formulario.socio_id ||
      !formulario.nombre ||
      !formulario.fecha_inicio
    ) {
      setError(
        "Socio, nombre y fecha de inicio son obligatorios."
      );

      return;
    }

    try {
      setError("");

      if (rutinaEditando) {
        await actualizarRutina(
          rutinaEditando.id,
          formulario
        );
      } else {
        await crearRutina(formulario);
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al guardar rutina:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo guardar la rutina."
      );
    }
  };

  // ==========================================
  // EDITAR RUTINA
  // ==========================================

  const handleEditar = (rutina) => {
    setRutinaEditando(rutina);

    setFormulario({
      socio_id: rutina.socio_id,

      nombre: rutina.nombre,

      descripcion:
        rutina.descripcion || "",

      fecha_inicio:
        rutina.fecha_inicio
          ? rutina.fecha_inicio.substring(
              0,
              10
            )
          : "",

      fecha_fin:
        rutina.fecha_fin
          ? rutina.fecha_fin.substring(
              0,
              10
            )
          : "",

      estado:
        rutina.estado || "Activa",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ELIMINAR RUTINA
  // ==========================================

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta rutina?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarRutina(id);

      // Si estamos viendo los ejercicios
      // de la rutina eliminada, cerramos
      // esa sección.

      if (rutinaSeleccionada?.id === id) {
        setRutinaSeleccionada(null);
      }

      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al eliminar rutina:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo eliminar la rutina."
      );
    }
  };

  // ==========================================
  // VER EJERCICIOS
  // ==========================================

  const handleVerEjercicios = (rutina) => {
    setRutinaSeleccionada(rutina);

    // Bajamos hasta la sección de ejercicios
    // después de que React actualice la pantalla.

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="container py-4">

      {/* ======================================
          BOTÓN VOLVER
          ====================================== */}

      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Volver al Dashboard
      </button>

      {/* ======================================
          TÍTULO
          ====================================== */}

      <h2 className="mb-4">
        Gestión de Rutinas
      </h2>

      {/* ======================================
          ERROR
          ====================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ======================================
          FORMULARIO DE RUTINAS
          ====================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="card-title mb-3">
            {rutinaEditando
              ? "Editar rutina"
              : "Nueva rutina"}
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* SOCIO */}

              <div className="col-md-6">

                <label className="form-label">
                  Socio
                </label>

                <select
                  className="form-select"
                  name="socio_id"
                  value={
                    formulario.socio_id
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccionar socio
                  </option>

                  {socios.map((socio) => (
                    <option
                      key={socio.id}
                      value={socio.id}
                    >
                      {socio.nombre}
                    </option>
                  ))}

                </select>

              </div>

              {/* NOMBRE */}

              <div className="col-md-6">

                <label className="form-label">
                  Nombre de la rutina
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPCIÓN */}

              <div className="col-12">

                <label className="form-label">
                  Descripción
                </label>

                <textarea
                  className="form-control"
                  name="descripcion"
                  rows="3"
                  value={
                    formulario.descripcion
                  }
                  onChange={handleChange}
                />

              </div>

              {/* FECHA INICIO */}

              <div className="col-md-4">

                <label className="form-label">
                  Fecha de inicio
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fecha_inicio"
                  value={
                    formulario.fecha_inicio
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* FECHA FIN */}

              <div className="col-md-4">

                <label className="form-label">
                  Fecha de fin
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fecha_fin"
                  value={
                    formulario.fecha_fin
                  }
                  onChange={handleChange}
                />

              </div>

              {/* ESTADO */}

              <div className="col-md-4">

                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  name="estado"
                  value={formulario.estado}
                  onChange={handleChange}
                >

                  <option value="Activa">
                    Activa
                  </option>

                  <option value="Finalizada">
                    Finalizada
                  </option>

                  <option value="Pausada">
                    Pausada
                  </option>

                </select>

              </div>

              {/* BOTONES */}

              <div className="col-12">

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  {rutinaEditando
                    ? "Guardar cambios"
                    : "Crear rutina"}
                </button>

                {rutinaEditando && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      limpiarFormulario
                    }
                  >
                    Cancelar
                  </button>
                )}

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* ======================================
          LISTADO DE RUTINAS
          ====================================== */}

      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="card-title mb-3">
            Rutinas registradas
          </h5>

          {cargando ? (

            <p>
              Cargando rutinas...
            </p>

          ) : rutinas.length === 0 ? (

            <div className="alert alert-info">
              No hay rutinas registradas.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>
                    <th>Socio</th>
                    <th>Rutina</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>

                </thead>

                <tbody>

                  {rutinas.map((rutina) => (

                    <tr key={rutina.id}>

                      {/* SOCIO */}

                      <td>
                        {rutina.socio_nombre}
                      </td>

                      {/* RUTINA */}

                      <td>

                        <strong>
                          {rutina.nombre}
                        </strong>

                        {rutina.descripcion && (

                          <div className="small text-muted">
                            {
                              rutina.descripcion
                            }
                          </div>

                        )}

                      </td>

                      {/* FECHA INICIO */}

                      <td>

                        {rutina.fecha_inicio
                          ? new Date(
                              rutina.fecha_inicio
                            ).toLocaleDateString(
                              "es-AR"
                            )
                          : "-"}

                      </td>

                      {/* FECHA FIN */}

                      <td>

                        {rutina.fecha_fin
                          ? new Date(
                              rutina.fecha_fin
                            ).toLocaleDateString(
                              "es-AR"
                            )
                          : "-"}

                      </td>

                      {/* ESTADO */}

                      <td>
                        {rutina.estado}
                      </td>

                      {/* ACCIONES */}

                      <td>

                        {/* EDITAR */}

                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleEditar(
                              rutina
                            )
                          }
                        >
                          Editar
                        </button>

                        {/* EJERCICIOS */}

                        <button
                          type="button"
                          className="btn btn-sm btn-info me-2"
                          onClick={() =>
                            handleVerEjercicios(
                              rutina
                            )
                          }
                        >
                          Ejercicios
                        </button>

                        {/* ELIMINAR SOLO ADMIN */}

                        {esAdmin && (

                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleEliminar(
                                rutina.id
                              )
                            }
                          >
                            Eliminar
                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ======================================
          GESTIÓN DE EJERCICIOS
          ====================================== */}

      {rutinaSeleccionada && (

        <div className="card shadow-sm mt-4">

          <div className="card-body">

            <div
              className="
                d-flex
                justify-content-between
                align-items-center
                mb-3
              "
            >

              <h5 className="mb-0">
                Gestión de ejercicios
              </h5>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() =>
                  setRutinaSeleccionada(
                    null
                  )
                }
              >
                Cerrar
              </button>

            </div>

            <GestionEjercicios
              rutina={
                rutinaSeleccionada
              }
            />

          </div>

        </div>

      )}

    </div>
  );
};

export default Rutinas;