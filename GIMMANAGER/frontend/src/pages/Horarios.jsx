import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} from "../services/horariosService";

import { obtenerProfesores } from "../services/profesoresService";

import { useAuth } from "../context/AuthContext";

const Horarios = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const esAdmin = usuario?.rol === "admin";

  // ==========================================
  // ESTADOS
  // ==========================================

  const [horarios, setHorarios] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [horarioEditando, setHorarioEditando] =
    useState(null);

  const [formulario, setFormulario] = useState({
    profesor_id: "",
    actividad: "",
    dia_semana: "Lunes",
    hora_inicio: "",
    hora_fin: "",
    cupo_maximo: 20,
    estado: "Activo",
  });

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [datosHorarios, datosProfesores] =
        await Promise.all([
          obtenerHorarios(),
          obtenerProfesores(),
        ]);

      setHorarios(datosHorarios);
      setProfesores(datosProfesores);
    } catch (error) {
      console.error(
        "Error al cargar horarios:",
        error
      );

      setError(
        "No se pudieron cargar los horarios."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
      profesor_id: "",
      actividad: "",
      dia_semana: "Lunes",
      hora_inicio: "",
      hora_fin: "",
      cupo_maximo: 20,
      estado: "Activo",
    });

    setHorarioEditando(null);
  };

  // ==========================================
  // GUARDAR HORARIO
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formulario.profesor_id ||
      !formulario.actividad ||
      !formulario.dia_semana ||
      !formulario.hora_inicio ||
      !formulario.hora_fin
    ) {
      setError(
        "Profesor, actividad, día y horarios son obligatorios."
      );

      return;
    }

    if (
      formulario.hora_fin <=
      formulario.hora_inicio
    ) {
      setError(
        "La hora de fin debe ser posterior a la hora de inicio."
      );

      return;
    }

    const datosHorario = {
      ...formulario,

      profesor_id: Number(
        formulario.profesor_id
      ),

      cupo_maximo: Number(
        formulario.cupo_maximo
      ),
    };

    try {
      setError("");

      if (horarioEditando) {
        await actualizarHorario(
          horarioEditando.id,
          datosHorario
        );
      } else {
        await crearHorario(datosHorario);
      }

      limpiarFormulario();

      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al guardar horario:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo guardar el horario."
      );
    }
  };

  // ==========================================
  // EDITAR HORARIO
  // ==========================================

  const handleEditar = (horario) => {
    setHorarioEditando(horario);

    setFormulario({
      profesor_id:
        horario.profesor_id,

      actividad:
        horario.actividad || "",

      dia_semana:
        horario.dia_semana || "Lunes",

      hora_inicio:
        horario.hora_inicio
          ? horario.hora_inicio.substring(0, 5)
          : "",

      hora_fin:
        horario.hora_fin
          ? horario.hora_fin.substring(0, 5)
          : "",

      cupo_maximo:
        horario.cupo_maximo ?? 20,

      estado:
        horario.estado || "Activo",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ELIMINAR HORARIO
  // ==========================================

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este horario?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarHorario(id);

      await cargarDatos();
    } catch (error) {
      console.error(
        "Error al eliminar horario:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
          "No se pudo eliminar el horario."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="container py-4">

      {/* VOLVER */}

      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Volver al Dashboard
      </button>

      <h2 className="mb-4">
        Gestión de Horarios
      </h2>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* FORMULARIO */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="card-title mb-3">
            {horarioEditando
              ? "Editar horario"
              : "Nuevo horario"}
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* PROFESOR */}

              <div className="col-md-6">

                <label className="form-label">
                  Profesor
                </label>

                <select
                  className="form-select"
                  name="profesor_id"
                  value={
                    formulario.profesor_id
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccionar profesor
                  </option>

                  {profesores.map(
                    (profesor) => (
                      <option
                        key={profesor.id}
                        value={profesor.id}
                      >
                        {profesor.nombre}
                        {profesor.especialidad
                          ? ` - ${profesor.especialidad}`
                          : ""}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ACTIVIDAD */}

              <div className="col-md-6">

                <label className="form-label">
                  Actividad
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="actividad"
                  value={
                    formulario.actividad
                  }
                  onChange={handleChange}
                  placeholder="Ej: Funcional"
                  required
                />

              </div>

              {/* DÍA */}

              <div className="col-md-4">

                <label className="form-label">
                  Día
                </label>

                <select
                  className="form-select"
                  name="dia_semana"
                  value={
                    formulario.dia_semana
                  }
                  onChange={handleChange}
                >

                  <option value="Lunes">
                    Lunes
                  </option>

                  <option value="Martes">
                    Martes
                  </option>

                  <option value="Miércoles">
                    Miércoles
                  </option>

                  <option value="Jueves">
                    Jueves
                  </option>

                  <option value="Viernes">
                    Viernes
                  </option>

                  <option value="Sábado">
                    Sábado
                  </option>

                  <option value="Domingo">
                    Domingo
                  </option>

                </select>

              </div>

              {/* HORA INICIO */}

              <div className="col-md-4">

                <label className="form-label">
                  Hora de inicio
                </label>

                <input
                  type="time"
                  className="form-control"
                  name="hora_inicio"
                  value={
                    formulario.hora_inicio
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* HORA FIN */}

              <div className="col-md-4">

                <label className="form-label">
                  Hora de fin
                </label>

                <input
                  type="time"
                  className="form-control"
                  name="hora_fin"
                  value={
                    formulario.hora_fin
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* CUPO */}

              <div className="col-md-6">

                <label className="form-label">
                  Cupo máximo
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="cupo_maximo"
                  value={
                    formulario.cupo_maximo
                  }
                  onChange={handleChange}
                />

              </div>

              {/* ESTADO */}

              <div className="col-md-6">

                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  name="estado"
                  value={
                    formulario.estado
                  }
                  onChange={handleChange}
                >

                  <option value="Activo">
                    Activo
                  </option>

                  <option value="Inactivo">
                    Inactivo
                  </option>

                </select>

              </div>

              {/* BOTONES */}

              <div className="col-12">

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  {horarioEditando
                    ? "Guardar cambios"
                    : "Crear horario"}
                </button>

                {horarioEditando && (
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

      {/* LISTADO */}

      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="card-title mb-3">
            Horarios registrados
          </h5>

          {cargando ? (

            <p>
              Cargando horarios...
            </p>

          ) : horarios.length === 0 ? (

            <div className="alert alert-info">
              No hay horarios registrados.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Actividad</th>
                    <th>Profesor</th>
                    <th>Horario</th>
                    <th>Cupo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {horarios.map((horario) => (

                    <tr key={horario.id}>

                      <td>
                        {horario.dia_semana}
                      </td>

                      <td>
                        <strong>
                          {horario.actividad}
                        </strong>
                      </td>

                      <td>
                        {
                          horario.profesor_nombre
                        }
                      </td>

                      <td>
                        {horario.hora_inicio
                          ? horario.hora_inicio.substring(
                              0,
                              5
                            )
                          : "-"}
                        {" - "}
                        {horario.hora_fin
                          ? horario.hora_fin.substring(
                              0,
                              5
                            )
                          : "-"}
                      </td>

                      <td>
                        {horario.cupo_maximo}
                      </td>

                      <td>
                        {horario.estado}
                      </td>

                      <td>

                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleEditar(
                              horario
                            )
                          }
                        >
                          Editar
                        </button>

                        {esAdmin && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleEliminar(
                                horario.id
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

      </div>

    </div>
  );
};

export default Horarios;