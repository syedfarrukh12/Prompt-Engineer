import { useEffect, useState } from "react";
import "../styles/Notification.css";

const Notification = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return visible ? (
    <div className={`notification ${type} ${visible ? "show" : ""}`}>
      <div className="notification-content">{message}</div>
    </div>
  ) : null;
};

export default Notification;
