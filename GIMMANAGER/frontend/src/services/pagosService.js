import api from "./api";

// ==========================================
// OBTENER TODOS LOS PAGOS
// ==========================================

export const obtenerPagos = async () => {
  try {
    const respuesta = await api.get("/pagos");

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener pagos:",
      error.response?.data || error.message
    );

    throw error;
  }
};
// ==========================================
// CREAR PAGO
// ==========================================

export const crearPago = async (pago) => {
  try {
    const respuesta = await api.post(
      "/pagos",
      pago
    );

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al crear pago:",
      error.response?.data || error.message
    );

    throw error;
  }
};
// ==========================================
// ACTUALIZAR PAGO
// ==========================================

export const actualizarPago = async (id, pago) => {
  try {
    const respuesta = await api.put(
      `/pagos/${id}`,
      pago
    );

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al actualizar pago:",
      error.response?.data || error.message
    );

    throw error;
  }
};
// ==========================================
// ELIMINAR PAGO
// ==========================================

export const eliminarPago = async (id) => {
  try {
    const respuesta = await api.delete(
      `/pagos/${id}`
    );

    return respuesta.data;
  } catch (error) {
    console.error(
      "❌ Error al eliminar pago:",
      error.response?.data || error.message
    );

    throw error;
  }
};