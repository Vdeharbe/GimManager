import { useState } from "react";
import sociosIniciales from "../data/socios";

function Socios() {
  const datosGuardados = localStorage.getItem("socios");
  const [socios, setSocios] = useState(
    datosGuardados ? JSON.parse(datosGuardados) : sociosIniciales,
  );
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");

  const agregarSocio = () => {
    const nombre = document.getElementById("nombre")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const plan = document.getElementById("plan")?.value || "Premium";

    if (!nombre || !email) return;

    const nuevoSocio = {
      id: Date.now(),
      nombre,
      email,
      plan,
      estado: "Activo",
    };

    setSocios((prevSocios) => [nuevoSocio, ...prevSocios]);
  };

  const buscarSocio = (e) => {
    setBusqueda(e.target.value);
  };

  const eliminarSocio = (id) => {
    const nuevaLista = socios.filter((socio) => socio.id !== id);

    setSocios(nuevaLista);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h4>Nuevo Socio</h4>

          <input
            className="form-control mb-2"
            placeholder="Nombre"
            id="nombre"
          />

          <input className="form-control mb-2" placeholder="Email" id="email" />

          <select className="form-select mb-2" id="plan">
            <option>Premium</option>
            <option>Básico</option>
          </select>

          <button className="btn btn-primary" onClick={agregarSocio}>
            Agregar
          </button>
        </div>
      </div>

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
