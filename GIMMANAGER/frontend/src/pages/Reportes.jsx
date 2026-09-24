import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function Reportes() {
  const navigate = useNavigate();

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

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FORMATEAR MES CORTO
  // Ejemplo: 2026-09 → sept 2026
  // ==========================================

  const formatearMesCorto = (mes) => {
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
  // FORMATEAR MES LARGO
  // Ejemplo: 2026-09 → septiembre de 2026
  // ==========================================

  const formatearMesLargo = (mes) => {
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
        month: "long",
        year: "numeric",
      }
    );
  };

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
  // CARGAR REPORTES
  // ==========================================

  const cargarReportes = async () => {
    try {
      setCargando(true);
      setError("");

      // Las tres consultas son independientes.
      // Por eso podemos ejecutarlas juntas.

      const [
        datosResumen,
        datosFinancieros,
        datosIngresos,
      ] = await Promise.all([
        obtenerResumen(),
        obtenerResumenFinanciero(),
        obtenerIngresosPorMes(),
      ]);

      setResumen(
        datosResumen
      );

      setResumenFinanciero(
        datosFinancieros
      );

      setIngresosMensuales(
        datosIngresos
      );

    } catch (error) {
      console.error(
        "Error al cargar reportes:",
        error
      );

      setError(
        "No se pudieron cargar los reportes."
      );

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR AL ENTRAR
  // ==========================================

  useEffect(() => {
    cargarReportes();
  }, []);

  return (
    <div className="container mt-4">

      {/* ======================================
          BOTÓN VOLVER
      ====================================== */}

      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <h2 className="mb-4">
        📊 Reportes
      </h2>

      {/* ======================================
          CARGANDO
      ====================================== */}

      {cargando && (
        <div className="alert alert-info">
          Cargando reportes...
        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>

          {/* ==================================
              DATOS GENERALES
          ================================== */}

          <h4 className="mb-3">
            📋 Resumen general
          </h4>

          <div className="row g-4">

            {/* SOCIOS */}

            <div className="col-md-6 col-lg-4">

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    👥 Socios
                  </h5>

                  <h2>
                    {resumen.socios}
                  </h2>

                  <p className="text-muted mb-0">
                    Socios registrados
                  </p>

                </div>

              </div>

            </div>

            {/* SOCIOS ACTIVOS */}

            <div className="col-md-6 col-lg-4">

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    ✅ Socios activos
                  </h5>

                  <h2>
                    {resumen.sociosActivos}
                  </h2>

                  <p className="text-muted mb-0">
                    Actualmente activos
                  </p>

                </div>

              </div>

            </div>

            {/* PROFESORES */}

            <div className="col-md-6 col-lg-4">

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    🏋️ Profesores
                  </h5>

                  <h2>
                    {resumen.profesores}
                  </h2>

                  <p className="text-muted mb-0">
                    Profesores registrados
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================
              INFORMACIÓN FINANCIERA
          ================================== */}

          <h4 className="mt-5 mb-3">
            💰 Información financiera
          </h4>

          <div className="row g-4">

            {/* PAGOS */}

            <div className="col-md-6">

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    💳 Pagos realizados
                  </h5>

                  <h2>
                    {
                      resumenFinanciero.totalPagos
                    }
                  </h2>

                  <p className="text-muted mb-0">
                    Pagos registrados
                  </p>

                </div>

              </div>

            </div>

            {/* TOTAL COBRADO */}

            <div className="col-md-6">

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    💰 Total cobrado
                  </h5>

                  <h2>
                    {formatearMoneda(
                      resumenFinanciero.totalCobrado
                    )}
                  </h2>

                  <p className="text-muted mb-0">
                    Ingresos registrados
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================
              GRÁFICO DE INGRESOS
          ================================== */}

          <div className="card shadow-sm mt-5">

            <div className="card-body">

              <h4 className="card-title mb-4">
                📈 Evolución de ingresos
              </h4>

              {ingresosMensuales.length ===
              0 ? (

                <div className="alert alert-warning">
                  No hay datos para mostrar
                  en el gráfico.
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
                          formatearMesCorto
                        }
                      />

                      <YAxis />

                      <Tooltip
                        labelFormatter={
                          formatearMesLargo
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

          {/* ==================================
              TABLA DE INGRESOS MENSUALES
          ================================== */}

          <div className="card shadow-sm mt-4 mb-4">

            <div className="card-body">

              <h4 className="card-title mb-4">
                💰 Ingresos mensuales
              </h4>

              {ingresosMensuales.length ===
              0 ? (

                <div className="alert alert-warning">
                  No hay ingresos registrados.
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-striped table-bordered">

                    <thead className="table-dark">

                      <tr>
                        <th>Mes</th>
                        <th>
                          Cantidad de pagos
                        </th>
                        <th>
                          Total recaudado
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {ingresosMensuales.map(
                        (ingreso) => (

                          <tr key={ingreso.mes}>

                            <td>
                              {formatearMesLargo(
                                ingreso.mes
                              )}
                            </td>

                            <td>
                              {
                                ingreso.cantidadPagos
                              }
                            </td>

                            <td>
                              {formatearMoneda(
                                ingreso.total
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Reportes;
