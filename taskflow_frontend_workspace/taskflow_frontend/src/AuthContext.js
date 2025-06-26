import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// PUBLIC_INTERFACE
/**
 * AuthContext provides authentication state and auth methods for the whole application.
 * Manages JWT token, login/logout, and user info. Ensures state persistence via localStorage.
 */
const AuthContext = createContext();

/**
 * Returns the AuthContext instance for usage in components.
 * @returns {object} { user, token, login, logout, isAuthenticated, setUser }
 */
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(token ? true : false);

  // PUBLIC_INTERFACE
  const login = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem("access_token", newToken);
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  }, []);

  // Effect: If token changes and is non-null, attempt to fetch user profile
  // (Optional: can be extended–No user endpoint provided, so just set dummy user for now)
  useEffect(() => {
    if (token) {
      // Optionally fetch and set user info here with the token
      // For now, treat as authenticated if token exists.
      setUser({ username: "user" }); // Placeholder: adapt when backend gives /me
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
