const express = require("express");
const cors = require("cors");
const sociosRoutes = require("./routes/socios.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Rutas
app.use("/api/socios", sociosRoutes);


app.get("/", (req, res) => {
  res.send("🚀 API Gym Manager funcionando");
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
