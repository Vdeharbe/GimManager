const express = require("express");

const {
  obtenerHorarios,
  obtenerHorario,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} = require("../controllers/horarios.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// OBTENER TODOS LOS HORARIOS
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerHorarios
);

// ==========================================
// OBTENER HORARIO POR ID
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  obtenerHorario
);

// ==========================================
// CREAR HORARIO
// ADMIN + INSTRUCTOR
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin", "instructor"),
  crearHorario
);

// ==========================================
// ACTUALIZAR HORARIO
// ADMIN + INSTRUCTOR
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin", "instructor"),
  actualizarHorario
);

// ==========================================
// ELIMINAR HORARIO
// SOLO ADMIN
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarHorario
);

module.exports = router;