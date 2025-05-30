import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // user will be an object like { profile: 'user' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("loginToken");
    const storedProfile = localStorage.getItem("profile");

    if (storedToken) setToken(storedToken);
    if (storedProfile) setUser({ profile: storedProfile }); // 👈 wrap profile into object

    setLoading(false);
  }, []);

  const login = (newToken, profile) => {
    localStorage.setItem("loginToken", newToken);
    localStorage.setItem("profile", profile); // 👈 just profile, if that's what you're storing
    setToken(newToken);
    setUser({ profile }); // 👈 set wrapped user
  };

  const logout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("profile");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
