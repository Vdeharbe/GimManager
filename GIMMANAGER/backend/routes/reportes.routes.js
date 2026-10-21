const express = require("express");

const router = express.Router();

const {
  obtenerResumen,
  obtenerResumenOcupacion,
  obtenerAlertasOcupacion,
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
// GET - RESUMEN DE OCUPACIÓN
// Admin + Instructor
// ==========================================

router.get(
  "/ocupacion",
  verificarToken,
  obtenerResumenOcupacion
);
// ==========================================
// GET - ALERTAS DE OCUPACIÓN
// Admin + Instructor
// ==========================================

router.get(
  "/alertas-ocupacion",
  verificarToken,
  obtenerAlertasOcupacion
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