import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1>404</h1>
      <p>Página no encontrada</p>
    </div>
  );
}

export default NotFound;