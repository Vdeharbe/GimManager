const db = require("../config/database");

// ==========================================
// OBTENER EJERCICIOS DE UNA RUTINA
// ==========================================

const obtenerEjerciciosPorRutina = (
  rutinaId,
  callback
) => {
  const consulta = `
    SELECT *
    FROM rutina_ejercicios
    WHERE rutina_id = ?
    ORDER BY orden ASC, id ASC
  `;

  db.query(
    consulta,
    [rutinaId],
    callback
  );
};


// ==========================================
// OBTENER EJERCICIO POR ID
// ==========================================

const obtenerEjercicioPorId = (
  id,
  callback
) => {
  const consulta = `
    SELECT *
    FROM rutina_ejercicios
    WHERE id = ?
  `;

  db.query(
    consulta,
    [id],
    callback
  );
};


// ==========================================
// CREAR EJERCICIO
// ==========================================

const crearEjercicio = (
  ejercicio,
  callback
) => {
  const {
    rutina_id,
    ejercicio: nombreEjercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  } = ejercicio;

  const consulta = `
    INSERT INTO rutina_ejercicios
    (
      rutina_id,
      ejercicio,
      series,
      repeticiones,
      peso,
      descanso_segundos,
      observaciones,
      orden
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    consulta,
    [
      rutina_id,
      nombreEjercicio,
      series,
      repeticiones,
      peso || null,
      descanso_segundos || null,
      observaciones || null,
      orden || 1,
    ],
    callback
  );
};


// ==========================================
// ACTUALIZAR EJERCICIO
// ==========================================

const actualizarEjercicio = (
  id,
  ejercicio,
  callback
) => {
  const {
    rutina_id,
    ejercicio: nombreEjercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  } = ejercicio;

  const consulta = `
    UPDATE rutina_ejercicios
    SET
      rutina_id = ?,
      ejercicio = ?,
      series = ?,
      repeticiones = ?,
      peso = ?,
      descanso_segundos = ?,
      observaciones = ?,
      orden = ?
    WHERE id = ?
  `;

  db.query(
    consulta,
    [
      rutina_id,
      nombreEjercicio,
      series,
      repeticiones,
      peso || null,
      descanso_segundos || null,
      observaciones || null,
      orden || 1,
      id,
    ],
    callback
  );
};


// ==========================================
// ELIMINAR EJERCICIO
// ==========================================

const eliminarEjercicio = (
  id,
  callback
) => {
  const consulta = `
    DELETE FROM rutina_ejercicios
    WHERE id = ?
  `;

  db.query(
    consulta,
    [id],
    callback
  );
};


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerEjerciciosPorRutina,
  obtenerEjercicioPorId,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
};