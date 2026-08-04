import { useAuth } from "../../context/AuthContext";



function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand mb-0 h1">🏋️ Gym Manager</span>

      <div className="d-flex align-items-center gap-3">
        {usuario && (
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle border border-light d-flex align-items-center justify-content-center overflow-hidden"
              style={{ width: 40, height: 40, backgroundColor: "#f8f9fa" }}
            >
              {usuario.foto ? (
                <img
                  src={usuario.foto}
                  alt={usuario.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 20 }}>👤</span>
              )}
            </div>

            <span className="text-white">
              {usuario ? `Hola, ${usuario.nombre}` : "Inicia sesión"}
            </span>
          </div>
        )}

        {!usuario && <span className="text-white">Inicia sesión</span>}

        {usuario && (
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Salir
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;