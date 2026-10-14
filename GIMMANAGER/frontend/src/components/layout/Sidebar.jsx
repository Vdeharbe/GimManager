import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { usuario } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // ==========================================
  // SABER SI EL USUARIO ES ADMIN
  // ==========================================

  const esAdmin = usuario?.rol === "admin";

  // Cierra el menú móvil cuando elegimos una opción
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <>
      {/* ==========================================
          BOTÓN MENÚ - SOLO CELULAR
      ========================================== */}

     <div className="d-md-none w-100 bg-light border-bottom p-2">
  <button
    className="btn btn-sm btn-outline-dark"
    onClick={() => setMenuAbierto(!menuAbierto)}
  >
    {menuAbierto ? "✕ Cerrar" : "☰ Menú"}
  </button>
</div>
      {/* ==========================================
          SIDEBAR
          
          PC: siempre visible
          CELULAR: depende de menuAbierto
      ========================================== */}

      <div
  className={`
    sidebar-fit bg-light border-end
    ${menuAbierto ? "d-block" : "d-none"}
    d-md-block
  `}
      >
        <ul className="nav flex-column">
          {/* DASHBOARD */}

          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" onClick={cerrarMenu}>
              🏠 Dashboard
            </Link>
          </li>

          {/* SOCIOS */}

          <li className="nav-item">
            <Link className="nav-link" to="/socios" onClick={cerrarMenu}>
              👥 Socios
            </Link>
          </li>

          {/* PROFESORES */}

          <li className="nav-item">
            <Link className="nav-link" to="/profesores" onClick={cerrarMenu}>
              🏋️ Profesores
            </Link>
          </li>

          {/* RUTINAS */}

          <li className="nav-item">
            <Link className="nav-link" to="/rutinas" onClick={cerrarMenu}>
              📝 Rutinas
            </Link>
          </li>

          {/* HORARIOS */}

          <li className="nav-item">
            <Link className="nav-link" to="/horarios" onClick={cerrarMenu}>
              🕒 Horarios
            </Link>
          </li>

          {/* INSCRIPCIONES */}

          <li className="nav-item">
            <Link className="nav-link" to="/inscripciones" onClick={cerrarMenu}>
              🎟️ Inscripciones
            </Link>
          </li>

          {/* ======================================
              OPCIONES SOLO PARA ADMIN
          ====================================== */}

          {esAdmin && (
            <>
              {/* PAGOS */}

              <li className="nav-item">
                <Link className="nav-link" to="/pagos" onClick={cerrarMenu}>
                  💳 Pagos
                </Link>
              </li>

              {/* REPORTES */}

              <li className="nav-item">
                <Link className="nav-link" to="/reportes" onClick={cerrarMenu}>
                  📊 Reportes
                </Link>
              </li>

              {/* CONFIGURACIÓN */}

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/configuracion"
                  onClick={cerrarMenu}
                >
                  ⚙️ Configuración
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
