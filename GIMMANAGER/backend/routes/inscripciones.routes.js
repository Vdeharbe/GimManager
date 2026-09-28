const express = require("express");

const {
  obtenerInscripciones,
  obtenerInscripcion,
  crearInscripcion,
  actualizarInscripcion,
  eliminarInscripcion,
} = require("../controllers/inscripciones.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// OBTENER TODAS LAS INSCRIPCIONES
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerInscripciones
);

// ==========================================
// OBTENER INSCRIPCIÓN POR ID
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerInscripcion
);

// ==========================================
// CREAR INSCRIPCIÓN
// ADMIN + INSTRUCTOR
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  crearInscripcion
);

// ==========================================
// ACTUALIZAR INSCRIPCIÓN
// ADMIN + INSTRUCTOR
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  actualizarInscripcion
);

// ==========================================
// ELIMINAR INSCRIPCIÓN
// SOLO ADMIN
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarInscripcion
);

module.exports = router;