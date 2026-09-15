const db = require("../config/database");

const buscarUsuarioPorEmail = (email, callback) => {
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
};

const crearUsuario = (usuario, callback) => {
  const { nombre, email, password, rol } = usuario;

  db.query(
    `INSERT INTO usuarios
        (nombre, email, password, rol)
        VALUES (?, ?, ?, ?)`,
    [nombre, email, password, rol],
    callback,
  );
};

const listarUsuarios = (callback) => {
  db.query("SELECT id, nombre, email, rol FROM usuarios", callback);
};

const actualizarUsuario = (id, usuario, callback) => {
  const { nombre, email, rol } = usuario;

  db.query(
    `UPDATE usuarios
         SET nombre = ?, email = ?, rol = ?
         WHERE id = ?`,
    [nombre, email, rol, id],
    callback,
  );
};

const eliminarUsuario = (id, callback) => {
  db.query("DELETE FROM usuarios WHERE id = ?", [id], callback);
};
const actualizarPassword = (id, password, callback) => {
  db.query(
    `UPDATE usuarios
         SET password = ?
         WHERE id = ?`,
    [password, id],
    callback,
  );
};

module.exports = {
  buscarUsuarioPorEmail,
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  actualizarPassword,
};
