import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerProfesores,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
} from "../services/profesoresService";

import { useAuth } from "../context/AuthContext";

function Profesores() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Profesor que estamos editando
  const [profesorAEditar, setProfesorAEditar] = useState(null);

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    especialidad: "",
    estado: "Activo",
  });

  // ==========================================
  // CARGAR PROFESORES
  // ==========================================

  const cargarProfesores = async () => {
    try {
      setError("");

      const datos = await obtenerProfesores();

      setProfesores(datos);
    } catch (error) {
      console.error("Error al cargar profesores:", error);

      setError("No se pudieron cargar los profesores.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  // ==========================================
  // MANEJAR CAMBIOS DEL FORMULARIO
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  // ==========================================
  // CREAR PROFESOR
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (profesorAEditar) {
        // ACTUALIZAR
        await actualizarProfesor(profesorAEditar.id, formulario);
      } else {
        // CREAR
        await crearProfesor(formulario);
      }

      // Limpiar formulario
      setFormulario({
        nombre: "",
        email: "",
        telefono: "",
        especialidad: "",
        estado: "Activo",
      });

      // Salir del modo edición
      setProfesorAEditar(null);

      // Actualizar tabla
      await cargarProfesores();
    } catch (error) {
      console.error("Error al guardar profesor:", error);

      setError(
        profesorAEditar
          ? "No se pudo actualizar el profesor."
          : "No se pudo crear el profesor.",
      );
    }
  };
  // ==========================================
  // SELECCIONAR PROFESOR PARA EDITAR
  // ==========================================

  const handleEditar = (profesor) => {
    setProfesorAEditar(profesor);

    setFormulario({
      nombre: profesor.nombre,
      email: profesor.email,
      telefono: profesor.telefono || "",
      especialidad: profesor.especialidad,
      estado: profesor.estado,
    });
  };
  // ==========================================
  // ELIMINAR PROFESOR
  // ==========================================

  const handleEliminar = async (profesor) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${profesor.nombre}?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarProfesor(profesor.id);

      // Si justo estábamos editando al profesor eliminado,
      // limpiamos también el formulario.
      if (profesorAEditar?.id === profesor.id) {
        setProfesorAEditar(null);

        setFormulario({
          nombre: "",
          email: "",
          telefono: "",
          especialidad: "",
          estado: "Activo",
        });
      }

      await cargarProfesores();
    } catch (error) {
      console.error("Error al eliminar profesor:", error);

      setError("No se pudo eliminar el profesor.");
    }
  };

  return (
    <div className="container mt-4">
      {/* BOTÓN VOLVER */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <h2 className="mb-4">Profesores</h2>

      {/* ======================================
          FORMULARIO SOLO PARA ADMIN
          ====================================== */}

      {usuario?.rol === "admin" && (
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title mb-3">
              {profesorAEditar ? "Editar profesor" : "Agregar profesor"}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* NOMBRE */}
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>

                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formulario.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* TELÉFONO */}
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>

                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                  />
                </div>

                {/* ESPECIALIDAD */}
                <div className="col-md-6">
                  <label className="form-label">Especialidad</label>

                  <input
                    type="text"
                    className="form-control"
                    name="especialidad"
                    value={formulario.especialidad}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ESTADO */}
                <div className="col-md-6">
                  <label className="form-label">Estado</label>

                  <select
                    className="form-select"
                    name="estado"
                    value={formulario.estado}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>

                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* BOTÓN */}
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    {profesorAEditar ? "Guardar cambios" : "Agregar profesor"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================
          MENSAJES
          ====================================== */}

      {cargando && (
        <div className="alert alert-info">Cargando profesores...</div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!cargando && !error && profesores.length === 0 && (
        <div className="alert alert-warning">
          No hay profesores registrados.
        </div>
      )}

      {/* ======================================
          TABLA DE PROFESORES
          ====================================== */}

      {!cargando && profesores.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Estado</th>

                {/* SOLO ADMIN */}
                {usuario?.rol === "admin" && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {profesores.map((profesor) => (
                <tr key={profesor.id}>
                  <td>{profesor.id}</td>

                  <td>{profesor.nombre}</td>

                  <td>{profesor.email}</td>

                  <td>{profesor.telefono || "-"}</td>

                  <td>{profesor.especialidad}</td>

                  <td>{profesor.estado}</td>

                  {/* BOTÓN EDITAR/ELIMINAR SOLO PARA ADMIN */}
                  {usuario?.rol === "admin" && (
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditar(profesor)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(profesor)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Profesores;
