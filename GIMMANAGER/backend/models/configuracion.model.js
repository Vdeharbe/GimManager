const db = require("../config/database");

// ==========================================
// OBTENER CONFIGURACIÓN
// ==========================================

const obtenerConfiguracion = (callback) => {
  db.query(
    `SELECT
        id,
        nombre_gimnasio,
        direccion,
        telefono,
        email,
        horario_apertura,
        horario_cierre
     FROM configuracion
     LIMIT 1`,
    callback
  );
};

// ==========================================
// ACTUALIZAR CONFIGURACIÓN
// ==========================================

const actualizarConfiguracion = (
  id,
  nombre_gimnasio,
  direccion,
  telefono,
  email,
  horario_apertura,
  horario_cierre,
  callback
) => {
  db.query(
    `UPDATE configuracion
     SET
       nombre_gimnasio = ?,
       direccion = ?,
       telefono = ?,
       email = ?,
       horario_apertura = ?,
       horario_cierre = ?
     WHERE id = ?`,
    [
      nombre_gimnasio,
      direccion,
      telefono,
      email,
      horario_apertura,
      horario_cierre,
      id,
    ],
    callback
  );
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
};