import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("loginToken");
    if (storedToken) setToken(storedToken);
    setLoading(false); // 👈 done loading
  }, []);

  const login = (newToken) => {
    localStorage.setItem("loginToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("loginToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
