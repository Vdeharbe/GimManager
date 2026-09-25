import api from "./api";

// ==========================================
// OBTENER TODAS LAS RUTINAS
// ==========================================

export const obtenerRutinas = async () => {
  const response = await api.get("/rutinas");

  return response.data;
};


// ==========================================
// OBTENER RUTINA POR ID
// ==========================================

export const obtenerRutina = async (id) => {
  const response = await api.get(
    `/rutinas/${id}`
  );

  return response.data;
};


// ==========================================
// CREAR RUTINA
// ==========================================

export const crearRutina = async (rutina) => {
  const response = await api.post(
    "/rutinas",
    rutina
  );

  return response.data;
};


// ==========================================
// ACTUALIZAR RUTINA
// ==========================================

export const actualizarRutina = async (
  id,
  rutina
) => {
  const response = await api.put(
    `/rutinas/${id}`,
    rutina
  );

  return response.data;
};


// ==========================================
// ELIMINAR RUTINA
// ==========================================

export const eliminarRutina = async (id) => {
  const response = await api.delete(
    `/rutinas/${id}`
  );

  return response.data;
};