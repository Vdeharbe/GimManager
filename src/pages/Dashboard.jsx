function Dashboard() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "16px", margin: "20px 0" }}>
        <div
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            background: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "24px" }}>👥</div>
          <h2>Socios</h2>
          <p style={{ fontSize: "32px", margin: 0 }}>120</p>
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            background: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "24px" }}>🏋️</div>
          <h2>Profesores</h2>
          <p style={{ fontSize: "32px", margin: 0 }}>8</p>
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            background: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "24px" }}>💳</div>
          <h2>Pagos del mes</h2>
          <p style={{ fontSize: "32px", margin: 0 }}>95</p>
        </div>
      </div>

      <p>Bienvenida al sistema.</p>
    </main>
  );
}

export default Dashboard;
