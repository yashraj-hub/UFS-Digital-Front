function ConfirmDialog({ open, title, message, confirmLabel = "Delete", cancelLabel = "Cancel", onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="admin-confirm-overlay">
      <section className="admin-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="admin-confirm-dialog__header">
          <h3 id="confirm-dialog-title">{title}</h3>
        </div>
        <div className="admin-confirm-dialog__body">
          <p>{message}</p>
        </div>
        <div className="admin-confirm-dialog__footer">
          <button type="button" className="admin-secondary-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="admin-primary-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
