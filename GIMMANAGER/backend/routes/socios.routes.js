const express = require("express");

const router = express.Router();

const {
    listarSocios
} = require("../controllers/socios.controller");

router.get("/", listarSocios);

module.exports = router;