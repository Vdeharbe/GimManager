const express = require("express");
const { verificarToken } = require("../middleware/auth.middleware");
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

router.post("/", verificarToken, crearSocio);

router.put("/:id", verificarToken, actualizarSocio);

router.delete("/:id", verificarToken, eliminarSocio);

module.exports = router;
