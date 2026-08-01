// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Admin/Sidebar";
import NavbarDashboard from "../Admin/NavbarDashboard";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div className="min-h-screen lg:pl-64">
        <NavbarDashboard toggleSidebar={toggleSidebar} />
        <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
