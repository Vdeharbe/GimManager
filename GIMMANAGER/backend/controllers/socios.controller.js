const Socios = require("../models/socios.model");

// Obtener todos
const listarSocios = (req, res) => {

    Socios.obtenerSocios((err, datos) => {

        if (err)
            return res.status(500).json(err);

        res.json(datos);

    });

};

// Obtener uno
const obtenerSocio = (req, res) => {

    Socios.obtenerSocioPorId(

        req.params.id,

        (err, datos) => {

            if (err)
                return res.status(500).json(err);

            res.json(datos[0]);

        }

    );

};

// Crear
const crearSocio = (req, res) => {

    Socios.crearSocio(

        req.body,

        (err, resultado) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                mensaje: "Socio creado",

                id: resultado.insertId

            });

        }

    );

};

// Actualizar
const actualizarSocio = (req, res) => {

    Socios.actualizarSocio(

        req.params.id,

        req.body,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                mensaje: "Socio actualizado"

            });

        }

    );

};

// Eliminar
const eliminarSocio = (req, res) => {

    Socios.eliminarSocio(

        req.params.id,

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                mensaje: "Socio eliminado"

            });

        }

    );

};

module.exports = {

    listarSocios,

    obtenerSocio,

    crearSocio,

    actualizarSocio,

    eliminarSocio

};