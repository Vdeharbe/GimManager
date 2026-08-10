const db = require("../config/database");

// Obtener todos
const obtenerSocios = (callback) => {
    db.query(
        "SELECT * FROM socios",
        callback
    );
};

// Obtener por ID
const obtenerSocioPorId = (id, callback) => {
    db.query(
        "SELECT * FROM socios WHERE id = ?",
        [id],
        callback
    );
};

// Crear
const crearSocio = (socio, callback) => {

    db.query(

        "INSERT INTO socios(nombre,email,plan,estado) VALUES(?,?,?,?)",

        [
            socio.nombre,
            socio.email,
            socio.plan,
            socio.estado
        ],

        callback

    );

};

// Actualizar
const actualizarSocio = (id, socio, callback) => {

    db.query(

        `UPDATE socios
         SET nombre=?,
             email=?,
             plan=?,
             estado=?
         WHERE id=?`,

        [
            socio.nombre,
            socio.email,
            socio.plan,
            socio.estado,
            id
        ],

        callback

    );

};

// Eliminar
const eliminarSocio = (id, callback) => {

    db.query(

        "DELETE FROM socios WHERE id=?",

        [id],

        callback

    );

};

module.exports = {

    obtenerSocios,

    obtenerSocioPorId,

    crearSocio,

    actualizarSocio,

    eliminarSocio

};