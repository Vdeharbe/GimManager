const express = require("express");

const {
  obtenerPagos,
  obtenerPago,
  crearPago,
  actualizarPago,
  eliminarPago,
} = require("../controllers/pagos.controller");

const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// OBTENER TODOS LOS PAGOS
// USUARIO AUTENTICADO
// ==========================================

router.get(
  "/",
  verificarToken,
  obtenerPagos
);
// ==========================================
// OBTENER PAGO POR ID
// ==========================================

router.get(
  "/:id",
  verificarToken,
  obtenerPago
);
// ==========================================
// CREAR PAGO
// SOLO ADMIN
// ==========================================

router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearPago
);
// ==========================================
// ACTUALIZAR PAGO
// SOLO ADMIN
// ==========================================

router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarPago
);
// ==========================================
// ELIMINAR PAGO
// SOLO ADMIN
// ==========================================

router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarPago
);
module.exports = router;