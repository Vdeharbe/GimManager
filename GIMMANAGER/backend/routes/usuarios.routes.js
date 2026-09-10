const express = require("express");

const {
    registrarUsuario,
    obtenerUsuarios
} = require("../controllers/usuarios.controller");

const {
    verificarToken,
    verificarRol
} = require("../middleware/auth.middleware");

const router = express.Router();
router.get(
    "/",
    verificarToken,
    verificarRol("admin"),
    obtenerUsuarios
);

router.post(
    "/registrar",
    verificarToken,
    verificarRol("admin"),
    registrarUsuario
);

module.exports = router;