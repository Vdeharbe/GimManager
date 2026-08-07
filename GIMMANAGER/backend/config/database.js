const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Parana2083",
  database: "gym_manager",
});

connection.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error);
    return;
  }

  console.log("✅ Conectado a MySQL");
});

module.exports = connection;
