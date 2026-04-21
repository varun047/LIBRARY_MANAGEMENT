export default function StatCard({ icon, label, value }) {
  return (
    <div className="card-elevated stat-card h-100">
      <div className="icon-wrap">
        <i className={`bi ${icon}`} />
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
