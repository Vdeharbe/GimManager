import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerInscripciones,
  crearInscripcion,
  actualizarInscripcion,
  eliminarInscripcion,
} from "../services/inscripcionesService";

import { obtenerSocios } from "../services/sociosService";
import { obtenerHorarios } from "../services/horariosService";

import { useAuth } from "../context/AuthContext";

function Inscripciones() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const esAdmin = usuario?.rol === "admin";

  const [inscripciones, setInscripciones] =
    useState([]);

  const [socios, setSocios] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] = useState("");

  const [editandoId, setEditandoId] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      socio_id: "",
      horario_id: "",
      fecha_inscripcion: "",
      estado: "Activa",
    });

  // ========================================
  // CARGAR DATOS
  // ========================================

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [
        datosInscripciones,
        datosSocios,
        datosHorarios,
      ] = await Promise.all([
        obtenerInscripciones(),
        obtenerSocios(),
        obtenerHorarios(),
      ]);

      setInscripciones(datosInscripciones);
      setSocios(datosSocios);
      setHorarios(datosHorarios);
    } catch (error) {
      console.error(
        "Error al cargar datos:",
        error
      );

      setError(
        "No se pudieron cargar las inscripciones."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ========================================
  // CAMBIOS DEL FORMULARIO
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // ========================================
  // LIMPIAR FORMULARIO
  // ========================================

  const limpiarFormulario = () => {
    setFormulario({
      socio_id: "",
      horario_id: "",
      fecha_inscripcion: "",
      estado: "Activa",
    });

    setEditandoId(null);
    setError("");
  };

  // ========================================
  // GUARDAR
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formulario.socio_id ||
      !formulario.horario_id ||
      !formulario.fecha_inscripcion
    ) {
      setError(
        "Socio, horario y fecha son obligatorios."
      );
      return;
    }

    const datos = {
      ...formulario,
      socio_id: Number(
        formulario.socio_id
      ),
      horario_id: Number(
        formulario.horario_id
      ),
    };

    try {
      if (editandoId) {
        await actualizarInscripcion(
          editandoId,
          datos
        );
      } else {
        await crearInscripcion(datos);
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al guardar inscripción:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo guardar la inscripción."
      );
    }
  };

  // ========================================
  // EDITAR
  // ========================================

  const handleEditar = (inscripcion) => {
    setEditandoId(inscripcion.id);

    setFormulario({
      socio_id: String(
        inscripcion.socio_id
      ),
      horario_id: String(
        inscripcion.horario_id
      ),
      fecha_inscripcion:
        inscripcion.fecha_inscripcion
          ?.substring(0, 10) || "",
      estado:
        inscripcion.estado || "Activa",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // ELIMINAR
  // ========================================

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Deseás eliminar esta inscripción?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarInscripcion(id);

      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al eliminar inscripción:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo eliminar la inscripción."
      );
    }
  };

  // ========================================
  // FORMATEAR HORA
  // ========================================

  const formatearHora = (hora) => {
    if (!hora) {
      return "";
    }

    return hora.substring(0, 5);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Inscripciones a clases</h2>

          <p className="text-muted mb-0">
            Gestión de socios inscriptos en
            los horarios del gimnasio.
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Volver al Dashboard
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ================================= */}
      {/* FORMULARIO */}
      {/* ================================= */}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            {editandoId
              ? "Editar inscripción"
              : "Nueva inscripción"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
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
                      {socio.estado
                        ? ` - ${socio.estado}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Horario
                </label>

                <select
                  className="form-select"
                  name="horario_id"
                  value={
                    formulario.horario_id
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccionar horario
                  </option>

                  {horarios.map(
                    (horario) => (
                      <option
                        key={horario.id}
                        value={horario.id}
                      >
                        {horario.actividad} -{" "}
                        {horario.dia_semana} -{" "}
                        {formatearHora(
                          horario.hora_inicio
                        )}
                        {" - "}
                        {
                          horario.profesor_nombre
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Fecha de inscripción
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fecha_inscripcion"
                  value={
                    formulario.fecha_inscripcion
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  name="estado"
                  value={
                    formulario.estado
                  }
                  onChange={handleChange}
                >
                  <option value="Activa">
                    Activa
                  </option>

                  <option value="Cancelada">
                    Cancelada
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editandoId
                  ? "Guardar cambios"
                  : "Inscribir socio"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    limpiarFormulario
                  }
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ================================= */}
      {/* TABLA */}
      {/* ================================= */}

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">
            Inscripciones registradas
          </h5>

          {cargando ? (
            <p>Cargando inscripciones...</p>
          ) : inscripciones.length === 0 ? (
            <p className="text-muted">
              No hay inscripciones
              registradas.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>Socio</th>
                    <th>Actividad</th>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Profesor</th>
                    <th>Fecha inscripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {inscripciones.map(
                    (inscripcion) => (
                      <tr
                        key={inscripcion.id}
                      >
                        <td>
                          {
                            inscripcion.socio_nombre
                          }
                        </td>

                        <td>
                          {
                            inscripcion.actividad
                          }
                        </td>

                        <td>
                          {
                            inscripcion.dia_semana
                          }
                        </td>

                        <td>
                          {formatearHora(
                            inscripcion.hora_inicio
                          )}
                          {" - "}
                          {formatearHora(
                            inscripcion.hora_fin
                          )}
                        </td>

                        <td>
                          {
                            inscripcion.profesor_nombre
                          }
                        </td>

                        <td>
                          {inscripcion.fecha_inscripcion
                            ?.substring(
                              0,
                              10
                            )}
                        </td>

                        <td>
                          <span
                            className={
                              inscripcion.estado ===
                              "Activa"
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {
                              inscripcion.estado
                            }
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                handleEditar(
                                  inscripcion
                                )
                              }
                            >
                              Editar
                            </button>

                            {esAdmin && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleEliminar(
                                    inscripcion.id
                                  )
                                }
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inscripciones;