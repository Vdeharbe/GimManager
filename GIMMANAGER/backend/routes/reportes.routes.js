const express = require("express");
const router = express.Router();

const {
  obtenerResumen,
  obtenerIngresosPorMes,
} = require("../controllers/reportes.controller");

const {
  verificarToken,
} = require("../middleware/auth.middleware");

// ==========================================
// GET - RESUMEN GENERAL
// ==========================================

router.get(
  "/resumen",
  verificarToken,
  obtenerResumen
);
// ==========================================
// GET - INGRESOS MENSUALES
// ==========================================

router.get(
  "/ingresos-mensuales",
  verificarToken,
  obtenerIngresosPorMes
);

// ==========================================
// EXPORTAR
// ==========================================

module.exports = router;