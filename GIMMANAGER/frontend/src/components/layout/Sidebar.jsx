import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-light border-end p-3" style={{ width: "230px", minHeight: "100vh" }}>
      <h5>Menú</h5>

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            🏠 Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/socios">
            👥 Socios
          </Link>
        </li>
        
        <li className="nav-item">
          <Link className="nav-link" to="/profesores">
            🏋️ Profesores
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/pagos">
            💳 Pagos
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reportes">
            � Reportes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/configuracion">
            ⚙️ Configuración
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;