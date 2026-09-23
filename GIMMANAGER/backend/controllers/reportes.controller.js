const Reportes = require("../models/reportes.model");

// ==========================================
// OBTENER RESUMEN GENERAL
// ==========================================

const obtenerResumen = (req, res) => {
  Reportes.obtenerResumen((error, resultados) => {

    if (error) {
      console.error(
        "Error al obtener resumen:",
        error
      );

      return res.status(500).json({
        mensaje: "Error al obtener el resumen",
      });
    }

    // La consulta devuelve una sola fila.
    // Por eso enviamos resultados[0].

    res.json(resultados[0]);
  });
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerResumen,
};