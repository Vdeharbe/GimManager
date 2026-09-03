import api from "./api";

export const obtenerSocios = async () => {
  const respuesta = await api.get("/socios");
  return respuesta.data.socios;
};
export const crearSocio = async (socio) => {
  const respuesta = await api.post("/socios", socio);
  return respuesta.data;
};


export const actualizarSocio = async (id, socio) => {
  const respuesta = await api.put(`/socios/${id}`, socio);
  return respuesta.data;
};

export const eliminarSocio = async (id) => {
  const respuesta = await api.delete(`/socios/${id}`);
  return respuesta.data;
};
