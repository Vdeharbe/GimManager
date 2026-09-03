import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const ingresar = async () => {
    if (!email || !password) {
      alert("Por favor completa email y contraseña");
      return;
    }

    try {
      setCargando(true);
      console.log("📧 Enviando credenciales...");
      
      const ok = await login(email, password);

      if (ok) {
        console.log("✅ Login exitoso, redirigiendo...");
        navigate("/dashboard");
      } else {
        console.error("❌ Login fallido");
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("❌ Error durante login:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={cargando}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={cargando}
      />

      <button 
        className="btn btn-primary" 
        onClick={ingresar}
        disabled={cargando}
      >
        {cargando ? "Cargando..." : "Ingresar"}
      </button>
    </div>
  );
}

export default Login;
