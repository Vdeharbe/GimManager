import api from "./api";

export const obtenerSocios = async () => {
  const respuesta = await api.get("/socios");
  return respuesta.data;
};