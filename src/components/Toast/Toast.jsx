import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "success", onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${type === "error" ? "toast--error" : ""}`}>
        <div className="toast__message">{message}</div>
        <button className="toast__close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="toast__progress" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
}

export default Toast;
