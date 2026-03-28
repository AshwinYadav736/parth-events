import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminManager.css";

export default function AdminManager() {
  const { token, admin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://parth-events.onrender.com/api/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch admins");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateAdmin = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(
        "https://parth-events.onrender.com/api/admin/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      if (!res.ok) {
        alert("Failed to create admin");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("admin");

      fetchAdmins();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (id === admin.id) {
      alert("You cannot delete yourself.");
      return;
    }

    if (!window.confirm("Delete this admin?")) return;

    try {
      const res = await fetch(
        `https://parth-events.onrender.com/api/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>Admin Manager</h1>
        <p>Manage admin accounts and permissions</p>
      </div>

      {admin?.role === "superadmin" && (
        <div className="create-admin-card">
          <h3>Create New Admin</h3>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>

          <button onClick={handleCreateAdmin}>
            Create Admin
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-table">
          {admins.map((a) => (
            <div key={a._id} className="admin-row">
              <div>
                <h4>{a.name}</h4>
                <p>{a.email}</p>
              </div>

              <div className="admin-actions">
                <span
                  className={
                    a.role === "superadmin"
                      ? "role-badge super"
                      : "role-badge normal"
                  }
                >
                  {a.role}
                </span>

                {admin?.role === "superadmin" &&
                  a._id !== admin.id && (
                    <button
                      className="delete-admin-btn"
                      onClick={() => handleDelete(a._id)}
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
