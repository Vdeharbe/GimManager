function Dashboard() {
  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5>👥 Socios</h5>

              <h2>120</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5>🏋️ Profesores</h5>

              <h2>8</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5>💳 Pagos</h5>

              <h2>95</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
