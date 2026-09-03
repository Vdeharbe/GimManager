const express = require("express");

const router = express.Router();

const {
    listarSocios,
    obtenerSocio,
    crearSocio,
    actualizarSocio,
    eliminarSocio
} = require("../controllers/socios.controller");

router.get("/", listarSocios);
router.get("/:id", obtenerSocio);
router.post("/", crearSocio);
router.put("/:id", actualizarSocio);
router.delete("/:id", eliminarSocio);

module.exports = router;