import api from "./api";

// ==========================================
// OBTENER CONFIGURACIÓN DEL GIMNASIO
// ==========================================

export const obtenerConfiguracion = async () => {
  try {
    const respuesta = await api.get(
      "/configuracion"
    );

    return respuesta.data;

  } catch (error) {
    console.error(
      "❌ Error al obtener configuración:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// ACTUALIZAR CONFIGURACIÓN DEL GIMNASIO
// ==========================================

export const actualizarConfiguracion = async (
  id,
  datos
) => {
  try {
    const respuesta = await api.put(
      `/configuracion/${id}`,
      datos
    );

    return respuesta.data;

  } catch (error) {
    console.error(
      "❌ Error al actualizar configuración:",
      error.response?.data || error.message
    );

    throw error;
  }
};