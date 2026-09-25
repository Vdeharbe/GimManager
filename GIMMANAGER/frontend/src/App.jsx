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
import Rutinas from "./pages/Rutinas";
import Horarios from "./pages/Horarios";

import RoleRoute from "./context/RoleRoute";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* ==========================================
            BARRA DE NAVEGACIÓN
        ========================================== */}

        <Navbar />

        <Routes>

          {/* ==========================================
              RUTA PÚBLICA
          ========================================== */}

          <Route
            path="/"
            element={<Login />}
          />

          {/* ==========================================
              DASHBOARD
              ADMIN + INSTRUCTOR
          ========================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ==========================================
              SOCIOS
              ADMIN + INSTRUCTOR

              Instructor:
              solo consulta

              Admin:
              CRUD completo
          ========================================== */}

          <Route
            path="/socios"
            element={
              <ProtectedRoute>
                <Socios />
              </ProtectedRoute>
            }
          />

          {/* ==========================================
              PROFESORES
              ADMIN + INSTRUCTOR

              Instructor:
              solo consulta

              Admin:
              CRUD completo
          ========================================== */}

          <Route
            path="/profesores"
            element={
              <ProtectedRoute>
                <Profesores />
              </ProtectedRoute>
            }
          />

          {/* ==========================================
              RUTINAS
              ADMIN + INSTRUCTOR

              Instructor:
              ver, crear y editar

              Admin:
              CRUD completo
          ========================================== */}

          <Route
            path="/rutinas"
            element={
              <RoleRoute
                roles={[
                  "admin",
                  "instructor",
                ]}
              >
                <Rutinas />
              </RoleRoute>
            }
          />

          {/* ==========================================
              HORARIOS
              ADMIN + INSTRUCTOR

              Instructor:
              ver, crear y editar

              Admin:
              CRUD completo
          ========================================== */}

          <Route
            path="/horarios"
            element={
              <RoleRoute
                roles={[
                  "admin",
                  "instructor",
                ]}
              >
                <Horarios />
              </RoleRoute>
            }
          />

          {/* ==========================================
              PAGOS
              SOLO ADMIN
          ========================================== */}

          <Route
            path="/pagos"
            element={
              <RoleRoute roles={["admin"]}>
                <Pagos />
              </RoleRoute>
            }
          />

          {/* ==========================================
              REPORTES
              SOLO ADMIN
          ========================================== */}

          <Route
            path="/reportes"
            element={
              <RoleRoute roles={["admin"]}>
                <Reportes />
              </RoleRoute>
            }
          />

          {/* ==========================================
              CONFIGURACIÓN
              SOLO ADMIN
          ========================================== */}

          <Route
            path="/configuracion"
            element={
              <RoleRoute roles={["admin"]}>
                <Configuracion />
              </RoleRoute>
            }
          />

          {/* ==========================================
              PÁGINA NO ENCONTRADA
          ========================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;