import { useState } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../Context/Auth/useAuth";

const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

const AdminProfile = () => {
  const { user } = useAuth();

  const username = user?.username || "";
  const email = user?.email || "";
  const rawName = user?.name?.trim() || "";

  // Falls back to username wherever we just need something to display —
  // the actual Name field is left blank below for the user to fill in.
  const displayName = rawName || username || "Admin";
  const hue = getHue(email || username);
  const initials = displayName.slice(0, 2).toUpperCase();

  const [form, setForm] = useState({
    fullName: rawName, // intentionally blank when the user has no name set yet
    username,
    email,
    phone: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    // TODO: wire to your update-profile endpoint
    await new Promise((r) => setTimeout(r, 600));
    setIsSavingProfile(false);
    setSavedMessage("Profile updated");
    setTimeout(() => setSavedMessage(null), 2500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || passwordForm.next !== passwordForm.confirm) return;
    setIsSavingPassword(true);
    // TODO: wire to your change-password endpoint
    await new Promise((r) => setTimeout(r, 600));
    setIsSavingPassword(false);
    setPasswordForm({ current: "", next: "", confirm: "" });
    setSavedMessage("Password updated");
    setTimeout(() => setSavedMessage(null), 2500);
  };

  const passwordMismatch =
    passwordForm.confirm.length > 0 && passwordForm.next !== passwordForm.confirm;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 md:px-8 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {savedMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl">
            <FaCheckCircle />
            {savedMessage}
          </div>
        )}

        {/* Header card */}
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
          <div className="h-28 bg-linear-to-r from-[#f2592b] to-[#f2592b]/70" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-white shrink-0"
                  style={{ backgroundColor: `hsl(${hue}, 65%, 45%)` }}
                >
                  {initials}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#f2592b] ring-1 ring-gray-100 transition-colors"
                  aria-label="Change photo"
                >
                  <FaCamera className="text-xs" />
                </button>
              </div>
              <div className="pb-1">
                <h1 className="text-lg font-bold text-gray-800">{form.fullName || username || "Admin"}</h1>
                <span className="inline-flex items-center text-xs font-medium text-[#f2592b] bg-orange-50 px-2.5 py-0.5 rounded-full mt-1">
                  Administrator
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <StatChip label="Products Added" value="128" />
              <StatChip label="Orders Processed" value="964" />
              <StatChip label="Member Since" value="2024" />
            </div>
          </div>
        </div>

        {/* Personal information */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 p-6 flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 text-gray-800">
            <FaUser className="text-[#f2592b]" />
            <h2 className="text-base font-semibold">Personal Information</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleFormChange}
                placeholder={username ? `e.g. ${username}` : "Enter your full name"}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Bio (optional)</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleFormChange}
              rows={3}
              placeholder="A short note about yourself..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="rounded-xl bg-[#f2592b] hover:bg-[#d94c22] text-white text-sm font-medium px-6 py-2.5 transition-colors disabled:opacity-60"
            >
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Security */}
        <form
          onSubmit={handleUpdatePassword}
          className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 p-6 flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 text-gray-800">
            <FaShieldAlt className="text-[#f2592b]" />
            <h2 className="text-base font-semibold">Security</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                name="current"
                type="password"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input
                name="next"
                type="password"
                value={passwordForm.next}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                name="confirm"
                type="password"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  passwordMismatch
                    ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400"
                    : "border-gray-200 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
                }`}
              />
              {passwordMismatch && (
                <span className="text-xs text-rose-500">Passwords do not match</span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isSavingPassword ||
                !passwordForm.current ||
                !passwordForm.next ||
                passwordForm.next !== passwordForm.confirm
              }
              className="rounded-xl bg-[#f2592b] hover:bg-[#d94c22] text-white text-sm font-medium px-6 py-2.5 transition-colors disabled:opacity-50"
            >
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatChip = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center">
    <p className="text-lg font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

export default AdminProfile;