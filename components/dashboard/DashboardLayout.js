"use client";
import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar.js";
import DashboardHeader from "./DashboardHeader.js";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState("User");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const data = parsedUser || "User";
        setUser(data);

        // Page ka <title> update karo
        document.title = `My Profile - ${data?.name}`;
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  return (
    <>
      <DashboardHeader
        setSidebarOpen={setSidebarOpen}
        user={user} 
      />

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
