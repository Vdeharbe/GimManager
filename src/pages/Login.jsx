import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h1>🏋️ Gym Manager</h1>
      <p>Bienvenido al sistema</p>

      <button className="btn btn-primary" onClick={() => navigate("/dashboard")}> 
        Iniciar Sesión
      </button>
    </div>
  );
}

export default Login;