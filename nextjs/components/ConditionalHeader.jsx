"use client";
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Login_Signup from "@/components/Login_Signup";

const ConditionalHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkToken = useCallback(async () => {
  const token = localStorage.getItem("token");
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!token) {
    setLoggedIn(false);
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`${BaseUrl}/validate_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (res.ok && data?.valid) {
      setLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      setLoggedIn(false);
    }
  } catch (err) {
    console.log(err);
    setLoggedIn(false);
  } finally {
    setLoading(false);
  }
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