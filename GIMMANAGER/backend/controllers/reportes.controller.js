const Reportes = require("../models/reportes.model");

// ==========================================
// OBTENER RESUMEN GENERAL
// Admin + Instructor
// ==========================================

const obtenerResumen = (req, res) => {
  Reportes.obtenerResumen(
    (error, resultados) => {

      if (error) {
        console.error(
          "Error al obtener resumen:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener el resumen",
        });
      }

      // La consulta devuelve una sola fila.
      // Por eso enviamos resultados[0].

      res.json(resultados[0]);
    }
  );
};

// ==========================================
// OBTENER RESUMEN FINANCIERO
// Solo Admin
// ==========================================

const obtenerResumenFinanciero = (
  req,
  res
) => {
  Reportes.obtenerResumenFinanciero(
    (error, resultados) => {

      if (error) {
        console.error(
          "Error al obtener resumen financiero:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener el resumen financiero",
        });
      }

      // La consulta devuelve una sola fila.

      res.json(resultados[0]);
    }
  );
};

// ==========================================
// OBTENER INGRESOS POR MES
// Solo Admin
// ==========================================

const obtenerIngresosPorMes = (
  req,
  res
) => {
  Reportes.obtenerIngresosPorMes(
    (error, resultados) => {

      if (error) {
        console.error(
          "Error al obtener ingresos por mes:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener los ingresos por mes",
        });
      }

      res.json(resultados);
    }
  );
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerResumen,
  obtenerResumenFinanciero,
  obtenerIngresosPorMes,
};