import api from "./api";

// ==========================================
// OBTENER RESUMEN GENERAL
// Admin + Instructor
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
// OBTENER RESUMEN DE OCUPACIÓN
// Admin + Instructor
// ==========================================

export const obtenerResumenOcupacion = async () => {
  try {
    const respuesta = await api.get("/reportes/ocupacion");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener resumen de ocupación:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
// ==========================================
// OBTENER ALERTAS DE OCUPACIÓN
// Admin + Instructor
// ==========================================

export const obtenerAlertasOcupacion = async () => {
  try {
    const respuesta = await api.get(
      "/reportes/alertas-ocupacion"
    );

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener alertas de ocupación:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// OBTENER RESUMEN FINANCIERO
// Solo Admin
// ==========================================

export const obtenerResumenFinanciero = async () => {
  try {
    const respuesta = await api.get("/reportes/financiero");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener resumen financiero:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// OBTENER INGRESOS POR MES
// Solo Admin
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
