import { useEffect, useState } from "react";
import sociosIniciales from "../data/socios";
import FormularioSocio from "../components/FormularioSocio";

function Socios() {
  const [socios, setSocios] = useState(() => {
    const guardados = localStorage.getItem("socios");

    return guardados ? JSON.parse(guardados) : sociosIniciales;
  });
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    plan: "Premium",
  });
  const [socioEditandoId, setSocioEditandoId] = useState(null);

  useEffect(() => {
    localStorage.setItem("socios", JSON.stringify(socios));
  }, [socios]);

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
      <FormularioSocio agregarSocio={guardarSocio} />

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
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

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
      </div>
    </div>
  );
}

export default Socios;
