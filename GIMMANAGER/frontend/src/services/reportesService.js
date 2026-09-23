import api from "./api";

// ==========================================
// OBTENER RESUMEN GENERAL
// ==========================================

export const obtenerResumen = async () => {
  try {
    const respuesta = await api.get("/reportes/resumen");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener resumen:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// ==========================================
// OBTENER INGRESOS POR MES
// ==========================================

export const obtenerIngresosPorMes = async () => {
  try {
    const respuesta = await api.get("/reportes/ingresos-mensuales");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener ingresos mensuales:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
