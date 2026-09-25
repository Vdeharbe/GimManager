const jwt = require("jsonwebtoken");

// ==========================================
// VERIFICAR TOKEN
// ==========================================

const verificarToken = (req, res, next) => {

    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    // Comprobar si existe
    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }

    // Formato esperado:
    // Bearer eyJhbGciOiJIUzI1Ni...
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Token no válido"
        });
    }

    try {

        // Verificar token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar usuario dentro de la request
        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });

    }
};


// ==========================================
// VERIFICAR ROL
// ==========================================

const verificarRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        // Verificar que exista usuario autenticado
        if (!req.usuario || !req.usuario.rol) {

            return res.status(401).json({
                mensaje: "No autenticado"
            });

        }

        // Verificar que el rol esté permitido
        if (!rolesPermitidos.includes(req.usuario.rol)) {

            return res.status(403).json({
                mensaje:
                    "No tienes permisos para esta acción"
            });

        }

        next();
    };
};


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    verificarToken,
    verificarRol
};