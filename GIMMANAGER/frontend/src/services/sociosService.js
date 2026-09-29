import api from "./api";

// ==========================================
// OBTENER SOCIOS
// ==========================================

export const obtenerSocios = async (filtros = null) => {
  // ========================================
  // SIN FILTROS / SIN PAGINACIÓN
  // ========================================

  if (!filtros) {
    const respuesta = await api.get("/socios");

    return respuesta.data.socios || [];
  }

  // ========================================
  // CON BÚSQUEDA / FILTRO / PAGINACIÓN
  // ========================================

  const respuesta = await api.get("/socios", {
    params: {
      buscar: filtros.buscar || "",

      estado: filtros.estado || "",

      page: filtros.page || 1,

      limit: filtros.limit || 5,
    },
  });

  return {
    socios: respuesta.data.socios || [],

    paginacion: respuesta.data.paginacion || {
      pagina: 1,
      limite: filtros.limit || 5,
      total: 0,
      totalPaginas: 0,
    },
  };
};

// ==========================================
// CREAR SOCIO
// ==========================================

export const crearSocio = async (socio) => {
  const respuesta = await api.post("/socios", socio);

  return respuesta.data;
};

// ==========================================
// ACTUALIZAR SOCIO
// ==========================================

export const actualizarSocio = async (id, socio) => {
  const respuesta = await api.put(`/socios/${id}`, socio);

  return respuesta.data;
};

// ==========================================
// ELIMINAR SOCIO
// ==========================================

export const eliminarSocio = async (id) => {
  const respuesta = await api.delete(`/socios/${id}`);

  return respuesta.data;
};
