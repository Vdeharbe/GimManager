const Socios = require("../models/socios.model");

const listarSocios = (req, res) => {

    Socios.obtenerSocios((error, resultados) => {

        if (error) {

            return res.status(500).json(error);

        }

        res.json(resultados);

    });

};

module.exports = {
    listarSocios
};