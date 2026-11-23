
import api from "./api";

// ==========================================
// INICIAR SESIÓN
// ==========================================

export const loginUsuario = async (email, password) => {
  try {
    // Enviar las credenciales al backend
    const respuesta = await api.post("/login", {
      email,
      password
    });

    // Devolver los datos al componente
    return respuesta.data;

  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error.response?.status || error.message
    );

    throw error;
  }
};
