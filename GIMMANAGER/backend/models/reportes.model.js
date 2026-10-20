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
       FROM socios
       WHERE estado = 'Inactivo') AS sociosInactivos,

     (SELECT COUNT(*)
 FROM profesores) AS profesores,

(SELECT COUNT(*)
 FROM inscripciones) AS inscripciones,

(SELECT COUNT(*)
 FROM horarios
 WHERE estado = 'Activo') AS horariosActivos
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

  db.query(consulta, callback);
};
// ==========================================
// OBTENER RESUMEN DE OCUPACIÓN
// Admin + Instructor
// ==========================================

const obtenerResumenOcupacion = (callback) => {
  const consulta = `
    SELECT
      COALESCE(SUM(cupo_maximo), 0) AS cuposTotales,
      COALESCE(SUM(inscriptosActivos), 0) AS inscripcionesActivas,
      COALESCE(
        SUM(cupo_maximo - inscriptosActivos),
        0
      ) AS cuposDisponibles
    FROM (
      SELECT
        h.id,
        h.cupo_maximo,
        COUNT(i.id) AS inscriptosActivos
      FROM horarios h
      LEFT JOIN inscripciones i
        ON h.id = i.horario_id
        AND i.estado = 'Activa'
      WHERE h.estado = 'Activo'
      GROUP BY
        h.id,
        h.cupo_maximo
    ) AS ocupacion
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

  db.query(consulta, callback);
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerResumen,
  obtenerResumenOcupacion,
  obtenerResumenFinanciero,
  obtenerIngresosPorMes,
};