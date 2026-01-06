"use client";
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Login_Signup from "@/components/Login_Signup";

const ConditionalHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkToken();

    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log("Storage event detected for token");
        checkToken();
      }
    };

    const handleTokenChange = () => {
      console.log("Custom tokenChange event detected");
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenChange', handleTokenChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChange', handleTokenChange);
    };
  }, [checkToken]);


  if (loading) {
    return (
      <header className="h-16 bg-linear-to-r from-gray-100 to-gray-200 animate-pulse"></header>
    );
  }

  return !loggedIn ? <Login_Signup /> : <Navigation />;
};

export default ConditionalHeader;