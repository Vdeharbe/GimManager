import { useNavigate } from "react-router-dom";

function Configuracion() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h2>Configuración</h2>
    </div>
  );
}

export default Configuracion;