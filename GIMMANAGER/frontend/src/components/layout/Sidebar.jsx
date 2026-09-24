import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { usuario } = useAuth();

  // ==========================================
  // SABER SI EL USUARIO ES ADMIN
  // ==========================================

  const esAdmin =
    usuario?.rol === "admin";

  return (
    <div
      className="bg-light border-end p-3"
      style={{
        width: "230px",
        minHeight: "100vh",
      }}
    >
      <h5>Menú</h5>

      <ul className="nav flex-column">

        {/* ======================================
            DASHBOARD
            ADMIN + INSTRUCTOR
        ====================================== */}

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/dashboard"
          >
            🏠 Dashboard
          </Link>
        </li>

        {/* ======================================
            SOCIOS
            ADMIN + INSTRUCTOR
        ====================================== */}

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/socios"
          >
            👥 Socios
          </Link>
        </li>

        {/* ======================================
            PROFESORES
            ADMIN + INSTRUCTOR
        ====================================== */}

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/profesores"
          >
            🏋️ Profesores
          </Link>
        </li>

        {/* ======================================
            OPCIONES SOLO PARA ADMIN
        ====================================== */}

        {esAdmin && (
          <>
            {/* PAGOS */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/pagos"
              >
                💳 Pagos
              </Link>
            </li>

            {/* REPORTES */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/reportes"
              >
                📊 Reportes
              </Link>
            </li>

            {/* CONFIGURACIÓN */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/configuracion"
              >
                ⚙️ Configuración
              </Link>
            </li>
          </>
        )}

      </ul>
    </div>
  );
}

export default Sidebar;