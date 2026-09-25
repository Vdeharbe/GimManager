import api from "./api";

// ==========================================
// OBTENER TODOS LOS HORARIOS
// ==========================================

export const obtenerHorarios = async () => {
  const response = await api.get("/horarios");

  return response.data;
};

// ==========================================
// OBTENER HORARIO POR ID
// ==========================================

export const obtenerHorario = async (id) => {
  const response = await api.get(
    `/horarios/${id}`
  );

  return response.data;
};

// ==========================================
// CREAR HORARIO
// ==========================================

export const crearHorario = async (horario) => {
  const response = await api.post(
    "/horarios",
    horario
  );

  return response.data;
};

// ==========================================
// ACTUALIZAR HORARIO
// ==========================================

export const actualizarHorario = async (
  id,
  horario
) => {
  const response = await api.put(
    `/horarios/${id}`,
    horario
  );

  return response.data;
};

// ==========================================
// ELIMINAR HORARIO
// ==========================================

export const eliminarHorario = async (id) => {
  const response = await api.delete(
    `/horarios/${id}`
  );

  return response.data;
};