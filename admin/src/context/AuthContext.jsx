import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("token");

    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    }
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("token", token);
    setAdmin(adminData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    setAdmin(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
