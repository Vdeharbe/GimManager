const HorariosModel = require(
  "../models/horarios.model"
);

// ==========================================
// OBTENER TODOS LOS HORARIOS
// ==========================================

const obtenerHorarios = (req, res) => {
  HorariosModel.obtenerHorarios(
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener horarios:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener los horarios",
        });
      }

      res.json(resultados);
    }
  );
};

// ==========================================
// OBTENER HORARIO POR ID
// ==========================================

const obtenerHorario = (req, res) => {
  const { id } = req.params;

  HorariosModel.obtenerHorarioPorId(
    id,
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener horario:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener el horario",
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: "Horario no encontrado",
        });
      }

      res.json(resultados[0]);
    }
  );
};

// ==========================================
// VALIDAR HORARIO
// ==========================================

const validarHorario = (datos) => {
  const {
    profesor_id,
    actividad,
    dia_semana,
    hora_inicio,
    hora_fin,
  } = datos;

  if (
    !profesor_id ||
    !actividad ||
    !dia_semana ||
    !hora_inicio ||
    !hora_fin
  ) {
    return {
      valido: false,
      mensaje:
        "Profesor, actividad, día, hora de inicio y hora de fin son obligatorios",
    };
  }

  if (hora_fin <= hora_inicio) {
    return {
      valido: false,
      mensaje:
        "La hora de fin debe ser posterior a la hora de inicio",
    };
  }

  return {
    valido: true,
  };
};

// ==========================================
// CREAR HORARIO
// ==========================================

const crearHorario = (req, res) => {
  const validacion = validarHorario(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  HorariosModel.crearHorario(
    req.body,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al crear horario:",
          error
        );

        // Profesor inexistente
        if (
          error.code ===
          "ER_NO_REFERENCED_ROW_2"
        ) {
          return res.status(400).json({
            mensaje:
              "El profesor seleccionado no existe",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al crear el horario",
        });
      }

      res.status(201).json({
        mensaje:
          "Horario creado correctamente",
        id: resultado.insertId,
      });
    }
  );
};

// ==========================================
// ACTUALIZAR HORARIO
// ==========================================

const actualizarHorario = (req, res) => {
  const { id } = req.params;

  const validacion = validarHorario(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  HorariosModel.actualizarHorario(
    id,
    req.body,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al actualizar horario:",
          error
        );

        if (
          error.code ===
          "ER_NO_REFERENCED_ROW_2"
        ) {
          return res.status(400).json({
            mensaje:
              "El profesor seleccionado no existe",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al actualizar el horario",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Horario no encontrado",
        });
      }

      res.json({
        mensaje:
          "Horario actualizado correctamente",
      });
    }
  );
};

// ==========================================
// ELIMINAR HORARIO
// ==========================================

const eliminarHorario = (req, res) => {
  const { id } = req.params;

  HorariosModel.eliminarHorario(
    id,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al eliminar horario:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al eliminar el horario",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Horario no encontrado",
        });
      }

      res.json({
        mensaje:
          "Horario eliminado correctamente",
      });
    }
  );
};

module.exports = {
  obtenerHorarios,
  obtenerHorario,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
};