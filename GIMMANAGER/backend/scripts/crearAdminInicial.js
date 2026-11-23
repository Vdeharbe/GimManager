
require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../config/database");
const Usuarios = require("../models/usuarios.model");

const nombre = process.env.ADMIN_INICIAL_NOMBRE;
const email = process.env.ADMIN_INICIAL_EMAIL;
const password = process.env.ADMIN_INICIAL_PASSWORD;

const cerrarConexion = () => db.end();

const crearAdminInicial = async () => {
  try {
    if (!nombre || !email || !password) {
      throw new Error("Faltan datos del administrador inicial.");
    }

    if (password.length < 12) {
      throw new Error("La contraseña debe tener al menos 12 caracteres.");
    }

    // Verificar que la tabla usuarios esté vacía
    const cantidad = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS total FROM usuarios", (err, filas) => {
        if (err) return reject(err);
        resolve(Number(filas[0].total));
      });
    });

    if (cantidad !== 0) {
      throw new Error("Ya existen usuarios. No se creará otro administrador.");
    }

    // Generar hash de contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Reutilizar nuestro modelo
    const resultado = await new Promise((resolve, reject) => {
      Usuarios.crearUsuario(
        {
          nombre,
          email,
          password: passwordHash,
          rol: "admin",
        },
        (err, resultado) => {
          if (err) return reject(err);
          resolve(resultado);
        }
      );
    });

    console.log("Administrador inicial creado correctamente.");
    console.log("ID:", resultado.insertId);
  } catch (error) {
    console.error("No se pudo crear el administrador:", error.message);
    process.exitCode = 1;
  } finally {
    cerrarConexion();
  }
};

crearAdminInicial();
