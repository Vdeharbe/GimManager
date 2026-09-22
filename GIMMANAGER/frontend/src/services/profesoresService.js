import api from "./api";

// ==========================================
// OBTENER TODOS LOS PROFESORES
// ==========================================

export const obtenerProfesores = async () => {
  try {
    const respuesta = await api.get("/profesores");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener profesores:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// ==========================================
// CREAR PROFESOR
// ==========================================

export const crearProfesor = async (profesor) => {
  try {
    const respuesta = await api.post("/profesores", profesor);

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al crear profesor:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// ==========================================
// ACTUALIZAR PROFESOR
// ==========================================

export const actualizarProfesor = async (id, profesor) => {
  try {
    const respuesta = await api.put(`/profesores/${id}`, profesor);

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al actualizar profesor:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// ==========================================
// ELIMINAR PROFESOR
// ==========================================

export const eliminarProfesor = async (id) => {
  try {
    const respuesta = await api.delete(
      `/profesores/${id}`
    );

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al eliminar profesor:",
      error.response?.data || error.message
    );

    throw error;
  }
};