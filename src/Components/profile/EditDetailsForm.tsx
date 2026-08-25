import { useState } from "react";
import type { UserData } from "../../Context/Auth/auth-types";
import type { UpdateProfileInput } from "../../services/Users/profileType";
import { authService } from "../../services/Admin/authService";
import { FaSpinner } from "react-icons/fa";



interface EditDetailsFormProps {
  user: UserData;
  onSaved: (updated: UserData) => void;
}

type Phase = "idle" | "saving" | "refetching";

export const EditDetailsForm: React.FC<EditDetailsFormProps> = ({ user, onSaved }) => {
  console.log("USER IN FORM", user);
  const [form, setForm] = useState<UpdateProfileInput>({
    username: user.username ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isBusy = phase !== "idle";

  const handleChange = (field: keyof UpdateProfileInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setPhase("saving");
      // STUB: request/response shape not confirmed yet — will 404 until
      // userProfileService.updateProfile is wired to the real endpoint.
      await authService.update(user?.id, form);

      setPhase("refetching");
      const freshUser = await authService.getById(user.id);

      onSaved(freshUser);
      setSuccess(true);
    } catch (err) {
      setError("Could not save changes. Please try again.");
    } finally {
      setPhase("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset disabled={isBusy} className="space-y-5 disabled:opacity-60">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Not set"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile updated successfully.</p>}

      <button
        type="submit"
        disabled={isBusy}
        className="flex items-center gap-2 bg-[#f2592b] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isBusy && <FaSpinner className="animate-spin text-xs" />}
        {phase === "saving"
          ? "Saving..."
          : phase === "refetching"
            ? "Refreshing..."
            : "Save Changes"}
      </button>
    </form>
  );
};