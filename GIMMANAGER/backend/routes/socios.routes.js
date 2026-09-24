const express = require("express");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

const {
  listarSocios,
  obtenerSocio,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} = require("../controllers/socios.controller");

// ==========================================
// GET - LISTAR SOCIOS
// Admin + Instructor
// ==========================================

router.get(
  "/",
  verificarToken,
  listarSocios
);

// ==========================================
// GET - OBTENER SOCIO
// Admin + Instructor
// ==========================================

router.get(
  "/:id",
  verificarToken,
  obtenerSocio
);

// ==========================================
// POST - CREAR SOCIO
// Solo Admin
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearSocio
);

// ==========================================
// PUT - ACTUALIZAR SOCIO
// Solo Admin
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarSocio
);

// ==========================================
// DELETE - ELIMINAR SOCIO
// Solo Admin
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarSocio
);

module.exports = router;