import { useEffect, useState } from "react";

import {
  obtenerEjerciciosPorRutina,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
} from "../../services/rutinaEjerciciosService";

import { useAuth } from "../../context/AuthContext";

function GestionEjercicios({ rutina }) {
  const { usuario } = useAuth();

  const esAdmin = usuario?.rol === "admin";

  // ==========================================
  // ESTADOS
  // ==========================================

  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [ejercicioEditando, setEjercicioEditando] =
    useState(null);

  const [formulario, setFormulario] = useState({
    ejercicio: "",
    series: "",
    repeticiones: "",
    peso: "",
    descanso_segundos: "",
    observaciones: "",
    orden: 1,
  });

  // ==========================================
  // CARGAR EJERCICIOS
  // ==========================================

  const cargarEjercicios = async () => {
    try {
      setCargando(true);
      setError("");

      const datos =
        await obtenerEjerciciosPorRutina(
          rutina.id
        );

      setEjercicios(datos);
    } catch (error) {
      console.error(
        "Error al cargar ejercicios:",
        error
      );

      setError(
        "No se pudieron cargar los ejercicios."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (rutina?.id) {
      cargarEjercicios();
    }
  }, [rutina?.id]);

  // ==========================================
  // CAMBIOS DEL FORMULARIO
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setFormulario({
      ejercicio: "",
      series: "",
      repeticiones: "",
      peso: "",
      descanso_segundos: "",
      observaciones: "",
      orden: 1,
    });

    setEjercicioEditando(null);
  };

  // ==========================================
  // GUARDAR EJERCICIO
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formulario.ejercicio ||
      !formulario.series ||
      !formulario.repeticiones
    ) {
      setError(
        "Ejercicio, series y repeticiones son obligatorios."
      );

      return;
    }

    const datosEjercicio = {
      rutina_id: rutina.id,

      ejercicio: formulario.ejercicio,

      series: Number(formulario.series),

      repeticiones:
        formulario.repeticiones,

      peso: formulario.peso
        ? Number(formulario.peso)
        : null,

      descanso_segundos:
        formulario.descanso_segundos
          ? Number(
              formulario.descanso_segundos
            )
          : null,

      observaciones:
        formulario.observaciones,

      orden: formulario.orden
        ? Number(formulario.orden)
        : 1,
    };

    try {
      setError("");

      if (ejercicioEditando) {
        await actualizarEjercicio(
          ejercicioEditando.id,
          datosEjercicio
        );
      } else {
        await crearEjercicio(
          datosEjercicio
        );
      }

      limpiarFormulario();
      await cargarEjercicios();
    } catch (error) {
      console.error(
        "Error al guardar ejercicio:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo guardar el ejercicio."
      );
    }
  };

  // ==========================================
  // EDITAR
  // ==========================================

  const handleEditar = (ejercicio) => {
    setEjercicioEditando(ejercicio);

    setFormulario({
      ejercicio:
        ejercicio.ejercicio || "",

      series:
        ejercicio.series || "",

      repeticiones:
        ejercicio.repeticiones || "",

      peso:
        ejercicio.peso ?? "",

      descanso_segundos:
        ejercicio.descanso_segundos ?? "",

      observaciones:
        ejercicio.observaciones || "",

      orden:
        ejercicio.orden || 1,
    });
  };

  // ==========================================
  // ELIMINAR
  // ==========================================

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este ejercicio?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarEjercicio(id);

      await cargarEjercicios();
    } catch (error) {
      console.error(
        "Error al eliminar ejercicio:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo eliminar el ejercicio."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mt-4">
      <h4>
        Ejercicios — {rutina.nombre}
      </h4>

      <p className="text-muted">
        Socio: {rutina.socio_nombre}
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* FORMULARIO */}

      <div className="card mb-4">
        <div className="card-body">
          <h5>
            {ejercicioEditando
              ? "Editar ejercicio"
              : "Agregar ejercicio"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">
                  Ejercicio
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="ejercicio"
                  value={formulario.ejercicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Series
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="series"
                  value={formulario.series}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Repeticiones
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="repeticiones"
                  value={formulario.repeticiones}
                  onChange={handleChange}
                  placeholder="8-10"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Orden
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="orden"
                  value={formulario.orden}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Peso (kg)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  name="peso"
                  value={formulario.peso}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Descanso (seg.)
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="descanso_segundos"
                  value={
                    formulario.descanso_segundos
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Observaciones
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="observaciones"
                  value={
                    formulario.observaciones
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  {ejercicioEditando
                    ? "Guardar cambios"
                    : "Agregar ejercicio"}
                </button>

                {ejercicioEditando && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      limpiarFormulario
                    }
                  >
                    Cancelar
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* TABLA */}

      {cargando ? (
        <p>Cargando ejercicios...</p>
      ) : ejercicios.length === 0 ? (
        <div className="alert alert-info">
          Esta rutina todavía no tiene
          ejercicios.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Ejercicio</th>
                <th>Series</th>
                <th>Repeticiones</th>
                <th>Peso</th>
                <th>Descanso</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ejercicios.map((ejercicio) => (
                <tr key={ejercicio.id}>
                  <td>
                    {ejercicio.orden}
                  </td>

                  <td>
                    <strong>
                      {ejercicio.ejercicio}
                    </strong>
                  </td>

                  <td>
                    {ejercicio.series}
                  </td>

                  <td>
                    {ejercicio.repeticiones}
                  </td>

                  <td>
                    {ejercicio.peso
                      ? `${ejercicio.peso} kg`
                      : "-"}
                  </td>

                  <td>
                    {ejercicio.descanso_segundos
                      ? `${ejercicio.descanso_segundos} seg.`
                      : "-"}
                  </td>

                  <td>
                    {ejercicio.observaciones ||
                      "-"}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        handleEditar(ejercicio)
                      }
                    >
                      Editar
                    </button>

                    {esAdmin && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleEliminar(
                            ejercicio.id
                          )
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionEjercicios;