const db = require("../config/database");

// ==========================================
// OBTENER TODOS LOS PROFESORES
// ==========================================

const obtenerProfesores = (callback) => {
  db.query("SELECT * FROM profesores", callback);
};
// ==========================================
// OBTENER PROFESOR POR ID
// ==========================================

const obtenerProfesorPorId = (id, callback) => {
  db.query("SELECT * FROM profesores WHERE id = ?", [id], callback);
};
// ==========================================
// CREAR PROFESOR
// ==========================================

const crearProfesor = (
  nombre,
  email,
  telefono,
  especialidad,
  estado,
  callback
) => {
  db.query(
    `INSERT INTO profesores
     (nombre, email, telefono, especialidad, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [
      nombre,
      email,
      telefono,
      especialidad,
      estado,
    ],
    callback
  );
};
// ==========================================
// ACTUALIZAR PROFESOR
// ==========================================

const actualizarProfesor = (
  id,
  nombre,
  email,
  telefono,
  especialidad,
  estado,
  callback
) => {
  db.query(
    `UPDATE profesores
     SET nombre = ?,
         email = ?,
         telefono = ?,
         especialidad = ?,
         estado = ?
     WHERE id = ?`,
    [
      nombre,
      email,
      telefono,
      especialidad,
      estado,
      id,
    ],
    callback
  );
};
// ==========================================
// ELIMINAR PROFESOR
// ==========================================

const eliminarProfesor = (id, callback) => {
  db.query(
    "DELETE FROM profesores WHERE id = ?",
    [id],
    callback
  );
};

module.exports = {
  obtenerProfesores,
  obtenerProfesorPorId,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
};
