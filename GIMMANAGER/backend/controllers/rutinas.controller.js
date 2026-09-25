const Rutinas = require("../models/rutinas.model");

// ==========================================
// OBTENER TODAS LAS RUTINAS
// ==========================================

const obtenerRutinas = (req, res) => {
  Rutinas.obtenerRutinas((error, resultados) => {
    if (error) {
      console.error(
        "Error al obtener rutinas:",
        error
      );

      return res.status(500).json({
        mensaje: "Error al obtener las rutinas",
      });
    }

    res.json(resultados);
  });
};

// ==========================================
// OBTENER RUTINA POR ID
// ==========================================

const obtenerRutina = (req, res) => {
  const { id } = req.params;

  Rutinas.obtenerRutinaPorId(
    id,
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener rutina:",
          error
        );

        return res.status(500).json({
          mensaje: "Error al obtener la rutina",
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: "Rutina no encontrada",
        });
      }

      res.json(resultados[0]);
    }
  );
};

// ==========================================
// CREAR RUTINA
// ==========================================

const crearRutina = (req, res) => {
  const {
    socio_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
  } = req.body;

  // Validaciones básicas
  if (!socio_id || !nombre || !fecha_inicio) {
    return res.status(400).json({
      mensaje:
        "Socio, nombre y fecha de inicio son obligatorios",
    });
  }

  const nuevaRutina = {
    socio_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado: estado || "Activa",
  };

  Rutinas.crearRutina(
    nuevaRutina,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al crear rutina:",
          error
        );

        // Socio inexistente / problema de FK
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            mensaje:
              "El socio seleccionado no existe",
          });
        }

        return res.status(500).json({
          mensaje: "Error al crear la rutina",
        });
      }

      res.status(201).json({
        mensaje: "Rutina creada correctamente",
        id: resultado.insertId,
      });
    }
  );
};

// ==========================================
// ACTUALIZAR RUTINA
// ==========================================

const actualizarRutina = (req, res) => {
  const { id } = req.params;

  const {
    socio_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
  } = req.body;

  if (!socio_id || !nombre || !fecha_inicio) {
    return res.status(400).json({
      mensaje:
        "Socio, nombre y fecha de inicio son obligatorios",
    });
  }

  const rutinaActualizada = {
    socio_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado: estado || "Activa",
  };

  Rutinas.actualizarRutina(
    id,
    rutinaActualizada,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al actualizar rutina:",
          error
        );

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            mensaje:
              "El socio seleccionado no existe",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al actualizar la rutina",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Rutina no encontrada",
        });
      }

      res.json({
        mensaje:
          "Rutina actualizada correctamente",
      });
    }
  );
};

// ==========================================
// ELIMINAR RUTINA
// ==========================================

const eliminarRutina = (req, res) => {
  const { id } = req.params;

  Rutinas.eliminarRutina(
    id,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al eliminar rutina:",
          error
        );

        return res.status(500).json({
          mensaje: "Error al eliminar la rutina",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Rutina no encontrada",
        });
      }

      res.json({
        mensaje:
          "Rutina eliminada correctamente",
      });
    }
  );
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerRutinas,
  obtenerRutina,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
};