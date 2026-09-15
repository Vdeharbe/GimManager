const Usuarios = require("../models/usuarios.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Login
const login = (req, res) => {
  console.log("=== SOLICITUD LOGIN ===");
  console.log("Método:", req.method);
  console.log("URL:", req.url);
  console.log("Headers Content-Type:", req.headers["content-type"]);
  console.log("Content-Length:", req.headers["content-length"]);
  console.log("Body completo:", req.body);
  console.log("=======================");

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      mensaje: "Email y contraseña son obligatorios",
    });
  }

  Usuarios.buscarUsuarioPorEmail(email, async (err, usuarios) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error en el servidor",
      });
    }

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos",
      });
    }

    const usuario = usuarios[0];

    // ==========================================
    // COMPARAR CONTRASEÑA CON BCRYPT
    // ==========================================

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos",
      });
    }

    // ==========================================
    // GENERAR TOKEN JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    // ==========================================
    // RESPUESTA DEL LOGIN
    // ==========================================

    return res.json({
      mensaje: "Login correcto",

      token,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  });
};
const registrarUsuario = (req, res) => {
  const { nombre, email, password, rol } = req.body;

  // Validar campos obligatorios
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios",
    });
  }

  // Verificar si el usuario ya existe
  Usuarios.buscarUsuarioPorEmail(email, async (err, usuarios) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error en el servidor",
      });
    }

    if (usuarios.length > 0) {
      return res.status(409).json({
        mensaje: "El email ya está registrado",
      });
    }

    try {
      // Generar hash
      const passwordHash = await bcrypt.hash(password, 10);

      const nuevoUsuario = {
        nombre,
        email,
        password: passwordHash,
        rol,
      };

      Usuarios.crearUsuario(nuevoUsuario, (err, resultado) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            mensaje: "Error al crear usuario",
          });
        }

        return res.status(201).json({
          mensaje: "Usuario creado correctamente",
          usuario: {
            id: resultado.insertId,
            nombre,
            email,
            rol,
          },
        });
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: "Error al procesar la contraseña",
      });
    }
  });
};
const obtenerUsuarios = (req, res) => {
  Usuarios.listarUsuarios((err, usuarios) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al obtener usuarios",
      });
    }

    return res.json(usuarios);
  });
};

const actualizarUsuario = (req, res) => {
  const { id } = req.params;

  const { nombre, email, rol } = req.body;

  if (!nombre || !email || !rol) {
    return res.status(400).json({
      mensaje: "Nombre, email y rol son obligatorios",
    });
  }

  Usuarios.actualizarUsuario(
    id,
    {
      nombre,
      email,
      rol,
    },
    (err, resultado) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje: "Error al actualizar usuario",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado",
        });
      }

      return res.json({
        mensaje: "Usuario actualizado correctamente",
      });
    },
  );
};

const eliminarUsuario = (req, res) => {
  const { id } = req.params;

  Usuarios.eliminarUsuario(id, (err, resultado) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al eliminar usuario",
      });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    return res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  });
};
const cambiarPassword = async (req, res) => {
  const { id } = req.params;
  const { nuevaPassword } = req.body;

  if (!nuevaPassword) {
    return res.status(400).json({
      mensaje: "La nueva contraseña es obligatoria",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    Usuarios.actualizarPassword(id, passwordHash, (err, resultado) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje: "Error al actualizar la contraseña",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado",
        });
      }

      return res.json({
        mensaje: "Contraseña actualizada correctamente",
      });
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al procesar la contraseña",
    });
  }
};

module.exports = {
  login,
  registrarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
};
