const express = require("express");
const { verificarToken, verificarRol } = require("../middleware/auth.middleware");
const router = express.Router();

const {
  listarSocios,
  obtenerSocio,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} = require("../controllers/socios.controller");

router.get("/", verificarToken, listarSocios);
router.get("/:id", verificarToken, obtenerSocio);

router.post("/", verificarToken, verificarRol(["admin"]), crearSocio);
router.put("/:id", verificarToken, verificarRol(["admin"]), actualizarSocio);
router.delete("/:id", verificarToken, verificarRol(["admin"]), eliminarSocio);

module.exports = router;
