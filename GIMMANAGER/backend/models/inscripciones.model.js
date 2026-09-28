const db = require("../config/database");

// ==========================================
// OBTENER TODAS LAS INSCRIPCIONES
// ==========================================

const obtenerInscripciones = (callback) => {
  const consulta = `
    SELECT
      inscripciones.*,
      socios.nombre AS socio_nombre,
      horarios.actividad,
      horarios.dia_semana,
      horarios.hora_inicio,
      horarios.hora_fin,
      profesores.nombre AS profesor_nombre
    FROM inscripciones
    INNER JOIN socios
      ON inscripciones.socio_id = socios.id
    INNER JOIN horarios
      ON inscripciones.horario_id = horarios.id
    INNER JOIN profesores
      ON horarios.profesor_id = profesores.id
    ORDER BY inscripciones.id DESC
  `;

  db.query(consulta, callback);
};

// ==========================================
// OBTENER INSCRIPCIÓN POR ID
// ==========================================

const obtenerInscripcionPorId = (id, callback) => {
  const consulta = `
    SELECT
      inscripciones.*,
      socios.nombre AS socio_nombre,
      horarios.actividad,
      horarios.dia_semana,
      horarios.hora_inicio,
      horarios.hora_fin,
      profesores.nombre AS profesor_nombre
    FROM inscripciones
    INNER JOIN socios
      ON inscripciones.socio_id = socios.id
    INNER JOIN horarios
      ON inscripciones.horario_id = horarios.id
    INNER JOIN profesores
      ON horarios.profesor_id = profesores.id
    WHERE inscripciones.id = ?
  `;

  db.query(consulta, [id], callback);
};

// ==========================================
// CONTAR INSCRIPCIONES ACTIVAS DE UN HORARIO
// ==========================================

const contarInscripcionesActivas = (
  horarioId,
  callback
) => {
  const consulta = `
    SELECT COUNT(*) AS cantidad
    FROM inscripciones
    WHERE horario_id = ?
      AND estado = 'Activa'
  `;

  db.query(
    consulta,
    [horarioId],
    callback
  );
};

// ==========================================
// OBTENER CUPO DEL HORARIO
// ==========================================

const obtenerCupoHorario = (
  horarioId,
  callback
) => {
  const consulta = `
    SELECT cupo_maximo
    FROM horarios
    WHERE id = ?
  `;

  db.query(
    consulta,
    [horarioId],
    callback
  );
};

// ==========================================
// CREAR INSCRIPCIÓN
// ==========================================

const crearInscripcion = (
  inscripcion,
  callback
) => {
  const {
    socio_id,
    horario_id,
    fecha_inscripcion,
    estado,
  } = inscripcion;

  const consulta = `
    INSERT INTO inscripciones
    (
      socio_id,
      horario_id,
      fecha_inscripcion,
      estado
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    consulta,
    [
      socio_id,
      horario_id,
      fecha_inscripcion,
      estado || "Activa",
    ],
    callback
  );
};

// ==========================================
// ACTUALIZAR INSCRIPCIÓN
// ==========================================

const actualizarInscripcion = (
  id,
  inscripcion,
  callback
) => {
  const {
    socio_id,
    horario_id,
    fecha_inscripcion,
    estado,
  } = inscripcion;

  const consulta = `
    UPDATE inscripciones
    SET
      socio_id = ?,
      horario_id = ?,
      fecha_inscripcion = ?,
      estado = ?
    WHERE id = ?
  `;

  db.query(
    consulta,
    [
      socio_id,
      horario_id,
      fecha_inscripcion,
      estado || "Activa",
      id,
    ],
    callback
  );
};

// ==========================================
// ELIMINAR INSCRIPCIÓN
// ==========================================

const eliminarInscripcion = (
  id,
  callback
) => {
  const consulta = `
    DELETE FROM inscripciones
    WHERE id = ?
  `;

  db.query(
    consulta,
    [id],
    callback
  );
};

module.exports = {
  obtenerInscripciones,
  obtenerInscripcionPorId,
  contarInscripcionesActivas,
  obtenerCupoHorario,
  crearInscripcion,
  actualizarInscripcion,
  eliminarInscripcion,
};