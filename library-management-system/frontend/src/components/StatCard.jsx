export default function StatCard({ icon, label, value }) {
  return (
    <div className="cards stat-card-wrap h-100">
      <div className="card" aria-hidden="true" />
      <div className="card card--glass stat-card h-100">
        <div className="card__content">
          <div className="icon-wrap">
            <i className={`bi ${icon}`} />
          </div>
          <h3 className="card__title">{value}</h3>
          <p className="card__url mb-0">{label}</p>
        </div>
      </div>
    </div>
  );
}
