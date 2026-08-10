const express = require("express");

const router = express.Router();

const {
    listarSocios,
    obtenerSocio,
    crearSocio,
    actualizarSocio,
    eliminarSocio
} = require("../controllers/socios.controller");

// GET todos
router.get("/", listarSocios);

// GET uno
router.get("/:id", obtenerSocio);

// POST
router.post("/", crearSocio);

// PUT
router.put("/:id", actualizarSocio);

// DELETE
router.delete("/:id", eliminarSocio);

module.exports = router;