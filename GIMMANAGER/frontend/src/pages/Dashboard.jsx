import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/ui/StatCard";

import { useAuth } from "../context/AuthContext";

import {
  obtenerResumen,
  obtenerResumenFinanciero,
  obtenerIngresosPorMes,
} from "../services/reportesService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const { usuario } = useAuth();

  // ==========================================
  // SABER SI ES ADMIN
  // ==========================================

  const esAdmin =
    usuario?.rol === "admin";

  // ==========================================
  // RESUMEN GENERAL
  // ==========================================

  const [resumen, setResumen] = useState({
    socios: 0,
    sociosActivos: 0,
    profesores: 0,
  });

  // ==========================================
  // RESUMEN FINANCIERO
  // ==========================================

  const [
    resumenFinanciero,
    setResumenFinanciero,
  ] = useState({
    totalPagos: 0,
    totalCobrado: 0,
  });

  // ==========================================
  // INGRESOS MENSUALES
  // ==========================================

  const [
    ingresosMensuales,
    setIngresosMensuales,
  ] = useState([]);

  // ==========================================
  // ESTADOS DE PANTALLA
  // ==========================================

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FORMATEAR MONEDA
  // ==========================================

  const formatearMoneda = (valor) => {
    return Number(valor).toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
      }
    );
  };

  // ==========================================
  // FORMATEAR MES
  // Ejemplo: 2026-09 → sept 2026
  // ==========================================

  const formatearMes = (mes) => {
    if (!mes) {
      return "";
    }

    const [anio, numeroMes] =
      mes.split("-");

    const fecha = new Date(
      Number(anio),
      Number(numeroMes) - 1,
      1
    );

    return fecha.toLocaleDateString(
      "es-AR",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CARGAR DASHBOARD
  // ==========================================

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      setError("");

      // ======================================
      // DATOS GENERALES
      // Admin + Instructor
      // ======================================

      const datosResumen =
        await obtenerResumen();

      setResumen(datosResumen);

      // ======================================
      // DATOS FINANCIEROS
      // Solo Admin
      // ======================================

      if (esAdmin) {
        const [
          datosFinancieros,
          datosIngresos,
        ] = await Promise.all([
          obtenerResumenFinanciero(),
          obtenerIngresosPorMes(),
        ]);

        setResumenFinanciero(
          datosFinancieros
        );

        setIngresosMensuales(
          datosIngresos
        );
      }

    } catch (error) {
      console.error(
        "Error al cargar dashboard:",
        error
      );

      setError(
        "No se pudieron cargar los datos del dashboard."
      );

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR AL ENTRAR
  // ==========================================

  useEffect(() => {
    cargarDashboard();
  }, [esAdmin]);

  return (
    <div className="d-flex">

      {/* SIDEBAR */}

      <Sidebar />

      {/* CONTENIDO */}

      <div className="container mt-4 flex-grow-1">

        {/* ==================================
            VOLVER
        ================================== */}

        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <h2 className="mb-4">
          📊 Dashboard
        </h2>

        {/* ==================================
            CARGANDO
        ================================== */}

        {cargando && (
          <div className="alert alert-info">
            Cargando información...
          </div>
        )}

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* ==================================
            CONTENIDO
        ================================== */}

        {!cargando && !error && (
          <>

            {/* ==============================
                DATOS GENERALES
            ============================== */}

            <div className="row g-4">

              {/* SOCIOS TOTALES */}

              <div className="col-md-4">

                <StatCard
                  titulo="Socios totales"
                  valor={resumen.socios}
                  color="secondary"
                />

              </div>

              {/* SOCIOS ACTIVOS */}

              <div className="col-md-4">

                <StatCard
                  titulo="Socios activos"
                  valor={
                    resumen.sociosActivos
                  }
                  color="primary"
                />

              </div>

              {/* PROFESORES */}

              <div className="col-md-4">

                <StatCard
                  titulo="Profesores"
                  valor={
                    resumen.profesores
                  }
                  color="success"
                />

              </div>

            </div>

            {/* ==============================
                SECCIÓN FINANCIERA
                SOLO ADMIN
            ============================== */}

            {esAdmin && (
              <>

                <h4 className="mt-5 mb-3">
                  💰 Información financiera
                </h4>

                <div className="row g-4">

                  {/* TOTAL PAGOS */}

                  <div className="col-md-6">

                    <StatCard
                      titulo="Pagos"
                      valor={
                        resumenFinanciero.totalPagos
                      }
                      color="warning"
                    />

                  </div>

                  {/* TOTAL COBRADO */}

                  <div className="col-md-6">

                    <StatCard
                      titulo="Total cobrado"
                      valor={formatearMoneda(
                        resumenFinanciero.totalCobrado
                      )}
                      color="info"
                    />

                  </div>

                </div>

                {/* ==========================
                    GRÁFICO
                ========================== */}

                <div className="card shadow-sm mt-4 mb-4">

                  <div className="card-body">

                    <h4 className="card-title mb-4">
                      📈 Ingresos mensuales
                    </h4>

                    {ingresosMensuales.length ===
                    0 ? (

                      <div className="alert alert-warning">
                        No hay ingresos para mostrar.
                      </div>

                    ) : (

                      <div
                        style={{
                          width: "100%",
                          height: "350px",
                        }}
                      >

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <BarChart
                            data={
                              ingresosMensuales
                            }
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 20,
                            }}
                          >

                            <CartesianGrid
                              strokeDasharray="3 3"
                            />

                            <XAxis
                              dataKey="mes"
                              tickFormatter={
                                formatearMes
                              }
                            />

                            <YAxis />

                            <Tooltip
                              labelFormatter={
                                formatearMes
                              }
                              formatter={(
                                value
                              ) => [
                                formatearMoneda(
                                  value
                                ),
                                "Ingresos",
                              ]}
                            />

                            <Bar
                              dataKey="total"
                              name="Ingresos"
                            />

                          </BarChart>

                        </ResponsiveContainer>

                      </div>

                    )}

                  </div>

                </div>

              </>
            )}

          </>
        )}

      </div>

    </div>
  );
}

export default Dashboard;