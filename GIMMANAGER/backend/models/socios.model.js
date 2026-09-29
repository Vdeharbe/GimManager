const db = require("../config/database");

// ==========================================
// OBTENER / BUSCAR / FILTRAR / PAGINAR SOCIOS
// ==========================================

const obtenerSocios = (
    buscar,
    estado,
    limit,
    offset,
    callback
) => {
    let consulta = `
        SELECT *
        FROM socios
        WHERE 1 = 1
    `;

    const parametros = [];

    // ======================================
    // BÚSQUEDA POR NOMBRE O EMAIL
    // ======================================

    if (buscar) {
        consulta += `
            AND (
                nombre LIKE ?
                OR email LIKE ?
            )
        `;

        const textoBusqueda = `%${buscar}%`;

        parametros.push(
            textoBusqueda,
            textoBusqueda
        );
    }

    // ======================================
    // FILTRO POR ESTADO
    // ======================================

    if (estado) {
        consulta += `
            AND estado = ?
        `;

        parametros.push(estado);
    }

    // ======================================
    // ORDENAR
    // ======================================

    consulta += `
        ORDER BY nombre ASC
    `;

    // ======================================
    // PAGINACIÓN
    // Solo se aplica si recibimos limit y offset
    // ======================================

    if (
        Number.isInteger(limit) &&
        Number.isInteger(offset)
    ) {
        consulta += `
            LIMIT ?
            OFFSET ?
        `;

        parametros.push(
            limit,
            offset
        );
    }

    db.query(
        consulta,
        parametros,
        callback
    );
};

// ==========================================
// CONTAR SOCIOS
// ==========================================

const contarSocios = (
    buscar,
    estado,
    callback
) => {
    let consulta = `
        SELECT COUNT(*) AS total
        FROM socios
        WHERE 1 = 1
    `;

    const parametros = [];

    // ======================================
    // BÚSQUEDA POR NOMBRE O EMAIL
    // ======================================

    if (buscar) {
        consulta += `
            AND (
                nombre LIKE ?
                OR email LIKE ?
            )
        `;

        const textoBusqueda = `%${buscar}%`;

        parametros.push(
            textoBusqueda,
            textoBusqueda
        );
    }

    // ======================================
    // FILTRO POR ESTADO
    // ======================================

    if (estado) {
        consulta += `
            AND estado = ?
        `;

        parametros.push(estado);
    }

    db.query(
        consulta,
        parametros,
        callback
    );
};

// ==========================================
// OBTENER SOCIO POR ID
// ==========================================

const obtenerSocioPorId = (
    id,
    callback
) => {
    db.query(
        `
        SELECT *
        FROM socios
        WHERE id = ?
        `,
        [id],
        callback
    );
};

// ==========================================
// CREAR SOCIO
// ==========================================

const crearSocio = (
    socio,
    callback
) => {
    db.query(
        `
        INSERT INTO socios
        (
            nombre,
            email,
            plan,
            estado
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            socio.nombre,
            socio.email,
            socio.plan,
            socio.estado
        ],
        callback
    );
};

// ==========================================
// ACTUALIZAR SOCIO
// ==========================================

const actualizarSocio = (
    id,
    socio,
    callback
) => {
    db.query(
        `
        UPDATE socios
        SET
            nombre = ?,
            email = ?,
            plan = ?,
            estado = ?
        WHERE id = ?
        `,
        [
            socio.nombre,
            socio.email,
            socio.plan,
            socio.estado,
            id
        ],
        callback
    );
};

// ==========================================
// ELIMINAR SOCIO
// ==========================================

const eliminarSocio = (
    id,
    callback
) => {
    db.query(
        `
        DELETE FROM socios
        WHERE id = ?
        `,
        [id],
        callback
    );
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

module.exports = {
    obtenerSocios,
    contarSocios,
    obtenerSocioPorId,
    crearSocio,
    actualizarSocio,
    eliminarSocio
};