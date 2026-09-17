import { createContext, useContext, useEffect, useState } from "react";

import { loginUsuario } from "../services/authService";
import { obtenerPerfil } from "../services/usuariosService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");

    return guardado ? JSON.parse(guardado) : null;
  });

  // Indica si todavía estamos comprobando
  // la sesión guardada.
  const [validandoSesion, setValidandoSesion] = useState(true);

  // ==========================================
  // GUARDAR USUARIO EN LOCALSTORAGE
  // ==========================================

  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  // ==========================================
  // VALIDAR SESIÓN AL ABRIR LA APLICACIÓN
  // ==========================================

  useEffect(() => {
    const validarSesion = async () => {
      const token = localStorage.getItem("token");

      // Si no hay token, no existe una sesión
      // que necesitemos validar.
      if (!token) {
        setUsuario(null);
        setValidandoSesion(false);
        return;
      }

      try {
        // Consultamos al backend.
        // Axios agrega automáticamente el JWT.
        const respuesta = await obtenerPerfil();

        if (respuesta.usuario) {
          setUsuario(respuesta.usuario);
        } else {
          setUsuario(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("❌ Sesión inválida o expirada:", error);

        setUsuario(null);
        localStorage.removeItem("token");
      } finally {
        setValidandoSesion(false);
      }
    };

    validarSesion();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const respuesta = await loginUsuario(email, password);

      if (respuesta.usuario && respuesta.token) {
        setUsuario(respuesta.usuario);

        localStorage.setItem("token", respuesta.token);

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Error en AuthContext.login:", error);

      return false;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    setUsuario(null);

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  // ==========================================
  // ESPERAR VALIDACIÓN INICIAL
  // ==========================================

  if (validandoSesion) {
    return (
      <div className="container mt-5 text-center">
        <p>Validando sesión...</p>
      </div>
    );
  }

  // ==========================================
  // CONTEXTO
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        validandoSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
