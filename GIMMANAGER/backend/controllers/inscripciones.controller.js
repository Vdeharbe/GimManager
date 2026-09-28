const InscripcionesModel = require(
  "../models/inscripciones.model"
);

// ==========================================
// OBTENER TODAS LAS INSCRIPCIONES
// ==========================================

const obtenerInscripciones = (req, res) => {
  InscripcionesModel.obtenerInscripciones(
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener inscripciones:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener las inscripciones",
        });
      }

      res.json(resultados);
    }
  );
};

// ==========================================
// OBTENER INSCRIPCIÓN POR ID
// ==========================================

const obtenerInscripcion = (req, res) => {
  const { id } = req.params;

  InscripcionesModel.obtenerInscripcionPorId(
    id,
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener inscripción:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener la inscripción",
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: "Inscripción no encontrada",
        });
      }

      res.json(resultados[0]);
    }
  );
};

// ==========================================
// VALIDAR DATOS
// ==========================================

const validarInscripcion = (datos) => {
  const {
    socio_id,
    horario_id,
    fecha_inscripcion,
  } = datos;

  if (
    !socio_id ||
    !horario_id ||
    !fecha_inscripcion
  ) {
    return {
      valido: false,
      mensaje:
        "Socio, horario y fecha de inscripción son obligatorios",
    };
  }

  return {
    valido: true,
  };
};

// ==========================================
// MANEJAR ERROR DE ESCRITURA
// ==========================================

const manejarErrorEscritura = (
  error,
  res,
  mensajeGeneral
) => {
  console.error(mensajeGeneral, error);

  if (
    error.code === "ER_NO_REFERENCED_ROW_2"
  ) {
    return res.status(400).json({
      mensaje:
        "El socio o el horario seleccionado no existe",
    });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      mensaje:
        "El socio ya está inscripto en este horario",
    });
  }

  return res.status(500).json({
    mensaje: mensajeGeneral,
  });
};

// ==========================================
// CREAR INSCRIPCIÓN
// ==========================================

const crearInscripcion = (req, res) => {
  const validacion =
    validarInscripcion(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  const { horario_id, estado } = req.body;

  // Si se crea directamente como Cancelada,
  // no ocupa un cupo.
  const ocupaCupo =
    (estado || "Activa") === "Activa";

  const guardarInscripcion = () => {
    InscripcionesModel.crearInscripcion(
      req.body,
      (error, resultado) => {
        if (error) {
          return manejarErrorEscritura(
            error,
            res,
            "Error al crear la inscripción"
          );
        }

        return res.status(201).json({
          mensaje:
            "Inscripción creada correctamente",
          id: resultado.insertId,
        });
      }
    );
  };

  // Una inscripción Cancelada no necesita
  // comprobar disponibilidad.
  if (!ocupaCupo) {
    return guardarInscripcion();
  }

  InscripcionesModel.obtenerCupoHorario(
    horario_id,
    (errorCupo, resultadoCupo) => {
      if (errorCupo) {
        console.error(
          "Error al obtener cupo:",
          errorCupo
        );

        return res.status(500).json({
          mensaje:
            "Error al verificar el cupo",
        });
      }

      if (resultadoCupo.length === 0) {
        return res.status(404).json({
          mensaje: "Horario no encontrado",
        });
      }

      const cupoMaximo =
        resultadoCupo[0].cupo_maximo;

      InscripcionesModel.contarInscripcionesActivas(
        horario_id,
        (
          errorCantidad,
          resultadoCantidad
        ) => {
          if (errorCantidad) {
            console.error(
              "Error al contar inscripciones:",
              errorCantidad
            );

            return res.status(500).json({
              mensaje:
                "Error al verificar las inscripciones",
            });
          }

          const cantidadActual =
            Number(
              resultadoCantidad[0].cantidad
            );

          if (
            cantidadActual >=
            Number(cupoMaximo)
          ) {
            return res.status(400).json({
              mensaje:
                "No hay cupos disponibles para este horario",
            });
          }

          return guardarInscripcion();
        }
      );
    }
  );
};

// ==========================================
// ACTUALIZAR INSCRIPCIÓN
// ==========================================

const actualizarInscripcion = (
  req,
  res
) => {
  const { id } = req.params;

  const validacion =
    validarInscripcion(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  // Primero obtenemos la inscripción actual.
  // Necesitamos saber si estaba Activa y
  // a qué horario pertenecía.

  InscripcionesModel.obtenerInscripcionPorId(
    id,
    (errorActual, resultadoActual) => {
      if (errorActual) {
        console.error(
          "Error al obtener inscripción actual:",
          errorActual
        );

        return res.status(500).json({
          mensaje:
            "Error al verificar la inscripción",
        });
      }

      if (resultadoActual.length === 0) {
        return res.status(404).json({
          mensaje:
            "Inscripción no encontrada",
        });
      }

      const inscripcionActual =
        resultadoActual[0];

      const nuevoHorarioId =
        Number(req.body.horario_id);

      const horarioActualId =
        Number(
          inscripcionActual.horario_id
        );

      const nuevoEstado =
        req.body.estado || "Activa";

      const estadoActual =
        inscripcionActual.estado;

      // ======================================
      // ¿EL CAMBIO NECESITA UN NUEVO CUPO?
      // ======================================

      const cambiaAHorarioDistinto =
        nuevoHorarioId !== horarioActualId;

      const seReactiva =
        estadoActual !== "Activa" &&
        nuevoEstado === "Activa";

      const necesitaNuevoCupo =
        nuevoEstado === "Activa" &&
        (
          cambiaAHorarioDistinto ||
          seReactiva
        );

      // ======================================
      // FUNCIÓN QUE REALIZA EL UPDATE
      // ======================================

      const ejecutarActualizacion = () => {
        InscripcionesModel.actualizarInscripcion(
          id,
          req.body,
          (error, resultado) => {
            if (error) {
              return manejarErrorEscritura(
                error,
                res,
                "Error al actualizar la inscripción"
              );
            }

            if (
              resultado.affectedRows === 0
            ) {
              return res.status(404).json({
                mensaje:
                  "Inscripción no encontrada",
              });
            }

            return res.json({
              mensaje:
                "Inscripción actualizada correctamente",
            });
          }
        );
      };

      // ======================================
      // NO NECESITA OCUPAR UN NUEVO CUPO
      // ======================================

      if (!necesitaNuevoCupo) {
        return ejecutarActualizacion();
      }

      // ======================================
      // VERIFICAR CUPO DEL NUEVO HORARIO
      // ======================================

      InscripcionesModel.obtenerCupoHorario(
        nuevoHorarioId,
        (
          errorCupo,
          resultadoCupo
        ) => {
          if (errorCupo) {
            console.error(
              "Error al obtener cupo:",
              errorCupo
            );

            return res.status(500).json({
              mensaje:
                "Error al verificar el cupo",
            });
          }

          if (
            resultadoCupo.length === 0
          ) {
            return res.status(404).json({
              mensaje:
                "Horario no encontrado",
            });
          }

          const cupoMaximo =
            Number(
              resultadoCupo[0]
                .cupo_maximo
            );

          InscripcionesModel.contarInscripcionesActivas(
            nuevoHorarioId,
            (
              errorCantidad,
              resultadoCantidad
            ) => {
              if (errorCantidad) {
                console.error(
                  "Error al contar inscripciones:",
                  errorCantidad
                );

                return res
                  .status(500)
                  .json({
                    mensaje:
                      "Error al verificar las inscripciones",
                  });
              }

              const cantidadActual =
                Number(
                  resultadoCantidad[0]
                    .cantidad
                );

              if (
                cantidadActual >=
                cupoMaximo
              ) {
                return res
                  .status(400)
                  .json({
                    mensaje:
                      "No hay cupos disponibles para este horario",
                  });
              }

              return ejecutarActualizacion();
            }
          );
        }
      );
    }
  );
};

// ==========================================
// ELIMINAR INSCRIPCIÓN
// ==========================================

const eliminarInscripcion = (
  req,
  res
) => {
  const { id } = req.params;

  InscripcionesModel.eliminarInscripcion(
    id,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al eliminar inscripción:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al eliminar la inscripción",
        });
      }

      if (
        resultado.affectedRows === 0
      ) {
        return res.status(404).json({
          mensaje:
            "Inscripción no encontrada",
        });
      }

      res.json({
        mensaje:
          "Inscripción eliminada correctamente",
      });
    }
  );
};

module.exports = {
  obtenerInscripciones,
  obtenerInscripcion,
  crearInscripcion,
  actualizarInscripcion,
  eliminarInscripcion,
};