const Pagos = require("../models/pagos.model");

// ==========================================
// OBTENER TODOS LOS PAGOS
// ==========================================

const obtenerPagos = (req, res) => {
  Pagos.obtenerPagos((err, pagos) => {
    if (err) {
      console.error("Error al obtener pagos:", err);

      return res.status(500).json({
        mensaje: "Error al obtener pagos",
      });
    }

    return res.json(pagos);
  });
};
// ==========================================
// OBTENER PAGO POR ID
// ==========================================

const obtenerPago = (req, res) => {
  const { id } = req.params;

  Pagos.obtenerPagoPorId(id, (err, pagos) => {
    if (err) {
      console.error("Error al obtener pago:", err);

      return res.status(500).json({
        mensaje: "Error al obtener pago",
      });
    }

    if (pagos.length === 0) {
      return res.status(404).json({
        mensaje: "Pago no encontrado",
      });
    }

    return res.json(pagos[0]);
  });
};
// ==========================================
// CREAR PAGO
// ==========================================

const crearPago = (req, res) => {
  const { socio_id, monto, fecha, metodo_pago, concepto, estado } = req.body;

  // Validar campos obligatorios
  if (!socio_id || !monto || !fecha || !metodo_pago || !concepto) {
    return res.status(400).json({
      mensaje: "Todos los campos obligatorios deben estar completos",
    });
  }

  const estadoPago = estado || "Pagado";

  Pagos.crearPago(
    socio_id,
    monto,
    fecha,
    metodo_pago,
    concepto,
    estadoPago,
    (err, resultado) => {
      if (err) {
        console.error("Error al crear pago:", err);

        // El socio indicado no existe
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            mensaje: "El socio indicado no existe",
          });
        }

        return res.status(500).json({
          mensaje: "Error al crear pago",
        });
      }
      return res.status(201).json({
        mensaje: "Pago creado correctamente",
        id: resultado.insertId,
      });
    },
  );
};
// ==========================================
// ACTUALIZAR PAGO
// ==========================================

const actualizarPago = (req, res) => {
  const { id } = req.params;

  const { socio_id, monto, fecha, metodo_pago, concepto, estado } = req.body;

  // Validar campos obligatorios
  if (!socio_id || !monto || !fecha || !metodo_pago || !concepto) {
    return res.status(400).json({
      mensaje: "Todos los campos obligatorios deben estar completos",
    });
  }

  const estadoPago = estado || "Pagado";

  Pagos.actualizarPago(
    id,
    socio_id,
    monto,
    fecha,
    metodo_pago,
    concepto,
    estadoPago,
    (err, resultado) => {
      if (err) {
        console.error("Error al actualizar pago:", err);

        // El socio indicado no existe
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            mensaje: "El socio indicado no existe",
          });
        }

        return res.status(500).json({
          mensaje: "Error al actualizar pago",
        });
      }

      // No existe un pago con ese ID
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Pago no encontrado",
        });
      }

      return res.json({
        mensaje: "Pago actualizado correctamente",
      });
    },
  );
};
// ==========================================
// ELIMINAR PAGO
// ==========================================

const eliminarPago = (req, res) => {
  const { id } = req.params;

  Pagos.eliminarPago(id, (err, resultado) => {
    if (err) {
      console.error("Error al eliminar pago:", err);

      return res.status(500).json({
        mensaje: "Error al eliminar pago",
      });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Pago no encontrado",
      });
    }

    return res.json({
      mensaje: "Pago eliminado correctamente",
    });
  });
};

module.exports = {
  obtenerPagos,
  obtenerPago,
  crearPago,
  actualizarPago,
  eliminarPago,
};
