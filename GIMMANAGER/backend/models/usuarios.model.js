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
    db.query(
        "SELECT id, nombre, email, rol FROM usuarios",
        callback
    );
};
module.exports = {
  buscarUsuarioPorEmail,
  crearUsuario,
  listarUsuarios
};
