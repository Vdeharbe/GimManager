const express = require("express");
const cors = require("cors");

const sociosRoutes = require("./routes/socios.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware CORS mejorado
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.raw({ limit: '10mb', type: 'application/*' }));

// Middleware de logging global
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Body raw:", req.body);
  next();
});

// Rutas

app.use("/api/socios", sociosRoutes);

app.use("/api/login", usuariosRoutes);

// Ruta de test para verificar body parsing
app.post("/api/test", (req, res) => {
  res.json({
    mensaje: "Test recibido",
    bodyRecibido: req.body,
    headers: {
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length']
    }
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
