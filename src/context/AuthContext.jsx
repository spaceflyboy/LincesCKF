import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiLogin, apiRegister, setToken, removeToken, getToken } from "../utils/api";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "lincesckf_user";

function loadUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Login via backend API
  const login = async (email, password) => {
    try {
      setAuthError("");
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Register via backend API
  const register = async (name, email, password, accountType) => {
    try {
      setAuthError("");
      const data = await apiRegister(name, email, password, accountType);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  // Logout — clear token and user state
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // Check if user is authenticated (has valid token)
  const isAuthenticated = () => {
    return !!getToken() && !!user;
  };

  const updateUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        showAuthModal,
        setShowAuthModal,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
