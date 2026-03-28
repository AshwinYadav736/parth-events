
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ isOpen, closeSidebar }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <h2>Admin Panel</h2>
        <p>{admin?.name}</p>
      </div>

      <nav>
        <NavLink to="/" end onClick={closeSidebar}>
          Dashboard
        </NavLink>

        <NavLink to="/upload" onClick={closeSidebar}>
          Upload
        </NavLink>

        <NavLink to="/gallery" onClick={closeSidebar}>
          Gallery
        </NavLink>

        {admin?.role === "superadmin" && (
          <NavLink to="/admins" onClick={closeSidebar}>
            Admins
          </NavLink>
        )}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}