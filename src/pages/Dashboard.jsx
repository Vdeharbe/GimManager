import StatCard from "../components/ui/StatCard";

function Dashboard() {
  return (
    <div className="container mt-4">
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
  );
}

export default Dashboard;
