import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sociosIniciales from "../data/socios";
import FormularioSocio from "../components/FormularioSocio";
import { obtenerSocios } from "../services/sociosService";

function Socios() {
  const navigate = useNavigate();
  const [socios, setSocios] = useState(() => {
    const guardados = localStorage.getItem("socios");

    return guardados ? JSON.parse(guardados) : sociosIniciales;
  });
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    plan: "Premium",
  });
  const [socioEditandoId, setSocioEditandoId] = useState(null);

  useEffect(() => {
    localStorage.setItem("socios", JSON.stringify(socios));
  }, [socios]);

  const cargarSocios = async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = await obtenerSocios();
      setSocios(datos);
    } catch (err) {
      setError("No se pudieron cargar los socios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSocios();
  }, []);

  const resetForm = () => {
    setFormData({ nombre: "", email: "", plan: "Premium" });
    setSocioEditandoId(null);
  };

  const guardarSocio = (socioData) => {
    const nombre = (socioData?.nombre ?? formData.nombre).trim();
    const email = (socioData?.email ?? formData.email).trim();
    const plan = (socioData?.plan ?? formData.plan) || "Premium";

    if (!nombre || !email) return;

    if (socioEditandoId !== null) {
      setSocios((prevSocios) =>
        prevSocios.map((socio) =>
          socio.id === socioEditandoId
            ? { ...socio, nombre, email, plan }
            : socio,
        ),
      );
    } else {
      const nuevoSocio = {
        id: Date.now(),
        nombre,
        email,
        plan,
        estado: "Activo",
      };

      setSocios((prevSocios) => [nuevoSocio, ...prevSocios]);
    }

    resetForm();
  };

  const editarSocio = (id) => {
    const socio = socios.find((item) => item.id === id);

    if (!socio) return;

    setFormData({
      nombre: socio.nombre,
      email: socio.email,
      plan: socio.plan,
    });
    setSocioEditandoId(id);
  };

  const buscarSocio = (e) => {
    setBusqueda(e.target.value);
  };

  const eliminarSocio = (id) => {
    setSocios((prevSocios) => prevSocios.filter((socio) => socio.id !== id));
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <FormularioSocio
        agregarSocio={guardarSocio}
        socioAEditar={
          socios.find((socio) => socio.id === socioEditandoId) || null
        }
      />

      <div>
        <h2>👥 Gestión de Socios</h2>

        <input
          className="form-control mb-3"
          placeholder="Buscar"
          value={busqueda}
          onChange={buscarSocio}
        />

        <select
          className="form-select mb-3"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <button
          className="btn btn-outline-primary mb-3"
          onClick={cargarSocios}
          disabled={cargando}
        >
          {cargando ? "⏳ Actualizando..." : "🔄 Actualizar"}
        </button>

        {error ? (
          <div className="alert alert-danger mt-3">{error}</div>
        ) : cargando ? (
          <div className="d-flex align-items-center gap-2 mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <span>Cargando socios...</span>
          </div>
        ) : (
          <table className="table table-striped table-hover mt-3">
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
              {socios
                .filter((socio) => {
                  if (filtro === "") return true;

                  return socio.estado === filtro;
                })
                .filter((socio) =>
                  socio.nombre.toLowerCase().includes(busqueda.toLowerCase()),
                )
                .map((socio) => (
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
                        onClick={() => editarSocio(socio.id)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarSocio(socio.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Socios;
