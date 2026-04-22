export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="mobile-overlay d-flex align-items-center justify-content-center" onClick={onClose}>
      <div className="modal-content p-4" style={{ maxWidth: '520px', width: '92%' }} onClick={(event) => event.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h5 mb-0">{title}</h3>
          <button className="btn btn-icon-soft" onClick={onClose} aria-label="Close modal">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
