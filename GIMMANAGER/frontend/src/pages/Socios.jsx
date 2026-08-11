import { useEffect, useState } from "react";

import {
  obtenerSocios,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} from "../services/sociosService";

import FormularioSocio from "../components/FormularioSocio";

function Socios() {
  const [socios, setSocios] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [socioAEditar, setSocioAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const cargarSocios = async () => {
    try {
      setCargando(true);

      const datos = await obtenerSocios();

      setSocios(datos);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los socios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSocios();
  }, []);

  const agregarSocio = async (socio) => {
    try {
      await crearSocio(socio);

      await cargarSocios();
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  //const editarSocio = async (socio) => {
  // try {
  //  await actualizarSocio(socio.id, socio);

  // setSocioAEditar(null);

  //   await cargarSocios();
  //} catch (error) {
  //console.error(error);

  //throw error;
  //}
  //};

  const editarSocio = async (socio) => {
    console.log("SOCIO QUE VOY A ACTUALIZAR:", socio);

    try {
      const resultado = await actualizarSocio(socio.id, socio);

      console.log("RESPUESTA DEL BACKEND:", resultado);

      setSocioAEditar(null);

      await cargarSocios();
    } catch (error) {
      console.error("ERROR AL ACTUALIZAR:", error);

      console.error("RESPUESTA DEL SERVIDOR:", error.response?.data);

      throw error;
    }
  };
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

      alert("No se pudo eliminar el socio.");
    }
  };
  const sociosFiltrados = socios.filter((socio) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      socio.nombre.toLowerCase().includes(texto) ||
      socio.email.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || socio.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  if (cargando) {
    return (
      <div className="container mt-4">
        <h3>Cargando socios...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>

        <button className="btn btn-primary" onClick={cargarSocios}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👥 Gestión de Socios</h2>

        <button className="btn btn-primary" onClick={cargarSocios}>
          🔄 Actualizar
        </button>
      </div>

      <FormularioSocio
        agregarSocio={socioAEditar ? editarSocio : agregarSocio}
        socioAEditar={socioAEditar}
      />
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <label className="form-label">🔍 Buscar socio</label>

              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">📄 Estado</label>

              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>

                <option value="Activo">Activos</option>

                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {sociosFiltrados.map((socio) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Socios;
