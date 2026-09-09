import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RoleRoute({ children, roles }) {
  const { usuario } = useAuth();

  // Primero comprobamos que haya iniciado sesión
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Comprobamos si el rol del usuario está permitido
  if (!roles.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;