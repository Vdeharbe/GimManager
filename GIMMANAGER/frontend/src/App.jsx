import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import Profesores from "./pages/Profesores";
import Pagos from "./pages/Pagos";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";
import Reportes from "./pages/Reportes";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/" element={<Login />} />

          {/* RUTAS PROTEGIDAS */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/socios"
            element={
              <ProtectedRoute>
                <Socios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profesores"
            element={
              <ProtectedRoute>
                <Profesores />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagos"
            element={
              <ProtectedRoute>
                <Pagos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            }
          />

          {/* RUTA PARA PÁGINAS INEXISTENTES */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
