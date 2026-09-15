import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
} from "../services/usuariosService";

function Configuracion() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Formulario crear / editar usuario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("instructor");

  const [guardando, setGuardando] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Cambio de contraseña
  const [usuarioPassword, setUsuarioPassword] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

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
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("instructor");
    setUsuarioEditando(null);
  };

  // ==========================================
  // CREAR / ACTUALIZAR USUARIO
  // ==========================================

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !rol) {
      alert("Completa los campos obligatorios");
      return;
    }

    if (!usuarioEditando && !password) {
      alert("La contraseña es obligatoria");
      return;
    }

    try {
      setGuardando(true);

      if (usuarioEditando) {
        const datosActualizados = {
          nombre,
          email,
          rol,
        };

        await actualizarUsuario(
          usuarioEditando.id,
          datosActualizados
        );

        alert("Usuario actualizado correctamente");
      } else {
        const nuevoUsuario = {
          nombre,
          email,
          password,
          rol,
        };

        await registrarUsuario(nuevoUsuario);

        alert("Usuario creado correctamente");
      }

      limpiarFormulario();
      await cargarUsuarios();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        "Error al guardar usuario";

      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);

    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setRol(usuario.rol);
    setPassword("");
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================

  const cancelarEdicion = () => {
    limpiarFormulario();
  };

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  const borrarUsuario = async (id, nombreUsuario) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar al usuario ${nombreUsuario}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarUsuario(id);

      alert("Usuario eliminado correctamente");

      await cargarUsuarios();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        "Error al eliminar usuario";

      alert(mensaje);
    }
  };

  // ==========================================
  // ABRIR CAMBIO DE CONTRASEÑA
  // ==========================================

  const abrirCambioPassword = (usuario) => {
    setUsuarioPassword(usuario);
    setNuevaPassword("");
  };

  // ==========================================
  // CANCELAR CAMBIO DE CONTRASEÑA
  // ==========================================

  const cancelarCambioPassword = () => {
    setUsuarioPassword(null);
    setNuevaPassword("");
  };

  // ==========================================
  // GUARDAR NUEVA CONTRASEÑA
  // ==========================================

  const guardarNuevaPassword = async (e) => {
    e.preventDefault();

    if (!nuevaPassword) {
      alert("Ingresa la nueva contraseña");
      return;
    }

    if (nuevaPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setCambiandoPassword(true);

      await cambiarPassword(
        usuarioPassword.id,
        nuevaPassword
      );

      alert("Contraseña actualizada correctamente");

      setUsuarioPassword(null);
      setNuevaPassword("");
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        "Error al cambiar la contraseña";

      alert(mensaje);
    } finally {
      setCambiandoPassword(false);
    }
  };

  return (
    <div className="container mt-4">

      {/* ====================================== */}
      {/* TÍTULO Y VOLVER AL MENÚ */}
      {/* ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Configuración</h2>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver al menú
        </button>
      </div>

      {/* ====================================== */}
      {/* FORMULARIO CREAR / EDITAR */}
      {/* ====================================== */}

      <div className="card mb-4">
        <div className="card-header">
          <strong>
            {usuarioEditando
              ? "Editar usuario"
              : "Nuevo usuario"}
          </strong>
        </div>

        <div className="card-body">
          <form onSubmit={guardarUsuario}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Nombre
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="usuario@gym.com"
                />
              </div>

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Contraseña
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder={
                    usuarioEditando
                      ? "Usa Cambiar contraseña"
                      : "Contraseña"
                  }
                  disabled={usuarioEditando !== null}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Rol
                </label>

                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) =>
                    setRol(e.target.value)
                  }
                >
                  <option value="instructor">
                    Instructor
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : usuarioEditando
                  ? "Actualizar usuario"
                  : "Crear usuario"}
            </button>

            {usuarioEditando && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
            )}

          </form>
        </div>
      </div>

      {/* ====================================== */}
      {/* CAMBIO DE CONTRASEÑA */}
      {/* ====================================== */}

      {usuarioPassword && (
        <div className="card mb-4">
          <div className="card-header">
            <strong>
              Cambiar contraseña de{" "}
              {usuarioPassword.nombre}
            </strong>
          </div>

          <div className="card-body">

            <form onSubmit={guardarNuevaPassword}>

              <div className="mb-3">
                <label className="form-label">
                  Nueva contraseña
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={nuevaPassword}
                  onChange={(e) =>
                    setNuevaPassword(e.target.value)
                  }
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={cambiandoPassword}
              >
                {cambiandoPassword
                  ? "Actualizando..."
                  : "Guardar contraseña"}
              </button>

              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={cancelarCambioPassword}
                disabled={cambiandoPassword}
              >
                Cancelar
              </button>

            </form>

          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* LISTADO */}
      {/* ====================================== */}

      <h4 className="mb-3">
        Usuarios registrados
      </h4>

      {cargando && (
        <p>Cargando usuarios...</p>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

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
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        editarUsuario(usuario)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-info btn-sm me-2"
                      onClick={() =>
                        abrirCambioPassword(usuario)
                      }
                    >
                      Cambiar contraseña
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        borrarUsuario(
                          usuario.id,
                          usuario.nombre
                        )
                      }
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
