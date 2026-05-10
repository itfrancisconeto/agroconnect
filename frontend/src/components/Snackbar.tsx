import { X } from "lucide-react";

type SnackbarProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export function Snackbar({ message, type, onClose }: SnackbarProps) {
  return (
    <div className={`snackbar snackbar-${type}`} role="alert">
      <span>{message}</span>

      <button
        className="snackbar-close"
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        title="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
}