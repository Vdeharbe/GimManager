const express = require("express");
const router = express.Router();

const {
  obtenerResumen,
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
// EXPORTAR
// ==========================================

module.exports = router;