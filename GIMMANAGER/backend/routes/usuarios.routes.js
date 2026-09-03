const express = require("express");

const router = express.Router();

const {
    login
} = require("../controllers/usuarios.controller");

router.post("/", login);

module.exports = router;