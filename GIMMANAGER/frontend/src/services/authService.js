import api from "./api";

export const loginUsuario = async (email, password) => {
  try {
    console.log("🔐 Intentando login con:", { email, password });
    
    const respuesta = await api.post("/login", { 
      email, 
      password 
    });
    
    console.log("✅ Respuesta del servidor:", respuesta.data);
    
    return respuesta.data;
  } catch (error) {
    console.error("❌ Error en login:", error.response?.data || error.message);
    throw error;
  }
};
