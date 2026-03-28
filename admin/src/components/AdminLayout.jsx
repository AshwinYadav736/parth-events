
import { useState } from "react";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="admin-content">
        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        {children}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}