const Socios = require("../models/socios.model");

// ==========================================
// LISTAR / BUSCAR / FILTRAR / PAGINAR SOCIOS
// ==========================================

const listarSocios = (req, res) => {
  const { buscar = "", estado = "", page, limit } = req.query;

  // ======================================
  // SIN PAGINACIÓN
  // ======================================
  // Si no recibimos page y limit,
  // devolvemos todos los socios.
  //
  // Esto mantiene funcionando otros módulos
  // que utilizan GET /api/socios para cargar
  // listas de socios.
  // ======================================

  if (!page && !limit) {
    return Socios.obtenerSocios(buscar, estado, null, null, (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje: "Error al obtener socios",
          error: err,
        });
      }

      res.json({
        mensaje: "Socios obtenidos correctamente",
        socios: result,
      });
    });
  }

  // ======================================
  // CON PAGINACIÓN
  // ======================================

  const pagina = Math.max(parseInt(page, 10) || 1, 1);

  const limite = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const offset = (pagina - 1) * limite;

  // ======================================
  // CONTAR RESULTADOS
  // ======================================

  Socios.contarSocios(buscar, estado, (err, resultadoConteo) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al contar socios",
        error: err,
      });
    }

    const total = Number(resultadoConteo[0].total);

    const totalPaginas = Math.ceil(total / limite);

    // ==================================
    // OBTENER LA PÁGINA SOLICITADA
    // ==================================

    Socios.obtenerSocios(buscar, estado, limite, offset, (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje: "Error al obtener socios",
          error: err,
        });
      }

      res.json({
        mensaje: "Socios obtenidos correctamente",

        socios: result,

        paginacion: {
          pagina,
          limite,
          total,
          totalPaginas,
        },
      });
    });
  });
};

// ==========================================
// OBTENER SOCIO POR ID
// ==========================================

const obtenerSocio = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      mensaje: "El ID del socio es obligatorio",
    });
  }

  Socios.obtenerSocioPorId(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al obtener el socio",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: "Socio no encontrado",
      });
    }

    res.json({
      mensaje: "Socio obtenido correctamente",
      socio: result[0],
    });
  });
};

// ==========================================
// CREAR SOCIO
// ==========================================

const crearSocio = (req, res) => {
  const { nombre, email, plan, estado } = req.body;

  if (!nombre || !email || !plan || !estado) {
    return res.status(400).json({
      mensaje: "Nombre, email, plan y estado son obligatorios",
    });
  }

  const nuevoSocio = {
    nombre,
    email,
    plan,
    estado,
  };

  Socios.crearSocio(nuevoSocio, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al crear el socio",
        error: err,
      });
    }

    res.status(201).json({
      mensaje: "Socio creado correctamente",
      id: result.insertId,
    });
  });
};

// ==========================================
// ACTUALIZAR SOCIO
// ==========================================

const actualizarSocio = (req, res) => {
  const { id } = req.params;

  const { nombre, email, plan, estado } = req.body;

  if (!id) {
    return res.status(400).json({
      mensaje: "El ID del socio es obligatorio",
    });
  }

  if (!nombre || !email || !plan || !estado) {
    return res.status(400).json({
      mensaje: "Nombre, email, plan y estado son obligatorios",
    });
  }

  const socioActualizado = {
    nombre,
    email,
    plan,
    estado,
  };

  Socios.actualizarSocio(id, socioActualizado, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al actualizar el socio",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Socio no encontrado",
      });
    }

    res.json({
      mensaje: "Socio actualizado correctamente",
    });
  });
};

// ==========================================
// ELIMINAR SOCIO
// ==========================================

const eliminarSocio = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      mensaje: "El ID del socio es obligatorio",
    });
  }

  Socios.eliminarSocio(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al eliminar el socio",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Socio no encontrado",
      });
    }

    res.json({
      mensaje: "Socio eliminado correctamente",
    });
  });
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
