const db = require("../config/database");

// ==========================================
// OBTENER TODOS LOS PAGOS
// ==========================================

const obtenerPagos = (callback) => {
  db.query(
    `SELECT
        pagos.id,
        pagos.socio_id,
        socios.nombre AS socio_nombre,
        pagos.monto,
        pagos.fecha,
        pagos.metodo_pago,
        pagos.concepto,
        pagos.estado
     FROM pagos
     INNER JOIN socios
       ON pagos.socio_id = socios.id
     ORDER BY pagos.fecha DESC`,
    callback
  );
};
// ==========================================
// OBTENER PAGO POR ID
// ==========================================

const obtenerPagoPorId = (id, callback) => {
  db.query(
    `SELECT
        pagos.id,
        pagos.socio_id,
        socios.nombre AS socio_nombre,
        pagos.monto,
        pagos.fecha,
        pagos.metodo_pago,
        pagos.concepto,
        pagos.estado
     FROM pagos
     INNER JOIN socios
       ON pagos.socio_id = socios.id
     WHERE pagos.id = ?`,
    [id],
    callback
  );
};
// ==========================================
// CREAR PAGO
// ==========================================

const crearPago = (
  socio_id,
  monto,
  fecha,
  metodo_pago,
  concepto,
  estado,
  callback
) => {
  db.query(
    `INSERT INTO pagos
     (
       socio_id,
       monto,
       fecha,
       metodo_pago,
       concepto,
       estado
     )
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      socio_id,
      monto,
      fecha,
      metodo_pago,
      concepto,
      estado,
    ],
    callback
  );
};
// ==========================================
// ACTUALIZAR PAGO
// ==========================================

const actualizarPago = (
  id,
  socio_id,
  monto,
  fecha,
  metodo_pago,
  concepto,
  estado,
  callback
) => {
  db.query(
    `UPDATE pagos
     SET
       socio_id = ?,
       monto = ?,
       fecha = ?,
       metodo_pago = ?,
       concepto = ?,
       estado = ?
     WHERE id = ?`,
    [
      socio_id,
      monto,
      fecha,
      metodo_pago,
      concepto,
      estado,
      id,
    ],
    callback
  );
};
// ==========================================
// ELIMINAR PAGO
// ==========================================

const eliminarPago = (id, callback) => {
  db.query(
    "DELETE FROM pagos WHERE id = ?",
    [id],
    callback
  );
};

module.exports = {
  obtenerPagos,
  obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago,
};
