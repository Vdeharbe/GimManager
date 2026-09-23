const db = require("../config/database");


// ==========================================
// OBTENER RESUMEN GENERAL
// ==========================================

const obtenerResumen = (callback) => {

  const consulta = `
    SELECT
      (SELECT COUNT(*)
       FROM socios) AS socios,

      (SELECT COUNT(*)
       FROM socios
       WHERE estado = 'Activo') AS sociosActivos,

      (SELECT COUNT(*)
       FROM profesores) AS profesores,

      (SELECT COUNT(*)
       FROM pagos) AS totalPagos,

      (SELECT COALESCE(SUM(monto), 0)
       FROM pagos
       WHERE estado = 'Pagado') AS totalCobrado
  `;

  db.query(
    consulta,
    callback
  );
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerResumen,
};