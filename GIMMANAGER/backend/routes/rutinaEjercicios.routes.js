const express = require("express");

const {
  obtenerEjerciciosPorRutina,
  obtenerEjercicio,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
} = require("../controllers/rutinaEjercicios.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// OBTENER EJERCICIOS DE UNA RUTINA
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/rutina/:rutinaId",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerEjerciciosPorRutina
);

// ==========================================
// OBTENER EJERCICIO POR ID
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerEjercicio
);

// ==========================================
// CREAR EJERCICIO
// ADMIN + INSTRUCTOR
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  crearEjercicio
);

// ==========================================
// ACTUALIZAR EJERCICIO
// ADMIN + INSTRUCTOR
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  actualizarEjercicio
);

// ==========================================
// ELIMINAR EJERCICIO
// SOLO ADMIN
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarEjercicio
);

module.exports = router;