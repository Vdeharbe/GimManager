
import { useNavigate } from "react-router-dom";
function Reportes() {
 const navigate = useNavigate();
   
  return (
    <div className="container mt-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h2>📊 Reportes</h2>
      <p>Próximamente...</p>
    </div>
  );
}

export default Reportes;