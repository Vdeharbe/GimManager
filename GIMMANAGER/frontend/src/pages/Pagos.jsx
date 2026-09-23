import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerPagos,
  crearPago,
  actualizarPago,
  eliminarPago,
} from "../services/pagosService";

import { obtenerSocios } from "../services/sociosService";
import { useAuth } from "../context/AuthContext";

function Pagos() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // ==========================================
  // ESTADOS
  // ==========================================

  const [pagos, setPagos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [pagoAEditar, setPagoAEditar] = useState(null);

  const [formulario, setFormulario] = useState({
    socio_id: "",
    monto: "",
    fecha: "",
    metodo_pago: "Efectivo",
    concepto: "Cuota mensual",
    estado: "Pagado",
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CARGAR PAGOS
  // ==========================================

  const cargarPagos = async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerPagos();

      setPagos(datos);
    } catch (error) {
      console.error(
        "Error al cargar pagos:",
        error
      );

      setError(
        "No se pudieron cargar los pagos."
      );
    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR SOCIOS
  // ==========================================

  const cargarSocios = async () => {
    try {
      const datos = await obtenerSocios();

      setSocios(datos);
    } catch (error) {
      console.error(
        "Error al cargar socios:",
        error
      );

      setError(
        "No se pudieron cargar los socios."
      );
    }
  };

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
  // PREPARAR PAGO PARA EDITAR
  // ==========================================

  const handleEditar = (pago) => {
    setPagoAEditar(pago);

    setFormulario({
      socio_id: pago.socio_id,
      monto: pago.monto,
      fecha: pago.fecha
        ? pago.fecha.slice(0, 10)
        : "",
      metodo_pago: pago.metodo_pago,
      concepto: pago.concepto,
      estado: pago.estado,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================

  const handleCancelarEdicion = () => {
    setPagoAEditar(null);

    setFormulario({
      socio_id: "",
      monto: "",
      fecha: "",
      metodo_pago: "Efectivo",
      concepto: "Cuota mensual",
      estado: "Pagado",
    });
  };

  // ==========================================
  // GUARDAR / ACTUALIZAR PAGO
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formulario.socio_id ||
      !formulario.monto ||
      !formulario.fecha ||
      !formulario.metodo_pago ||
      !formulario.concepto
    ) {
      alert(
        "Completa todos los campos obligatorios."
      );

      return;
    }

    try {
      // EDITAR
      if (pagoAEditar) {
        await actualizarPago(
          pagoAEditar.id,
          formulario
        );

        alert(
          "Pago actualizado correctamente."
        );
      }

      // CREAR
      else {
        await crearPago(formulario);

        alert(
          "Pago registrado correctamente."
        );
      }

      // LIMPIAR FORMULARIO

      setFormulario({
        socio_id: "",
        monto: "",
        fecha: "",
        metodo_pago: "Efectivo",
        concepto: "Cuota mensual",
        estado: "Pagado",
      });

      setPagoAEditar(null);

      // ACTUALIZAR TABLA

      await cargarPagos();

    } catch (error) {
      console.error(
        "Error al guardar pago:",
        error
      );

      alert(
        error.response?.data?.mensaje ||
          "No se pudo guardar el pago."
      );
    }
  };

  // ==========================================
  // ELIMINAR PAGO
  // ==========================================

  const handleEliminar = async (pago) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el pago de ${pago.socio_nombre}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarPago(pago.id);

      alert(
        "Pago eliminado correctamente."
      );

      // Si estábamos editando el mismo pago
      // que acabamos de eliminar, limpiamos
      // también el formulario.

      if (pagoAEditar?.id === pago.id) {
        handleCancelarEdicion();
      }

      // Actualizar tabla
      await cargarPagos();

    } catch (error) {
      console.error(
        "Error al eliminar pago:",
        error
      );

      alert(
        error.response?.data?.mensaje ||
          "No se pudo eliminar el pago."
      );
    }
  };

  // ==========================================
  // CARGAR DATOS AL ENTRAR
  // ==========================================

  useEffect(() => {
    cargarPagos();
    cargarSocios();
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
        Pagos
      </h2>

      {/* ======================================
          FORMULARIO - SOLO ADMIN
      ====================================== */}

      {usuario?.rol === "admin" && (

        <div className="card mb-4">

          <div className="card-body">

            <h4 className="card-title mb-3">

              {pagoAEditar
                ? "Editar pago"
                : "Registrar pago"}

            </h4>

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* SOCIO */}

                <div className="col-md-6">

                  <label className="form-label">
                    Socio
                  </label>

                  <select
                    className="form-select"
                    name="socio_id"
                    value={formulario.socio_id}
                    onChange={handleChange}
                  >

                    <option value="">
                      Seleccionar socio
                    </option>

                    {socios.map((socio) => (

                      <option
                        key={socio.id}
                        value={socio.id}
                      >
                        {socio.nombre}
                      </option>

                    ))}

                  </select>

                </div>

                {/* MONTO */}

                <div className="col-md-6">

                  <label className="form-label">
                    Monto
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="monto"
                    value={formulario.monto}
                    onChange={handleChange}
                    placeholder="Ej: 30000"
                    min="0.01"
                    step="0.01"
                  />

                </div>

                {/* FECHA */}

                <div className="col-md-6">

                  <label className="form-label">
                    Fecha
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={handleChange}
                  />

                </div>

                {/* MÉTODO */}

                <div className="col-md-6">

                  <label className="form-label">
                    Método de pago
                  </label>

                  <select
                    className="form-select"
                    name="metodo_pago"
                    value={formulario.metodo_pago}
                    onChange={handleChange}
                  >

                    <option value="Efectivo">
                      Efectivo
                    </option>

                    <option value="Transferencia">
                      Transferencia
                    </option>

                    <option value="Tarjeta">
                      Tarjeta
                    </option>

                  </select>

                </div>

                {/* CONCEPTO */}

                <div className="col-md-6">

                  <label className="form-label">
                    Concepto
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="concepto"
                    value={formulario.concepto}
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
                    value={formulario.estado}
                    onChange={handleChange}
                  >

                    <option value="Pagado">
                      Pagado
                    </option>

                    <option value="Pendiente">
                      Pendiente
                    </option>

                  </select>

                </div>

              </div>

              {/* BOTONES */}

              <div className="mt-4 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  {pagoAEditar
                    ? "Actualizar pago"
                    : "Guardar pago"}

                </button>

                {pagoAEditar && (

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      handleCancelarEdicion
                    }
                  >
                    Cancelar
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ======================================
          MENSAJES
      ====================================== */}

      {cargando && (
        <div className="alert alert-info">
          Cargando pagos...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!cargando &&
        !error &&
        pagos.length === 0 && (

          <div className="alert alert-warning">
            No hay pagos registrados.
          </div>

        )}

      {/* ======================================
          TABLA
      ====================================== */}

      {!cargando &&
        !error &&
        pagos.length > 0 && (

          <div className="table-responsive">

            <table className="table table-striped table-bordered">

              <thead className="table-dark">

                <tr>

                  <th>ID</th>
                  <th>Socio</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Método</th>
                  <th>Concepto</th>
                  <th>Estado</th>

                  {usuario?.rol === "admin" && (
                    <th>Acciones</th>
                  )}

                </tr>

              </thead>

              <tbody>

                {pagos.map((pago) => (

                  <tr key={pago.id}>

                    <td>
                      {pago.id}
                    </td>

                    <td>
                      {pago.socio_nombre}
                    </td>

                    <td>

                      {Number(
                        pago.monto
                      ).toLocaleString(
                        "es-AR",
                        {
                          style: "currency",
                          currency: "ARS",
                        }
                      )}

                    </td>

                    <td>

                      {new Date(
                        pago.fecha
                      ).toLocaleDateString(
                        "es-AR",
                        {
                          timeZone: "UTC",
                        }
                      )}

                    </td>

                    <td>
                      {pago.metodo_pago}
                    </td>

                    <td>
                      {pago.concepto}
                    </td>

                    <td>
                      {pago.estado}
                    </td>

                    {/* ACCIONES SOLO ADMIN */}

                    {usuario?.rol === "admin" && (

                      <td>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              handleEditar(pago)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleEliminar(pago)
                            }
                          >
                            Eliminar
                          </button>

                        </div>

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

export default Pagos;