function Sidebar() {
  return (
    <div
      className="bg-light border-end p-3"
      style={{ width: "230px", minHeight: "100vh" }}
    >
      <h5>Menú</h5>

      <ul className="nav flex-column">

        <li className="nav-item">
          <a className="nav-link" href="#">
            🏠 Inicio
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            👥 Socios
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            🏋️ Profesores
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            💳 Pagos
          </a>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;