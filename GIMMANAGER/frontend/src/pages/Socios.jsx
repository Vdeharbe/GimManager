import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerSocios,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} from "../services/sociosService";

import FormularioSocio from "../components/FormularioSocio";
import { useAuth } from "../context/AuthContext";

function Socios() {
  const navigate = useNavigate();

  // ==========================================
  // USUARIO Y ROL
  // ==========================================

  const { usuario } = useAuth();

  const esAdmin =
    usuario?.rol === "admin";

  // ==========================================
  // ESTADOS
  // ==========================================

  const [socios, setSocios] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    socioAEditar,
    setSocioAEditar,
  ] = useState(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("Todos");

  // ==========================================
  // CARGAR SOCIOS
  // ==========================================

  const cargarSocios = async () => {
    try {
      setCargando(true);
      setError("");

      const datos =
        await obtenerSocios();

      setSocios(datos);

    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los socios."
      );

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR AL ABRIR
  // ==========================================

  useEffect(() => {
    cargarSocios();
  }, []);

  // ==========================================
  // AGREGAR SOCIO
  // Solo Admin
  // ==========================================

  const agregarSocio = async (socio) => {
    try {
      await crearSocio(socio);

      await cargarSocios();

    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  // ==========================================
  // EDITAR SOCIO
  // Solo Admin
  // ==========================================

  const editarSocio = async (socio) => {
    try {
      await actualizarSocio(
        socio.id,
        socio
      );

      setSocioAEditar(null);

      await cargarSocios();

    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  // ==========================================
  // ELIMINAR SOCIO
  // Solo Admin
  // ==========================================

  const handleEliminar = async (id) => {
    const confirmar =
      window.confirm(
        "¿Seguro que querés eliminar este socio?"
      );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarSocio(id);

      await cargarSocios();

    } catch (error) {
      console.error(error);

      alert(
        "No se pudo eliminar el socio."
      );
    }
  };

  // ==========================================
  // BUSCAR Y FILTRAR
  // Admin + Instructor
  // ==========================================

  const sociosFiltrados =
    socios.filter((socio) => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      const nombre =
        (socio.nombre || "")
          .toLowerCase();

      const email =
        (socio.email || "")
          .toLowerCase();

      const coincideBusqueda =
        nombre.includes(texto) ||
        email.includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        socio.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div className="container mt-4">

        <h3>
          Cargando socios...
        </h3>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="container mt-4">

        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={cargarSocios}
        >
          Intentar nuevamente
        </button>

      </div>
    );
  }

  // ==========================================
  // PANTALLA PRINCIPAL
  // ==========================================

  return (
    <div className="container mt-4">

      {/* VOLVER */}

      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Volver al Dashboard
      </button>

      {/* ======================================
          TÍTULO Y ACTUALIZAR
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2>
          👥 Gestión de Socios
        </h2>

        <button
          className="btn btn-primary"
          onClick={cargarSocios}
        >
          🔄 Actualizar
        </button>

      </div>

      {/* ======================================
          MENSAJE PARA INSTRUCTOR
      ====================================== */}

      {!esAdmin && (
        <div className="alert alert-info">
          Podés consultar, buscar y filtrar
          los socios registrados.
        </div>
      )}

      {/* ======================================
          FORMULARIO
          SOLO ADMIN
      ====================================== */}

      {esAdmin && (
        <FormularioSocio
          agregarSocio={
            socioAEditar
              ? editarSocio
              : agregarSocio
          }
          socioAEditar={
            socioAEditar
          }
        />
      )}

      {/* ======================================
          BÚSQUEDA Y FILTRO
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <div className="row">

            {/* BUSCADOR */}

            <div className="col-md-8">

              <label className="form-label">
                🔍 Buscar socio
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />

            </div>

            {/* FILTRO */}

            <div className="col-md-4">

              <label className="form-label">
                📄 Estado
              </label>

              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) =>
                  setFiltroEstado(
                    e.target.value
                  )
                }
              >

                <option value="Todos">
                  Todos
                </option>

                <option value="Activo">
                  Activos
                </option>

                <option value="Inactivo">
                  Inactivos
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          CONTADOR
      ====================================== */}

      <div className="mb-2">

        <strong>
          Mostrando{" "}
          {sociosFiltrados.length}
          {" "}de{" "}
          {socios.length} socios
        </strong>

      </div>

      {/* ======================================
          TABLA
      ====================================== */}

      <div className="table-responsive">

        <table className="table table-striped table-hover">

          <thead className="table-dark">

            <tr>

              <th>ID</th>

              <th>Nombre</th>

              <th>Email</th>

              <th>Plan</th>

              <th>Estado</th>

              {/* ACCIONES SOLO ADMIN */}

              {esAdmin && (
                <th>Acciones</th>
              )}

            </tr>

          </thead>

          <tbody>

            {sociosFiltrados.length ===
            0 ? (

              <tr>

                <td
                  colSpan={
                    esAdmin ? "6" : "5"
                  }
                  className="text-center"
                >
                  No se encontraron socios.
                </td>

              </tr>

            ) : (

              sociosFiltrados.map(
                (socio) => (

                  <tr key={socio.id}>

                    <td>
                      {socio.id}
                    </td>

                    <td>
                      {socio.nombre}
                    </td>

                    <td>
                      {socio.email}
                    </td>

                    <td>
                      {socio.plan}
                    </td>

                    <td>

                      <span
                        className={
                          socio.estado ===
                          "Activo"
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {socio.estado}
                      </span>

                    </td>

                    {/* =========================
                        ACCIONES SOLO ADMIN
                    ========================= */}

                    {esAdmin && (
                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            setSocioAEditar(
                              socio
                            )
                          }
                        >
                          ✏️ Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleEliminar(
                              socio.id
                            )
                          }
                        >
                          🗑️ Eliminar
                        </button>

                      </td>
                    )}

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Socios;