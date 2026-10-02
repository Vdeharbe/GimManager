const Socios = require("../models/socios.model");

// ==========================================
// CONFIGURACIÓN DE VALIDACIONES
// ==========================================

const PLANES_PERMITIDOS = [
  "Premium",
  "Básico",
];

const ESTADOS_PERMITIDOS = [
  "Activo",
  "Inactivo",
];

// ==========================================
// VALIDAR DATOS DE UN SOCIO
// ==========================================

const validarDatosSocio = (datos) => {
  const {
    nombre,
    email,
    plan,
    estado,
  } = datos;

  // CAMPOS OBLIGATORIOS
  if (
    !nombre ||
    !email ||
    !plan ||
    !estado
  ) {
    return {
      valido: false,
      mensaje:
        "Nombre, email, plan y estado son obligatorios",
    };
  }

  // TIPOS DE DATOS
  if (
    typeof nombre !== "string" ||
    typeof email !== "string" ||
    typeof plan !== "string" ||
    typeof estado !== "string"
  ) {
    return {
      valido: false,
      mensaje:
        "Los datos del socio no son válidos",
    };
  }

  // LIMPIAR DATOS
  const nombreLimpio =
    nombre.trim();

  const emailLimpio =
    email.trim().toLowerCase();

  // VALIDAR NOMBRE
  if (nombreLimpio.length < 2) {
    return {
      valido: false,
      mensaje:
        "El nombre debe tener al menos 2 caracteres",
    };
  }

  // VALIDAR EMAIL
  const regexEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(emailLimpio)) {
    return {
      valido: false,
      mensaje:
        "El email no tiene un formato válido",
    };
  }

  // VALIDAR PLAN
  if (
    !PLANES_PERMITIDOS.includes(plan)
  ) {
    return {
      valido: false,
      mensaje:
        "El plan no es válido",
    };
  }

  // VALIDAR ESTADO
  if (
    !ESTADOS_PERMITIDOS.includes(estado)
  ) {
    return {
      valido: false,
      mensaje:
        "El estado no es válido",
    };
  }

  // DATOS CORRECTOS
  return {
    valido: true,

    datos: {
      nombre: nombreLimpio,
      email: emailLimpio,
      plan,
      estado,
    },
  };
};

// ==========================================
// VALIDAR ID
// ==========================================

const obtenerIdValido = (id) => {
  const idNumerico = Number(id);

  if (
    !Number.isInteger(idNumerico) ||
    idNumerico <= 0
  ) {
    return null;
  }

  return idNumerico;
};

// ==========================================
// LISTAR / BUSCAR / FILTRAR / PAGINAR
// ==========================================

const listarSocios = (req, res) => {
  const {
    buscar = "",
    estado = "",
    page,
    limit,
  } = req.query;

  // VALIDAR ESTADO
  if (
    estado &&
    !ESTADOS_PERMITIDOS.includes(estado)
  ) {
    return res.status(400).json({
      mensaje:
        "El estado debe ser Activo o Inactivo",
    });
  }

  // VALIDAR BÚSQUEDA
  if (typeof buscar !== "string") {
    return res.status(400).json({
      mensaje:
        "El parámetro buscar no es válido",
    });
  }

  const buscarLimpio = buscar.trim();

  if (buscarLimpio.length > 100) {
    return res.status(400).json({
      mensaje:
        "La búsqueda no puede superar los 100 caracteres",
    });
  }

  // ======================================
  // SIN PAGINACIÓN
  // ======================================

  if (!page && !limit) {
    return Socios.obtenerSocios(
      buscarLimpio,
      estado,
      null,
      null,
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            mensaje:
              "Error al obtener socios",
          });
        }

        return res.json({
          mensaje:
            "Socios obtenidos correctamente",
          socios: result,
        });
      }
    );
  }

  // ======================================
  // VALIDAR PAGINACIÓN
  // ======================================

  const pagina = Number(page || 1);
  const limite = Number(limit || 10);

  if (
    !Number.isInteger(pagina) ||
    pagina <= 0
  ) {
    return res.status(400).json({
      mensaje:
        "El parámetro page debe ser un número entero mayor a 0",
    });
  }

  if (
    !Number.isInteger(limite) ||
    limite <= 0 ||
    limite > 100
  ) {
    return res.status(400).json({
      mensaje:
        "El parámetro limit debe ser un número entero entre 1 y 100",
    });
  }

  const offset =
    (pagina - 1) * limite;

  // ======================================
  // CONTAR REGISTROS
  // ======================================

  Socios.contarSocios(
    buscarLimpio,
    estado,
    (err, resultadoConteo) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje:
            "Error al contar socios",
        });
      }

      const total =
        Number(resultadoConteo[0].total);

      const totalPaginas =
        Math.ceil(total / limite);

      // ==================================
      // OBTENER PÁGINA
      // ==================================

      Socios.obtenerSocios(
        buscarLimpio,
        estado,
        limite,
        offset,
        (err, result) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              mensaje:
                "Error al obtener socios",
            });
          }

          return res.json({
            mensaje:
              "Socios obtenidos correctamente",

            socios: result,

            paginacion: {
              pagina,
              limite,
              total,
              totalPaginas,
            },
          });
        }
      );
    }
  );
};

// ==========================================
// OBTENER SOCIO POR ID
// ==========================================

const obtenerSocio = (req, res) => {
  const id =
    obtenerIdValido(req.params.id);

  if (id === null) {
    return res.status(400).json({
      mensaje:
        "El ID del socio no es válido",
    });
  }

  Socios.obtenerSocioPorId(
    id,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje:
            "Error al obtener el socio",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          mensaje:
            "Socio no encontrado",
        });
      }

      return res.json({
        mensaje:
          "Socio obtenido correctamente",
        socio: result[0],
      });
    }
  );
};

// ==========================================
// CREAR SOCIO
// ==========================================

const crearSocio = (req, res) => {
  const validacion =
    validarDatosSocio(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  const nuevoSocio =
    validacion.datos;

  Socios.crearSocio(
    nuevoSocio,
    (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            mensaje:
              "Ya existe un socio con ese email",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al crear el socio",
        });
      }

      return res.status(201).json({
        mensaje:
          "Socio creado correctamente",
        id: result.insertId,
      });
    }
  );
};

// ==========================================
// ACTUALIZAR SOCIO
// ==========================================

const actualizarSocio = (req, res) => {
  const id =
    obtenerIdValido(req.params.id);

  if (id === null) {
    return res.status(400).json({
      mensaje:
        "El ID del socio no es válido",
    });
  }

  const validacion =
    validarDatosSocio(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      mensaje: validacion.mensaje,
    });
  }

  const socioActualizado =
    validacion.datos;

  Socios.actualizarSocio(
    id,
    socioActualizado,
    (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            mensaje:
              "Ya existe un socio con ese email",
          });
        }

        return res.status(500).json({
          mensaje:
            "Error al actualizar el socio",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje:
            "Socio no encontrado",
        });
      }

      return res.json({
        mensaje:
          "Socio actualizado correctamente",
      });
    }
  );
};

// ==========================================
// ELIMINAR SOCIO
// ==========================================

const eliminarSocio = (req, res) => {
  const id =
    obtenerIdValido(req.params.id);

  if (id === null) {
    return res.status(400).json({
      mensaje:
        "El ID del socio no es válido",
    });
  }

  Socios.eliminarSocio(
    id,
    (err, result) => {
     if (err) {
  console.error(err);

  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({
      mensaje:
        "No se puede eliminar el socio porque tiene registros asociados",
    });
  }

  return res.status(500).json({
    mensaje:
      "Error al eliminar el socio",
  });
}

      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje:
            "Socio no encontrado",
        });
      }

      return res.json({
        mensaje:
          "Socio eliminado correctamente",
      });
    }
  );
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

module.exports = {
  listarSocios,
  obtenerSocio,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
};