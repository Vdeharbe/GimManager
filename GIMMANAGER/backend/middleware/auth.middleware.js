const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {

    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    // Comprobar si existe
    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }

    // El formato esperado es:
    // Bearer eyJhbGciOiJIUzI1Ni...
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Token no válido"
        });
    }

    try {

        // Verificar el token usando nuestra clave secreta
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardamos los datos del usuario en la request
        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });

    }
};

module.exports = {
    verificarToken
};