const Usuarios = require("../models/usuarios.model");

// Login
const login = (req, res) => {

    console.log("=== SOLICITUD LOGIN ===");
    console.log("Método:", req.method);
    console.log("URL:", req.url);
    console.log("Headers Content-Type:", req.headers['content-type']);
    console.log("Content-Length:", req.headers['content-length']);
    console.log("Body completo:", req.body);
    console.log("=======================");

    const { email, password } = req.body || {};

    if (!email || !password) {

        console.error("❌ Email o contraseña faltantes");
        console.error("   Email:", email);
        console.error("   Password:", password);

        return res.status(400).json({
            mensaje: "Email y contraseña son obligatorios",
            recibido: req.body,
            debug: {
                tieneBody: !!req.body,
                tieneEmail: !!email,
                tienePassword: !!password
            }
        });

    }

    Usuarios.buscarUsuarioPorEmail(
        email,
        (err, usuarios) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    mensaje: "Error en el servidor"
                });

            }

            if (usuarios.length === 0) {

                return res.status(401).json({
                    mensaje: "Email o contraseña incorrectos"
                });

            }

            const usuario = usuarios[0];

            if (usuario.password !== password) {

                return res.status(401).json({
                    mensaje: "Email o contraseña incorrectos"
                });

            }

            res.json({
                mensaje: "Login correcto",
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });

        }
    );

};

module.exports = {
    login
};