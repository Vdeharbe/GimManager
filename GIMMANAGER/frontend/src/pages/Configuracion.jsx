import { useEffect, useState } from "react";

import {
  obtenerUsuarios,
  registrarUsuario,
  eliminarUsuario,
} from "../services/usuariosService";

function Configuracion() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("instructor");

  const [guardando, setGuardando] = useState(false);

  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerUsuarios();

      setUsuarios(datos);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // ==========================================
  // REGISTRAR USUARIO
  // ==========================================

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !rol) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setGuardando(true);

      const nuevoUsuario = {
        nombre,
        email,
        password,
        rol,
      };

      await registrarUsuario(nuevoUsuario);

      alert("Usuario creado correctamente");

      // Limpiar formulario
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("instructor");

      // Volver a cargar tabla
      cargarUsuarios();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Error al crear usuario";

      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };
  const borrarUsuario = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar al usuario ${nombre}?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarUsuario(id);

      alert("Usuario eliminado correctamente");

      cargarUsuarios();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al eliminar usuario";

      alert(mensaje);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Configuración</h2>

      {/* ====================================== */}
      {/* FORMULARIO */}
      {/* ====================================== */}

      <div className="card mb-4">
        <div className="card-header">
          <strong>Nuevo usuario</strong>
        </div>

        <div className="card-body">
          <form onSubmit={guardarUsuario}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>

                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>

                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@gym.com"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Contraseña</label>

                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Rol</label>

                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="instructor">Instructor</option>

                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Crear usuario"}
            </button>
          </form>
        </div>
      </div>

      {/* ====================================== */}
      {/* LISTADO */}
      {/* ====================================== */}

      <h4 className="mb-3">Usuarios registrados</h4>

      {cargando && <p>Cargando usuarios...</p>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!cargando && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>

                  <td>{usuario.nombre}</td>

                  <td>{usuario.email}</td>

                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => borrarUsuario(usuario.id, usuario.nombre)}
                    >
                      Eliminar
                    </button>
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

export default Configuracion;
