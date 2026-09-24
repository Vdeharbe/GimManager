require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sociosRoutes = require("./routes/socios.routes");
const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const profesoresRoutes = require("./routes/profesores.routes");
const pagosRoutes = require("./routes/pagos.routes");
const reportesRoutes = require("./routes/reportes.routes");
const configuracionRoutes = require("./routes/configuracion.routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware CORS mejorado
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware de parseo
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.raw({ limit: "10mb", type: "application/*" }));

// Middleware de logging global
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body raw:", req.body);
  next();
});

// Rutas

app.use("/api/socios", sociosRoutes);
app.use("/api/login", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/configuracion", configuracionRoutes);

// Ruta de test para verificar body parsing
app.post("/api/test", (req, res) => {
  res.json({
    mensaje: "Test recibido",
    bodyRecibido: req.body,
    headers: {
      contentType: req.headers["content-type"],
      contentLength: req.headers["content-length"],
    },
  });
});

// Ruta principal

app.get("/", (req, res) => {
  res.send("🚀 API Gym Manager funcionando");
});

// Manejo de errores 404

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

// Inicia el servidor

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
