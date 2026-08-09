import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEdit, FaLock, FaCrown, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../Context/Auth/useAuth";
import { ProfileAvatar } from "../Components/profile/ProfileAvatar";
import { EditDetailsForm } from "../Components/profile/EditDetailsForm";
import { ChangePasswordForm } from "../Components/profile/ChangePasswordForm";


type Tab = "overview" | "edit" | "password";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!user) return null;

  const isAdmin = user.role?.toLowerCase() === "admin";
  const displayName = user.name || user.username;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <FaUser className="text-sm" /> },
    { id: "edit", label: "Edit Details", icon: <FaEdit className="text-sm" /> },
    { id: "password", label: "Change Password", icon: <FaLock className="text-sm" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6 text-sm"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Identity card — the one signature element on this page */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="h-20 sm:h-24 bg-linear-to-r from-[#f2592b] to-[#e0742c]" />
          <div className="px-5 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
              <div className="flex items-end gap-4">
                <ProfileAvatar seed={displayName} size="lg" />
                <div className="pb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {displayName}
                  </h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                    <FaCrown className="text-[10px]" /> Admin
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                  <FaCalendarAlt className="text-[10px]" />
                  @{user.username}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 sm:px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-[#f2592b] border-[#f2592b]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Username
                  </p>
                  <p className="text-sm text-gray-900">{user.username}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-sm text-gray-900">{user.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <p className="text-sm text-gray-900 capitalize">
                    {user.role?.toLowerCase() || "Customer"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "edit" && (
              <EditDetailsForm
                user={user}
                onSaved={(freshUser) => {
                        // AuthContext's `login` only accepts a JWT to decode — since we
                        // now have the real refetched user object instead of a token,
                        // this needs a dedicated setter on AuthContext (e.g. `updateUser`)
                        // rather than reusing `login`. Flagging rather than guessing —
                        // see note below.
                        updateUser(freshUser);
                  }}
              />
            )}

            {activeTab === "password" && <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;