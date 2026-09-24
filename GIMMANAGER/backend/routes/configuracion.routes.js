const express = require("express");
const router = express.Router();

const {
  obtenerConfiguracion,
  actualizarConfiguracion,
} = require("../controllers/configuracion.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

// ==========================================
// GET - OBTENER CONFIGURACIÓN
// Solo administrador
// ==========================================

router.get(
  "/",
  verificarToken,
  verificarRol("admin"),
  obtenerConfiguracion
);

// ==========================================
// PUT - ACTUALIZAR CONFIGURACIÓN
// Solo administrador
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarConfiguracion
);

module.exports = router;