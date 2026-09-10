const express = require("express");

const {
  registrarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarios.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();
router.get("/", verificarToken, verificarRol("admin"), obtenerUsuarios);

router.post(
  "/registrar",
  verificarToken,
  verificarRol("admin"),
  registrarUsuario,
);
// EDITAR USUARIO → SOLO ADMIN
router.put("/:id", verificarToken, verificarRol("admin"), actualizarUsuario);

// ELIMINAR USUARIO → SOLO ADMIN
router.delete("/:id", verificarToken, verificarRol("admin"), eliminarUsuario);

module.exports = router;
