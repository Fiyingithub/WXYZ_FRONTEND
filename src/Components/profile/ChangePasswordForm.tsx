import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { userProfileService } from "../../services/Users/profile/userProfileService";

const PasswordField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
        </button>
      </div>
    </div>
  );
};

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // await userProfileService.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Could not change password. Check your current password and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <PasswordField
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
      />
      <PasswordField
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
      />
      <PasswordField
        label="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      {newPassword.length > 0 && newPassword.length < 8 && (
        <p className="text-xs text-amber-600">Password must be at least 8 characters.</p>
      )}
      {confirmPassword.length > 0 && newPassword !== confirmPassword && (
        <p className="text-xs text-red-500">Passwords do not match.</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Password changed successfully.</p>}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="bg-[#f2592b] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};