import api from "./api";

// ==========================================
// OBTENER EJERCICIOS DE UNA RUTINA
// ==========================================

export const obtenerEjerciciosPorRutina = async (
  rutinaId
) => {
  const response = await api.get(
    `/rutina-ejercicios/rutina/${rutinaId}`
  );

  return response.data;
};


// ==========================================
// OBTENER EJERCICIO POR ID
// ==========================================

export const obtenerEjercicio = async (id) => {
  const response = await api.get(
    `/rutina-ejercicios/${id}`
  );

  return response.data;
};


// ==========================================
// CREAR EJERCICIO
// ==========================================

export const crearEjercicio = async (
  ejercicio
) => {
  const response = await api.post(
    "/rutina-ejercicios",
    ejercicio
  );

  return response.data;
};


// ==========================================
// ACTUALIZAR EJERCICIO
// ==========================================

export const actualizarEjercicio = async (
  id,
  ejercicio
) => {
  const response = await api.put(
    `/rutina-ejercicios/${id}`,
    ejercicio
  );

  return response.data;
};


// ==========================================
// ELIMINAR EJERCICIO
// ==========================================

export const eliminarEjercicio = async (id) => {
  const response = await api.delete(
    `/rutina-ejercicios/${id}`
  );

  return response.data;
};