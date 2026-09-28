import api from "./api";

// ==========================================
// OBTENER TODAS LAS INSCRIPCIONES
// ==========================================

export const obtenerInscripciones = async () => {
  const response = await api.get(
    "/inscripciones"
  );

  return response.data;
};

// ==========================================
// OBTENER INSCRIPCIÓN POR ID
// ==========================================

export const obtenerInscripcion = async (
  id
) => {
  const response = await api.get(
    `/inscripciones/${id}`
  );

  return response.data;
};

// ==========================================
// CREAR INSCRIPCIÓN
// ==========================================

export const crearInscripcion = async (
  inscripcion
) => {
  const response = await api.post(
    "/inscripciones",
    inscripcion
  );

  return response.data;
};

// ==========================================
// ACTUALIZAR INSCRIPCIÓN
// ==========================================

export const actualizarInscripcion = async (
  id,
  inscripcion
) => {
  const response = await api.put(
    `/inscripciones/${id}`,
    inscripcion
  );

  return response.data;
};

// ==========================================
// ELIMINAR INSCRIPCIÓN
// ==========================================

export const eliminarInscripcion = async (
  id
) => {
  const response = await api.delete(
    `/inscripciones/${id}`
  );

  return response.data;
};