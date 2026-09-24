const Configuracion = require("../models/configuracion.model");

// ==========================================
// OBTENER CONFIGURACIÓN
// ==========================================

const obtenerConfiguracion = (req, res) => {
  Configuracion.obtenerConfiguracion(
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al obtener configuración:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener la configuración",
        });
      }

      // Si no existe configuración
      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje:
            "No se encontró la configuración",
        });
      }

      // Devolvemos el único registro
      res.json(resultados[0]);
    }
  );
};

// ==========================================
// ACTUALIZAR CONFIGURACIÓN
// ==========================================

const actualizarConfiguracion = (req, res) => {
  const { id } = req.params;

  const {
    nombre_gimnasio,
    direccion,
    telefono,
    email,
    horario_apertura,
    horario_cierre,
  } = req.body;

  // ========================================
  // VALIDACIÓN
  // ========================================

  if (!nombre_gimnasio) {
    return res.status(400).json({
      mensaje:
        "El nombre del gimnasio es obligatorio",
    });
  }

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      mensaje:
        "El formato del email no es válido",
    });
  }

  // ========================================
  // ACTUALIZAR
  // ========================================

  Configuracion.actualizarConfiguracion(
    id,
    nombre_gimnasio,
    direccion || "",
    telefono || "",
    email || "",
    horario_apertura || null,
    horario_cierre || null,
    (error, resultado) => {
      if (error) {
        console.error(
          "Error al actualizar configuración:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al actualizar la configuración",
        });
      }

      // ID inexistente
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje:
            "No se encontró la configuración",
        });
      }

      res.json({
        mensaje:
          "Configuración actualizada correctamente",
      });
    }
  );
};

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
};