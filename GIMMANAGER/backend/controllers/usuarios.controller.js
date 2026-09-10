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

    const {
        nombre,
        email,
        password,
        rol
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !password || !rol) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    // Verificar si el usuario ya existe
    Usuarios.buscarUsuarioPorEmail(
        email,
        async (err, usuarios) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    mensaje: "Error en el servidor"
                });
            }

            if (usuarios.length > 0) {
                return res.status(409).json({
                    mensaje: "El email ya está registrado"
                });
            }

            try {

                // Generar hash
                const passwordHash = await bcrypt.hash(
                    password,
                    10
                );

                const nuevoUsuario = {
                    nombre,
                    email,
                    password: passwordHash,
                    rol
                };

                Usuarios.crearUsuario(
                    nuevoUsuario,
                    (err, resultado) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                mensaje: "Error al crear usuario"
                            });
                        }

                        return res.status(201).json({
                            mensaje: "Usuario creado correctamente",
                            usuario: {
                                id: resultado.insertId,
                                nombre,
                                email,
                                rol
                            }
                        });

                    }
                );

            } catch (error) {

                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al procesar la contraseña"
                });
            }

        }
    );
};
const obtenerUsuarios = (req, res) => {

    Usuarios.listarUsuarios((err, usuarios) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                mensaje: "Error al obtener usuarios"
            });
        }

        return res.json(usuarios);
    });
};

module.exports = {
  login,
  registrarUsuario,
  obtenerUsuarios
};
