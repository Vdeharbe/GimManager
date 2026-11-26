const db = require("../config/database");

// ==========================================
// OBTENER TODOS LOS HORARIOS
// ==========================================

const obtenerHorarios = (callback) => {
  const consulta = `
    SELECT
      horarios.*,
      profesores.nombre AS profesor_nombre
    FROM horarios
    INNER JOIN profesores
      ON horarios.profesor_id = profesores.id
    ORDER BY
      FIELD(
        dia_semana,
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo'
      ),
      hora_inicio ASC
  `;

  db.query(consulta, callback);
};

// ==========================================
// OBTENER HORARIO POR ID
// ==========================================

const obtenerHorarioPorId = (id, callback) => {
  const consulta = `
    SELECT
      horarios.*,
      profesores.nombre AS profesor_nombre
    FROM horarios
    INNER JOIN profesores
      ON horarios.profesor_id = profesores.id
    WHERE horarios.id = ?
  `;

  db.query(consulta, [id], callback);
};

const verificarSuperposicion = (
  horario,
  callback,
  idExcluir = null
) => {
  const {
    profesor_id,
    dia_semana,
    hora_inicio,
    hora_fin
  } = horario;

  let consulta = `
    SELECT id, actividad, hora_inicio, hora_fin
    FROM horarios
    WHERE profesor_id = ?
      AND dia_semana = ?
      AND estado = 'Activo'
      AND hora_inicio < ?
      AND hora_fin > ?
  `;

  const parametros = [
    profesor_id,
    dia_semana,
    hora_fin,
    hora_inicio
  ];

  if (idExcluir !== null) {
    consulta += " AND id <> ?";
    parametros.push(idExcluir);
  }

  db.query(consulta, parametros, callback);
}
// ==========================================
// CREAR HORARIO
// ==========================================

const crearHorario = (horario, callback) => {
  const {
    profesor_id,
    actividad,
    dia_semana,
    hora_inicio,
    hora_fin,
    cupo_maximo,
    estado,
  } = horario;

  const consulta = `
    INSERT INTO horarios
    (
      profesor_id,
      actividad,
      dia_semana,
      hora_inicio,
      hora_fin,
      cupo_maximo,
      estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    consulta,
    [
      profesor_id,
      actividad,
      dia_semana,
      hora_inicio,
      hora_fin,
      cupo_maximo ?? 20,
      estado || "Activo",
    ],
    callback
  );
};

// ==========================================
// ACTUALIZAR HORARIO
// ==========================================

const actualizarHorario = (
  id,
  horario,
  callback
) => {
  const {
    profesor_id,
    actividad,
    dia_semana,
    hora_inicio,
    hora_fin,
    cupo_maximo,
    estado,
  } = horario;

  const consulta = `
    UPDATE horarios
    SET
      profesor_id = ?,
      actividad = ?,
      dia_semana = ?,
      hora_inicio = ?,
      hora_fin = ?,
      cupo_maximo = ?,
      estado = ?
    WHERE id = ?
  `;

  db.query(
    consulta,
    [
      profesor_id,
      actividad,
      dia_semana,
      hora_inicio,
      hora_fin,
      cupo_maximo ?? 20,
      estado || "Activo",
      id,
    ],
    callback
  );
};

// ==========================================
// OBTENER ESTADO DEL PROFESOR
// ==========================================

const obtenerEstadoProfesor = (profesorId, callback) => {
  const consulta = `
    SELECT id, estado
    FROM profesores
    WHERE id = ?
  `;

  db.query(consulta, [profesorId], callback);
};





// ==========================================
// ELIMINAR HORARIO
// ==========================================

const eliminarHorario = (id, callback) => {
  const consulta = `
    DELETE FROM horarios
    WHERE id = ?
  `;

  db.query(consulta, [id], callback);
};

module.exports = {
  obtenerHorarios,
  obtenerHorarioPorId,
  obtenerEstadoProfesor,
  verificarSuperposicion,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
};