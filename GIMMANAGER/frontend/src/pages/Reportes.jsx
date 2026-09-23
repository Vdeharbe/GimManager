import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerResumen,
  obtenerIngresosPorMes,
} from "../services/reportesService";

function Reportes() {
  const navigate = useNavigate();

  // ==========================================
  // ESTADOS
  // ==========================================

  const [resumen, setResumen] = useState({
    socios: 0,
    sociosActivos: 0,
    profesores: 0,
    totalPagos: 0,
    totalCobrado: 0,
  });

  const [ingresosMensuales, setIngresosMensuales] =
    useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CARGAR REPORTES
  // ==========================================

  const cargarReportes = async () => {
    try {
      setCargando(true);
      setError("");

      const datosResumen = await obtenerResumen();

      const datosIngresos =
        await obtenerIngresosPorMes();

      setResumen(datosResumen);
      setIngresosMensuales(datosIngresos);

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

      {/* BOTÓN VOLVER */}

      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <h2 className="mb-4">
        📊 Reportes
      </h2>

      {/* CARGANDO */}

      {cargando && (
        <div className="alert alert-info">
          Cargando reportes...
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          {/* ==================================
              TARJETAS
          ================================== */}

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

            {/* PAGOS */}

            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    💳 Pagos
                  </h5>

                  <h2>
                    {resumen.totalPagos}
                  </h2>

                  <p className="text-muted mb-0">
                    Pagos registrados
                  </p>

                </div>

              </div>
            </div>

            {/* TOTAL COBRADO */}

            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    💰 Total cobrado
                  </h5>

                  <h2>
                    {Number(
                      resumen.totalCobrado
                    ).toLocaleString(
                      "es-AR",
                      {
                        style: "currency",
                        currency: "ARS",
                      }
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
              INGRESOS MENSUALES
          ================================== */}

          <div className="card shadow-sm mt-5 mb-4">

            <div className="card-body">

              <h4 className="card-title mb-4">
                💰 Ingresos mensuales
              </h4>

              {ingresosMensuales.length === 0 ? (

                <div className="alert alert-warning">
                  No hay ingresos registrados.
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-striped table-bordered">

                    <thead className="table-dark">

                      <tr>
                        <th>Mes</th>
                        <th>Cantidad de pagos</th>
                        <th>Total recaudado</th>
                      </tr>

                    </thead>

                    <tbody>

                      {ingresosMensuales.map(
                        (ingreso) => (

                          <tr key={ingreso.mes}>

                            <td>
                              {ingreso.mes}
                            </td>

                            <td>
                              {ingreso.cantidadPagos}
                            </td>

                            <td>
                              {Number(
                                ingreso.total
                              ).toLocaleString(
                                "es-AR",
                                {
                                  style:
                                    "currency",
                                  currency: "ARS",
                                }
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