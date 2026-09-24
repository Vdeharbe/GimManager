const express = require("express");

const router = express.Router();

const {
  obtenerResumen,
  obtenerResumenFinanciero,
  obtenerIngresosPorMes,
} = require("../controllers/reportes.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

// ==========================================
// GET - RESUMEN GENERAL
// Admin + Instructor
// ==========================================

router.get(
  "/resumen",
  verificarToken,
  obtenerResumen
);

// ==========================================
// GET - RESUMEN FINANCIERO
// Solo Admin
// ==========================================

router.get(
  "/financiero",
  verificarToken,
  verificarRol("admin"),
  obtenerResumenFinanciero
);

// ==========================================
// GET - INGRESOS MENSUALES
// Solo Admin
// ==========================================

router.get(
  "/ingresos-mensuales",
  verificarToken,
  verificarRol("admin"),
  obtenerIngresosPorMes
);

// ==========================================
// EXPORTAR
// ==========================================

module.exports = router;