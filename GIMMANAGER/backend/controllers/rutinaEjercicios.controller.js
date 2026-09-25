const RutinaEjercicios = require(
  "../models/rutinaEjercicios.model"
);

// ==========================================
// OBTENER EJERCICIOS DE UNA RUTINA
// ==========================================

const obtenerEjerciciosPorRutina = (req, res) => {
  const { rutinaId } = req.params;

  RutinaEjercicios.obtenerEjerciciosPorRutina(
    rutinaId,
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener ejercicios:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener los ejercicios de la rutina",
        });
      }

      res.json(resultados);
    }
  );
};


// ==========================================
// OBTENER EJERCICIO POR ID
// ==========================================

const obtenerEjercicio = (req, res) => {
  const { id } = req.params;

  RutinaEjercicios.obtenerEjercicioPorId(
    id,
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener ejercicio:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener el ejercicio",
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: "Ejercicio no encontrado",
        });
      }

      res.json(resultados[0]);
    }
  );
};


// ==========================================
// CREAR EJERCICIO
// ==========================================

const crearEjercicio = (req, res) => {
  const {
    rutina_id,
    ejercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  } = req.body;

  // Validaciones básicas
  if (
    !rutina_id ||
    !ejercicio ||
    !series ||
    !repeticiones
  ) {
    return res.status(400).json({
      mensaje:
        "Rutina, ejercicio, series y repeticiones son obligatorios",
    });
  }

  const nuevoEjercicio = {
    rutina_id,
    ejercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  };

  RutinaEjercicios.crearEjercicio(
    nuevoEjercicio,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al crear ejercicio:",
          error
        );

        // La rutina indicada no existe
        if (
          error.code ===
          "ER_NO_REFERENCED_ROW_2"
        ) {
          return res.status(400).json({
            mensaje:
              "La rutina seleccionada no existe",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al crear el ejercicio",
        });
      }

      res.status(201).json({
        mensaje:
          "Ejercicio agregado correctamente",
        id: resultado.insertId,
      });
    }
  );
};


// ==========================================
// ACTUALIZAR EJERCICIO
// ==========================================

const actualizarEjercicio = (req, res) => {
  const { id } = req.params;

  const {
    rutina_id,
    ejercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  } = req.body;

  if (
    !rutina_id ||
    !ejercicio ||
    !series ||
    !repeticiones
  ) {
    return res.status(400).json({
      mensaje:
        "Rutina, ejercicio, series y repeticiones son obligatorios",
    });
  }

  const ejercicioActualizado = {
    rutina_id,
    ejercicio,
    series,
    repeticiones,
    peso,
    descanso_segundos,
    observaciones,
    orden,
  };

  RutinaEjercicios.actualizarEjercicio(
    id,
    ejercicioActualizado,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al actualizar ejercicio:",
          error
        );

        if (
          error.code ===
          "ER_NO_REFERENCED_ROW_2"
        ) {
          return res.status(400).json({
            mensaje:
              "La rutina seleccionada no existe",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al actualizar el ejercicio",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Ejercicio no encontrado",
        });
      }

      res.json({
        mensaje:
          "Ejercicio actualizado correctamente",
      });
    }
  );
};


// ==========================================
// ELIMINAR EJERCICIO
// ==========================================

const eliminarEjercicio = (req, res) => {
  const { id } = req.params;

  RutinaEjercicios.eliminarEjercicio(
    id,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al eliminar ejercicio:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al eliminar el ejercicio",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Ejercicio no encontrado",
        });
      }

      res.json({
        mensaje:
          "Ejercicio eliminado correctamente",
      });
    }
  );
};


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerEjerciciosPorRutina,
  obtenerEjercicio,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
};