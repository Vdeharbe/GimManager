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
                   
{/* SOCIOS */}
<li className="nav-item">
  <Link className="nav-link" to="/socios" onClick={cerrarMenu}>
    <span className="sidebar-icon">👥</span>
    <span>Socios</span>
  </Link>
</li>

{/* PROFESORES */}
<li className="nav-item">
  <Link className="nav-link" to="/profesores" onClick={cerrarMenu}>
    <span className="sidebar-icon">🏋️</span>
    <span>Profesores</span>
  </Link>
</li>

{/* RUTINAS */}
<li className="nav-item">
  <Link className="nav-link" to="/rutinas" onClick={cerrarMenu}>
    <span className="sidebar-icon">📝</span>
    <span>Rutinas</span>
  </Link>
</li>

{/* HORARIOS */}
<li className="nav-item">
  <Link className="nav-link" to="/horarios" onClick={cerrarMenu}>
    <span className="sidebar-icon">🕒</span>
    <span>Horarios</span>
  </Link>
</li>

{/* INSCRIPCIONES */}
<li className="nav-item">
  <Link className="nav-link" to="/inscripciones" onClick={cerrarMenu}>
    <span className="sidebar-icon">🎟️</span>
    <span>Inscripciones</span>
  </Link>
</li>

          {/* ======================================
              OPCIONES SOLO PARA ADMIN
          ====================================== */}

          {esAdmin && (
            <>
             <li className="nav-item">
  <Link className="nav-link" to="/pagos" onClick={cerrarMenu}>
    <span className="sidebar-icon">💳</span>
    <span>Pagos</span>
  </Link>
</li>

<li className="nav-item">
  <Link className="nav-link" to="/reportes" onClick={cerrarMenu}>
    <span className="sidebar-icon">📊</span>
    <span>Reportes</span>
  </Link>
</li>

<li className="nav-item">
  <Link
    className="nav-link"
    to="/configuracion"
    onClick={cerrarMenu}
  >
    <span className="sidebar-icon">⚙️</span>
    <span>Configuración</span>
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
