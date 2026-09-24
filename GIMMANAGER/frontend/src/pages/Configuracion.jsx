import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
} from "../services/usuariosService";

import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from "../services/configuracionService";

function Configuracion() {
  const navigate = useNavigate();
  const { usuario: usuarioAutenticado } = useAuth();

  // ==========================================
  // USUARIOS
  // ==========================================

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
  // CONFIGURACIÓN DEL GIMNASIO
  // ==========================================

  const [configuracion, setConfiguracion] = useState({
    id: null,
    nombre_gimnasio: "",
    direccion: "",
    telefono: "",
    email: "",
    horario_apertura: "",
    horario_cierre: "",
  });

  const [cargandoConfiguracion, setCargandoConfiguracion] = useState(true);

  const [guardandoConfiguracion, setGuardandoConfiguracion] = useState(false);

  const [errorConfiguracion, setErrorConfiguracion] = useState("");

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

  // ==========================================
  // CARGAR CONFIGURACIÓN
  // ==========================================

  const cargarConfiguracion = async () => {
    try {
      setCargandoConfiguracion(true);
      setErrorConfiguracion("");

      const datos = await obtenerConfiguracion();

      setConfiguracion({
        id: datos.id,
        nombre_gimnasio: datos.nombre_gimnasio || "",
        direccion: datos.direccion || "",
        telefono: datos.telefono || "",
        email: datos.email || "",

        // MySQL puede devolver 08:00:00.
        // Para input type="time" usamos 08:00.
        horario_apertura: datos.horario_apertura
          ? datos.horario_apertura.slice(0, 5)
          : "",

        horario_cierre: datos.horario_cierre
          ? datos.horario_cierre.slice(0, 5)
          : "",
      });
    } catch (error) {
      console.error(error);

      setErrorConfiguracion("No se pudo cargar la configuración del gimnasio");
    } finally {
      setCargandoConfiguracion(false);
    }
  };

  // ==========================================
  // CARGAR DATOS AL ENTRAR
  // ==========================================

  useEffect(() => {
    cargarUsuarios();
    cargarConfiguracion();
  }, []);

  // ==========================================
  // CAMBIOS EN CONFIGURACIÓN
  // ==========================================

  const handleConfiguracionChange = (e) => {
    const { name, value } = e.target;

    setConfiguracion((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // ==========================================
  // GUARDAR CONFIGURACIÓN
  // ==========================================

  const guardarConfiguracion = async (e) => {
    e.preventDefault();

    if (!configuracion.nombre_gimnasio.trim()) {
      alert("El nombre del gimnasio es obligatorio");
      return;
    }

    try {
      setGuardandoConfiguracion(true);
      setErrorConfiguracion("");

      const datos = {
        nombre_gimnasio: configuracion.nombre_gimnasio,
        direccion: configuracion.direccion,
        telefono: configuracion.telefono,
        email: configuracion.email,
        horario_apertura: configuracion.horario_apertura || null,
        horario_cierre: configuracion.horario_cierre || null,
      };

      await actualizarConfiguracion(configuracion.id, datos);

      alert("Configuración actualizada correctamente");

      // Volvemos a consultar MySQL
      await cargarConfiguracion();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar la configuración";

      alert(mensaje);
    } finally {
      setGuardandoConfiguracion(false);
    }
  };

  // ==========================================
  // LIMPIAR FORMULARIO USUARIO
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

        await actualizarUsuario(usuarioEditando.id, datosActualizados);

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
        error.response?.data?.mensaje || "Error al guardar usuario";

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
      `¿Seguro que deseas eliminar al usuario ${nombreUsuario}?`,
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
        error.response?.data?.mensaje || "Error al eliminar usuario";

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

      await cambiarPassword(usuarioPassword.id, nuevaPassword);

      alert("Contraseña actualizada correctamente");

      setUsuarioPassword(null);
      setNuevaPassword("");
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al cambiar la contraseña";

      alert(mensaje);
    } finally {
      setCambiandoPassword(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* ======================================
          TÍTULO Y VOLVER AL MENÚ
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">⚙️ Configuración</h2>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver al menú
        </button>
      </div>

      {/* ======================================
          DATOS DEL GIMNASIO
      ====================================== */}

      <div className="card shadow-sm mb-5">
        <div className="card-header">
          <strong>🏋️ Datos del gimnasio</strong>
        </div>

        <div className="card-body">
          {cargandoConfiguracion ? (
            <p>Cargando configuración...</p>
          ) : errorConfiguracion ? (
            <div className="alert alert-danger">{errorConfiguracion}</div>
          ) : (
            <form onSubmit={guardarConfiguracion}>
              <div className="row">
                {/* NOMBRE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre del gimnasio</label>

                  <input
                    type="text"
                    name="nombre_gimnasio"
                    className="form-control"
                    value={configuracion.nombre_gimnasio}
                    onChange={handleConfiguracionChange}
                    placeholder="Nombre del gimnasio"
                    required
                  />
                </div>

                {/* DIRECCIÓN */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Dirección</label>

                  <input
                    type="text"
                    name="direccion"
                    className="form-control"
                    value={configuracion.direccion}
                    onChange={handleConfiguracionChange}
                    placeholder="Dirección"
                  />
                </div>
              </div>

              <div className="row">
                {/* TELÉFONO */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono</label>

                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    value={configuracion.telefono}
                    onChange={handleConfiguracionChange}
                    placeholder="Teléfono"
                  />
                </div>

                {/* EMAIL */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={configuracion.email}
                    onChange={handleConfiguracionChange}
                    placeholder="contacto@gimnasio.com"
                  />
                </div>
              </div>

              <div className="row">
                {/* APERTURA */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Horario de apertura</label>

                  <input
                    type="time"
                    name="horario_apertura"
                    className="form-control"
                    value={configuracion.horario_apertura}
                    onChange={handleConfiguracionChange}
                  />
                </div>

                {/* CIERRE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Horario de cierre</label>

                  <input
                    type="time"
                    name="horario_cierre"
                    className="form-control"
                    value={configuracion.horario_cierre}
                    onChange={handleConfiguracionChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success"
                disabled={guardandoConfiguracion}
              >
                {guardandoConfiguracion
                  ? "Guardando..."
                  : "Guardar configuración"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ======================================
          ADMINISTRACIÓN DE USUARIOS
      ====================================== */}

      <h3 className="mb-3">👤 Administración de usuarios</h3>

      {/* ======================================
          FORMULARIO CREAR / EDITAR
      ====================================== */}

      <div className="card mb-4">
        <div className="card-header">
          <strong>
            {usuarioEditando ? "Editar usuario" : "Nuevo usuario"}
          </strong>
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
                  placeholder={
                    usuarioEditando ? "Usa Cambiar contraseña" : "Contraseña"
                  }
                  disabled={usuarioEditando !== null}
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

      {/* ======================================
          CAMBIO DE CONTRASEÑA
      ====================================== */}

      {usuarioPassword && (
        <div className="card mb-4">
          <div className="card-header">
            <strong>Cambiar contraseña de {usuarioPassword.nombre}</strong>
          </div>

          <div className="card-body">
            <form onSubmit={guardarNuevaPassword}>
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>

                <input
                  type="password"
                  className="form-control"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={cambiandoPassword}
              >
                {cambiandoPassword ? "Actualizando..." : "Guardar contraseña"}
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

      {/* ======================================
          LISTADO DE USUARIOS
      ====================================== */}

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
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editarUsuario(usuario)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-info btn-sm me-2"
                      onClick={() => abrirCambioPassword(usuario)}
                    >
                      Cambiar contraseña
                    </button>

                    {usuario.id !== usuarioAutenticado.id && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          borrarUsuario(usuario.id, usuario.nombre)
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

export default Configuracion;
