const db = require("../config/database");

// ==========================================
// OBTENER TODAS LAS RUTINAS
// ==========================================

const obtenerRutinas = (callback) => {
  const consulta = `
    SELECT
      rutinas.*,
      socios.nombre AS socio_nombre
    FROM rutinas
    INNER JOIN socios
      ON rutinas.socio_id = socios.id
    ORDER BY rutinas.id DESC
  `;

  db.query(consulta, callback);
};

// ==========================================
// OBTENER RUTINA POR ID
// ==========================================

const obtenerRutinaPorId = (id, callback) => {
  const consulta = `
    SELECT
      rutinas.*,
      socios.nombre AS socio_nombre
    FROM rutinas
    INNER JOIN socios
      ON rutinas.socio_id = socios.id
    WHERE rutinas.id = ?
  `;

  db.query(consulta, [id], callback);
};

// ==========================================
// CREAR RUTINA
// ==========================================

const crearRutina = (rutina, callback) => {
  const { socio_id, nombre, descripcion, fecha_inicio, fecha_fin, estado } =
    rutina;

  const consulta = `
    INSERT INTO rutinas
    (
      socio_id,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      estado
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    consulta,
    [
      socio_id,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin || null,
      estado || "Activa",
    ],
    callback,
  );
};

// ==========================================
// ACTUALIZAR RUTINA
// ==========================================

const actualizarRutina = (id, rutina, callback) => {
  const { socio_id, nombre, descripcion, fecha_inicio, fecha_fin, estado } =
    rutina;

  const consulta = `
    UPDATE rutinas
    SET
      socio_id = ?,
      nombre = ?,
      descripcion = ?,
      fecha_inicio = ?,
      fecha_fin = ?,
      estado = ?
    WHERE id = ?
  `;

  db.query(
    consulta,
    [
      socio_id,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin || null,
      estado,
      id,
    ],
    callback,
  );
};

// ==========================================
// ELIMINAR RUTINA
// ==========================================

const eliminarRutina = (id, callback) => {
  const consulta = `
    DELETE FROM rutinas
    WHERE id = ?
  `;

  db.query(consulta, [id], callback);
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerRutinas,
  obtenerRutinaPorId,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
};
