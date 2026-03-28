import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import GalleryManager from "./pages/GalleryManager";
import AdminManager from "./pages/AdminManager";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Upload />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <GalleryManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admins"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
