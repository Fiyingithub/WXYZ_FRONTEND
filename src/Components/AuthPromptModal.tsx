import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  message = "You need to sign in to do that.",
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    // Passing `from` so /login can redirect back here after sign-in —
    // only useful if your login page actually reads location.state.from.
    // If it doesn't yet, this is a no-op and just goes to /login.
    navigate("/login", { state: { from: window.location.pathname } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[#f2592b]/10 flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-[#f2592b] text-lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign in required
        </h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignIn}
            className="flex-1 bg-[#f2592b] text-white py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};