const express = require("express");

const {
  obtenerProfesores,
  obtenerProfesor,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
} = require("../controllers/profesores.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// LISTAR PROFESORES
// Cualquier usuario autenticado puede consultar
// ==========================================

router.get("/", verificarToken, obtenerProfesores);
// ==========================================
// OBTENER PROFESOR POR ID
// ==========================================

router.get("/:id", verificarToken, obtenerProfesor);
// ==========================================
// CREAR PROFESOR
// SOLO ADMIN
// ==========================================

router.post("/", verificarToken, verificarRol("admin"), crearProfesor);
// ==========================================
// ACTUALIZAR PROFESOR
// SOLO ADMIN
// ==========================================

router.put("/:id", verificarToken, verificarRol("admin"), actualizarProfesor);
// ==========================================
// ELIMINAR PROFESOR
// SOLO ADMIN
// ==========================================

router.delete("/:id", verificarToken, verificarRol("admin"), eliminarProfesor);
module.exports = router;
