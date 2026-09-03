const db = require("../config/database");

const buscarUsuarioPorEmail = (email, callback) => {

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        callback
    );

};

module.exports = {
    buscarUsuarioPorEmail
};