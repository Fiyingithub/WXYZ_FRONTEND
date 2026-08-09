import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./auth-context";
import type { UserData, AuthContextType } from "./auth-types";
import { AUTH_LOGOUT_EVENT } from "../../services/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // console.log(user)

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<Partial<any>>(token);
        // console.log("Decoded JWT on mount:", decoded);

        //For NORMAL LOGIN (Microsoft claims)
        const userData = {
          id: decoded?.id || "",
          email: decoded?.email || "",
          role: decoded?.role || "",
          username: decoded?.username || "",
          name: decoded?.name || ""
        };

        // restore both user types
        setUser(userData);

        setIsAuthenticated(true);
      } catch (error) {
        // console.error("Error decoding token:", error);
        localStorage.removeItem("userToken");

      }
    }

  }, []);

  // Listens for api.ts's interceptor announcing that a token refresh
  // failed (session expired / revoked server-side). Without this,
  // isAuthenticated stays true in React state even after localStorage
  // has already been cleared, since this component otherwise only
  // reads localStorage once, on mount.
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  // Define the login, cbtLogin, and logout functions

  //NORMAL LOGIN
 const login = (token: string, refreshToken?: string) => {
  if (!token) {
    console.error("No access token received");
    return;
  }

  // Store tokens
  localStorage.setItem("userToken", token);

  if (refreshToken) {
    localStorage.setItem("userRefreshToken", refreshToken);
  }

  try {
    const decoded = jwtDecode<Partial<any>>(token);

    const userData = {
      id: decoded?.id || "",
      email: decoded?.email || "",
      role: decoded?.role || "",
      username: decoded?.username || "",
      name: decoded?.name || "",
    };

    setUser(userData);
    setIsAuthenticated(true);

    // console.log("Token saved:",localStorage.getItem("userToken"));

  } catch (error) {
    console.error("Invalid token:", error);

    localStorage.removeItem("userToken");
    localStorage.removeItem("userRefreshToken");

    setUser(null);
    setIsAuthenticated(false);
  }
};


 const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userRefreshToken");

  setUser(null);
  setIsAuthenticated(false);
};

  // UpdateUser
  const updateUser = (updated: UserData) => {
    setUser(updated);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}