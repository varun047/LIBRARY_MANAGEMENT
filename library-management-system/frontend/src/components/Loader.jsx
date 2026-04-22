export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="empty-state-card d-flex flex-column align-items-center gap-2">
      <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
