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

  const esAdmin = usuario?.rol === "admin";

  // ==========================================
  // ESTADOS
  // ==========================================

  const [socios, setSocios] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [socioAEditar, setSocioAEditar] = useState(null);

  // ==========================================
  // BÚSQUEDA Y FILTRO
  // ==========================================

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const [pagina, setPagina] = useState(1);

  const [limite] = useState(5);

  const [total, setTotal] = useState(0);

  const [totalPaginas, setTotalPaginas] = useState(0);

  // ==========================================
  // CARGAR SOCIOS
  // ==========================================

  const cargarSocios = async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerSocios({
        buscar: busqueda,
        estado: filtroEstado === "Todos" ? "" : filtroEstado,
        page: pagina,
        limit: limite,
      });

      setSocios(Array.isArray(datos.socios) ? datos.socios : []);

      setTotal(datos.paginacion?.total || 0);

      setTotalPaginas(datos.paginacion?.totalPaginas || 0);
    } catch (error) {
  console.error(error);

  const mensaje =
    error.response?.data?.mensaje ||
    "No se pudieron cargar los socios.";

  setError(mensaje);

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR AL ABRIR Y AL CAMBIAR FILTROS
  // ==========================================

  useEffect(() => {
    cargarSocios();
  }, [busqueda, filtroEstado, pagina]);

  // ==========================================
  // AGREGAR SOCIO
  // Solo Admin
  // ==========================================

  const agregarSocio = async (socio) => {
    try {
      await crearSocio(socio);

      setPagina(1);

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
      await actualizarSocio(socio.id, socio);

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
    const confirmar = window.confirm("¿Seguro que querés eliminar este socio?");

    if (!confirmar) {
      return;
    }

    try {
      await eliminarSocio(id);

      await cargarSocios();
    } catch (error) {
  console.error(error);

  const mensaje =
    error.response?.data?.mensaje ||
    "No se pudo eliminar el socio.";

  alert(`❌ ${mensaje}`);

  }}

  // ==========================================
  // CAMBIAR BÚSQUEDA
  // ==========================================

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);

    // Si cambia la búsqueda,
    // volvemos a la página 1.
    setPagina(1);
  };

  // ==========================================
  // CAMBIAR FILTRO
  // ==========================================

  const handleFiltroEstado = (e) => {
    setFiltroEstado(e.target.value);

    // Si cambia el filtro,
    // volvemos a la página 1.
    setPagina(1);
  };

  // ==========================================
  // PÁGINA ANTERIOR
  // ==========================================

  const paginaAnterior = () => {
    if (pagina > 1) {
      setPagina((paginaActual) => paginaActual - 1);
    }
  };

  // ==========================================
  // PÁGINA SIGUIENTE
  // ==========================================

  const paginaSiguiente = () => {
    if (pagina < totalPaginas) {
      setPagina((paginaActual) => paginaActual + 1);
    }
  };

  // ==========================================
  // PANTALLA PRINCIPAL
  // ==========================================

  return (
    <div className="container mt-4">
      {/* VOLVER */}

      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Volver al Dashboard
      </button>

      {/* ======================================
          TÍTULO Y ACTUALIZAR
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👥 Gestión de Socios</h2>

        <button
          className="btn btn-primary"
          onClick={cargarSocios}
          disabled={cargando}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* ======================================
          MENSAJE PARA INSTRUCTOR
      ====================================== */}

      {!esAdmin && (
        <div className="alert alert-info">
          Podés consultar, buscar y filtrar los socios registrados.
        </div>
      )}

      {/* ======================================
          FORMULARIO
          SOLO ADMIN
      ====================================== */}

      {esAdmin && (
        <FormularioSocio
          agregarSocio={socioAEditar ? editarSocio : agregarSocio}
          socioAEditar={socioAEditar}
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
              <label className="form-label">🔍 Buscar socio</label>

              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={handleBusqueda}
              />
            </div>

            {/* FILTRO */}

            <div className="col-md-4">
              <label className="form-label">📄 Estado</label>

              <select
                className="form-select"
                value={filtroEstado}
                onChange={handleFiltroEstado}
              >
                <option value="Todos">Todos</option>

                <option value="Activo">Activos</option>

                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          CARGANDO
      ====================================== */}

      {cargando && <div className="alert alert-info">Cargando socios...</div>}

      {/* ======================================
          ERROR
      ====================================== */}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ======================================
          CONTADOR
      ====================================== */}

      {!cargando && !error && (
        <div className="mb-2">
          <strong>
            Mostrando {socios.length} de {total} socios
          </strong>
        </div>
      )}

      {/* ======================================
          TABLA
      ====================================== */}

      {!cargando && !error && (
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

                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {socios.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 6 : 5} className="text-center">
                    No se encontraron socios.
                  </td>
                </tr>
              ) : (
                socios.map((socio) => (
                  <tr key={socio.id}>
                    <td>{socio.id}</td>

                    <td>{socio.nombre}</td>

                    <td>{socio.email}</td>

                    <td>{socio.plan}</td>

                    <td>
                      <span
                        className={
                          socio.estado === "Activo"
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {socio.estado}
                      </span>
                    </td>

                    {/* ACCIONES SOLO ADMIN */}

                    {esAdmin && (
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => setSocioAEditar(socio)}
                        >
                          ✏️ Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminar(socio.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================
          PAGINACIÓN
      ====================================== */}

      {!cargando && !error && totalPaginas > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3 mb-4">
          <button
            className="btn btn-outline-primary"
            onClick={paginaAnterior}
            disabled={pagina === 1}
          >
            ← Anterior
          </button>

          <strong>
            Página {pagina} de {totalPaginas}
          </strong>

          <button
            className="btn btn-outline-primary"
            onClick={paginaSiguiente}
            disabled={pagina >= totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default Socios;
