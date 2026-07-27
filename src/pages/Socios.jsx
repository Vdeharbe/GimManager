import socios from "../data/socios";

function Socios() {
  return (
    <div className="container mt-4">
      <h2>👥 Gestión de Socios</h2>

      <table className="table table-striped table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {socios.map((socio) => (
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

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Socios;