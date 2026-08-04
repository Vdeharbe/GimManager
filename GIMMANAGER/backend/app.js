//Importa Express
const express = require("express");
//crea la aplicacion
const app = express();

const PORT = 3000;
//defino ruta
app.get("/", (req, res) => {
  res.send("🚀 API Gym Manager funcionando");
});
// ruta socios
app.get("/api/socios", (req, res) => {
  const socios = [
    {
      id: 1,
      nombre: "Juan Pérez",
      plan: "Premium",
    },
    {
      id: 2,
      nombre: "María Gómez",
      plan: "Básico",
    },
  ];

  res.json(socios);
});
//ruta profesores
app.get("/api/profesores", (req, res) => {
  res.json([
    { id: 1, nombre: "Carlos Díaz" },
    { id: 2, nombre: "Laura Pérez" },
  ]);
});
//ruta pagos
app.get("/api/pagos", (req, res) => {
  res.json([
    { id: 1, monto: 25000 },
    { id: 2, monto: 30000 },
  ]);
});
//inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
