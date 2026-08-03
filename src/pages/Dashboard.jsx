import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/ui/StatCard";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mt-4 flex-grow-1">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h2>Dashboard</h2>

        <div className="row">
          <div className="col-md-4">
            <StatCard titulo="Socios" valor="120" color="primary" />
          </div>

          <div className="col-md-4">
            <StatCard titulo="Profesores" valor="8" color="success" />
          </div>

          <div className="col-md-4">
            <StatCard titulo="Pagos" valor="95" color="warning" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
