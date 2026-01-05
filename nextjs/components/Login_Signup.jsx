"use client";
import Link from "next/link";
import Image from "next/image";
import webIcon from "../public/camera.png";
import { useState } from "react";

const Login_Signup = () => {
  const [activeLink, setActiveLink] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Image
                src={webIcon}
                width={42}
                height={42}
                alt="App Logo"
                className="relative rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-l font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shutter Sphere
              </span>
              <span className="text-xs text-gray-500">Capture & Share</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/feed_public"
              onMouseEnter={() => setActiveLink("feed")}
              onMouseLeave={() => setActiveLink("")}
              className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Public Feed</span>
              </span>
              {activeLink === "feed" && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500"></div>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200"></div>

            <Link
              href="/signin"
              onMouseEnter={() => setActiveLink("login")}
              onMouseLeave={() => setActiveLink("")}
              className="relative px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <div className="absolute inset-0 rounded-lg border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative">Login</span>
              {activeLink === "login" && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500"></div>
              )}
            </Link>

            <Link
              href="/signup"
              onMouseEnter={() => setActiveLink("signup")}
              onMouseLeave={() => setActiveLink("")}
              className="relative px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-200 group"
            >
              <div className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Sign Up</span>
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Login_Signup;