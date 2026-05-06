function StatsCard({ label, value }) {
  return (
    <div className="card stats-card">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatsCard;
