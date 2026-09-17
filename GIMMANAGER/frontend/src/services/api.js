import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// INTERCEPTOR DE REQUEST
// Agrega automáticamente el token JWT
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR DE RESPONSE
// Detecta token inválido o expirado
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Eliminar sesión guardada
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      // Evitar redirección innecesaria
      // si ya estamos en el login
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;