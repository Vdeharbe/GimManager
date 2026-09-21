const Profesores = require("../models/profesores.model");

// ==========================================
// OBTENER TODOS LOS PROFESORES
// ==========================================

const obtenerProfesores = (req, res) => {
  Profesores.obtenerProfesores((err, profesores) => {
    if (err) {
      console.error("Error al obtener profesores:", err);

      return res.status(500).json({
        mensaje: "Error al obtener profesores",
      });
    }

    return res.json(profesores);
  });
};
// ==========================================
// OBTENER PROFESOR POR ID
// ==========================================

const obtenerProfesor = (req, res) => {
  const { id } = req.params;

  Profesores.obtenerProfesorPorId(id, (err, profesores) => {
    if (err) {
      console.error("Error al obtener profesor:", err);

      return res.status(500).json({
        mensaje: "Error al obtener profesor",
      });
    }

    if (profesores.length === 0) {
      return res.status(404).json({
        mensaje: "Profesor no encontrado",
      });
    }

    return res.json(profesores[0]);
  });
};
// ==========================================
// CREAR PROFESOR
// ==========================================

const crearProfesor = (req, res) => {
  const { nombre, email, telefono, especialidad, estado } = req.body;

  // Validar campos obligatorios
  if (!nombre || !email || !especialidad) {
    return res.status(400).json({
      mensaje: "Nombre, email y especialidad son obligatorios",
    });
  }

  // Si no se envía estado, usamos Activo
  const estadoProfesor = estado || "Activo";

  Profesores.crearProfesor(
    nombre,
    email,
    telefono,
    especialidad,
    estadoProfesor,
    (err, resultado) => {
      if (err) {
        console.error("Error al crear profesor:", err);

        return res.status(500).json({
          mensaje: "Error al crear profesor",
        });
      }

      return res.status(201).json({
        mensaje: "Profesor creado correctamente",
        id: resultado.insertId,
      });
    },
  );
};
// ==========================================
// ACTUALIZAR PROFESOR
// ==========================================

const actualizarProfesor = (req, res) => {
  const { id } = req.params;

  const { nombre, email, telefono, especialidad, estado } = req.body;

  // Validar campos obligatorios
  if (!nombre || !email || !especialidad) {
    return res.status(400).json({
      mensaje: "Nombre, email y especialidad son obligatorios",
    });
  }

  const estadoProfesor = estado || "Activo";

  Profesores.actualizarProfesor(
    id,
    nombre,
    email,
    telefono,
    especialidad,
    estadoProfesor,
    (err, resultado) => {
      if (err) {
        console.error("Error al actualizar profesor:", err);

        return res.status(500).json({
          mensaje: "Error al actualizar profesor",
        });
      }

      // Si el ID no existe en MySQL
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Profesor no encontrado",
        });
      }

      return res.json({
        mensaje: "Profesor actualizado correctamente",
      });
    },
  );
};
// ==========================================
// ELIMINAR PROFESOR
// ==========================================

const eliminarProfesor = (req, res) => {
  const { id } = req.params;

  Profesores.eliminarProfesor(
    id,
    (err, resultado) => {
      if (err) {
        console.error(
          "Error al eliminar profesor:",
          err
        );

        return res.status(500).json({
          mensaje: "Error al eliminar profesor",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Profesor no encontrado",
        });
      }

      return res.json({
        mensaje: "Profesor eliminado correctamente",
      });
    }
  );
};
module.exports = {
  obtenerProfesores,
  obtenerProfesor,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
};
