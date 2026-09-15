import api from "./api";

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const respuesta = await api.get("/usuarios");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener usuarios:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Registrar un usuario nuevo
export const registrarUsuario = async (usuario) => {
  try {
    const respuesta = await api.post("/usuarios/registrar", usuario);

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al registrar usuario:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// Actualizar usuario
export const actualizarUsuario = async (id, usuario) => {
  try {
    const respuesta = await api.put(`/usuarios/${id}`, usuario);

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al actualizar usuario:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  try {
    const respuesta = await api.delete(`/usuarios/${id}`);

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al eliminar usuario:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// Cambiar contraseña de un usuario
export const cambiarPassword = async (id, nuevaPassword) => {
  try {
    const respuesta = await api.put(`/usuarios/${id}/password`, {
      nuevaPassword,
    });

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al cambiar contraseña:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
