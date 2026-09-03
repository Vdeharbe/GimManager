import { createContext, useContext, useEffect, useState } from "react";
import { loginUsuario } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  const login = async (email, password) => {
    try {
      console.log("🔐 AuthContext.login iniciado");
      const respuesta = await loginUsuario(email, password);
      
      console.log("📨 Respuesta completa:", respuesta);
      console.log("👤 Usuario en respuesta:", respuesta.usuario);
      
      if (respuesta.usuario) {
        console.log("✅ Usuario validado, guardando en estado");
        setUsuario(respuesta.usuario);
        return true;
      }
      
      console.error("❌ No hay usuario en la respuesta");
      return false;
    } catch (error) {
      console.error("❌ Error en AuthContext.login:", error);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}