const db = require("../config/database");

// ==========================================
// OBTENER RESUMEN GENERAL
// Admin + Instructor
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
       FROM profesores) AS profesores
  `;

  db.query(
    consulta,
    callback
  );
};

// ==========================================
// OBTENER RESUMEN FINANCIERO
// Solo Admin
// ==========================================

const obtenerResumenFinanciero = (callback) => {
  const consulta = `
    SELECT
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
// OBTENER INGRESOS POR MES
// Solo Admin
// ==========================================

const obtenerIngresosPorMes = (callback) => {
  const consulta = `
    SELECT
      DATE_FORMAT(fecha, '%Y-%m') AS mes,
      COUNT(*) AS cantidadPagos,
      COALESCE(SUM(monto), 0) AS total
    FROM pagos
    WHERE estado = 'Pagado'
    GROUP BY DATE_FORMAT(fecha, '%Y-%m')
    ORDER BY mes ASC
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
  obtenerResumenFinanciero,
  obtenerIngresosPorMes,
};