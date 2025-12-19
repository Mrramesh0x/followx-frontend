"use client";

import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");
    if (savedToken) setToken(savedToken);
    setIsLoading(false);
  }, []);


  const login = (jwtToken) => {
    localStorage.setItem("jwt", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    const response = axios.get("https://followx-backend.onrender.com/api/auth/logout",{
      withCredentials:true
    })
   localStorage.removeItem("jwt")
window.location.href = "/";

    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
