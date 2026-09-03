const Socios = require("../models/socios.model");

// Listar todos los socios
const listarSocios = (req, res) => {
    Socios.obtenerSocios((err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al obtener socios",
                error: err
            });
        }
        res.json({
            mensaje: "Socios obtenidos correctamente",
            socios: result
        });
    });
};

// Obtener un socio por ID
const obtenerSocio = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            mensaje: "El ID del socio es obligatorio"
        });
    }

    Socios.obtenerSocioPorId(id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al obtener el socio",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                mensaje: "Socio no encontrado"
            });
        }

        res.json({
            mensaje: "Socio obtenido correctamente",
            socio: result[0]
        });
    });
};

// Crear un nuevo socio
const crearSocio = (req, res) => {
    const { nombre, email, plan, estado } = req.body;

    if (!nombre || !email || !plan || !estado) {
        return res.status(400).json({
            mensaje: "Nombre, email, plan y estado son obligatorios"
        });
    }

    const nuevoSocio = { nombre, email, plan, estado };

    Socios.crearSocio(nuevoSocio, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al crear el socio",
                error: err
            });
        }

        res.status(201).json({
            mensaje: "Socio creado correctamente",
            id: result.insertId
        });
    });
};

// Actualizar un socio
const actualizarSocio = (req, res) => {
    const { id } = req.params;
    const { nombre, email, plan, estado } = req.body;

    if (!id) {
        return res.status(400).json({
            mensaje: "El ID del socio es obligatorio"
        });
    }

    if (!nombre || !email || !plan || !estado) {
        return res.status(400).json({
            mensaje: "Nombre, email, plan y estado son obligatorios"
        });
    }

    const socioActualizado = { nombre, email, plan, estado };

    Socios.actualizarSocio(id, socioActualizado, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al actualizar el socio",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Socio no encontrado"
            });
        }

        res.json({
            mensaje: "Socio actualizado correctamente"
        });
    });
};

// Eliminar un socio
const eliminarSocio = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            mensaje: "El ID del socio es obligatorio"
        });
    }

    Socios.eliminarSocio(id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al eliminar el socio",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Socio no encontrado"
            });
        }

        res.json({
            mensaje: "Socio eliminado correctamente"
        });
    });
};

module.exports = {
    listarSocios,
    obtenerSocio,
    crearSocio,
    actualizarSocio,
    eliminarSocio
};