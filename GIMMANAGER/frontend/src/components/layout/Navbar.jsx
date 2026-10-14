import { useAuth } from "../../context/AuthContext";

import logoFitControl from "../../assets/Logotipo.png";

function Navbar() {
  const { usuario, logout } = useAuth();

 return (
  <nav
    className="navbar navbar-dark px-3 py-2"
    style={{ backgroundColor: "var(--dark)" }}
  >
    <div className="container-fluid p-0 d-flex justify-content-between align-items-center flex-nowrap">

      {/* LOGO */}
      <img
        src={logoFitControl}
        alt="Fit Control"
        style={{
          height: "45px",
          width: "auto",
          objectFit: "contain",
        }}
      />

      {/* USUARIO */}
      {usuario && (
        <div className="d-flex align-items-center gap-2">

          <div
            className="rounded-circle border border-light d-flex align-items-center justify-content-center overflow-hidden"
            style={{
              width: 34,
              height: 34,
              minWidth: 34,
              backgroundColor: "#f8f9fa",
            }}
          >
            {usuario.foto ? (
              <img
                src={usuario.foto}
                alt={usuario.nombre}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{ fontSize: 17 }}>👤</span>
            )}
          </div>

          <span className="text-white d-none d-md-inline">
            Hola, {usuario.nombre}
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={logout}
          >
            Salir
          </button>

        </div>
      )}

    </div>
  </nav>
);
}

export default Navbar;
