const express = require("express");

const {
  obtenerRutinas,
  obtenerRutina,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
} = require("../controllers/rutinas.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// OBTENER TODAS LAS RUTINAS
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerRutinas
);

// ==========================================
// OBTENER RUTINA POR ID
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerRutina
);

// ==========================================
// CREAR RUTINA
// ADMIN + INSTRUCTOR
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  crearRutina
);

// ==========================================
// ACTUALIZAR RUTINA
// ADMIN + INSTRUCTOR
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  actualizarRutina
);

// ==========================================
// ELIMINAR RUTINA
// SOLO ADMIN
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarRutina
);

module.exports = router;