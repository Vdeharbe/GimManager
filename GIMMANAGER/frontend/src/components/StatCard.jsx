function StatCard({ titulo, valor, color }) {
  return (
    <div className={`card border-${color} shadow`}>
      <div className="card-body">
        <h6>{titulo}</h6>
        <h2>{valor}</h2>
      </div>
    </div>
  );
}

export default StatCard;