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

module.exports = {
  login,
};
