"use client";
import Link from "next/link"
import Image from "next/image"
import webIcon from "../public/camera.png"
import { useState } from "react"
import { useRouter } from "next/navigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();
  const navItems = [
    { name: "Feeds", href: "/feeds", icon: "📰" },
    { name: "Contacts", href: "/contacts", icon: "📞" },
    { name: "About", href: "/about", icon: "ℹ️" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ]
  const Logout = ()=>{
    console.log("Clicked")
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('tokenChange'));
      setTimeout(() => {
        router.push("/signin");
        }, 100);
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <Image
                  src={webIcon}
                  width={40}
                  height={40}
                  alt="Logo"
                  className="relative rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col">
              <span className="text-l font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shutter Sphere
              </span>
              <span className="text-xs text-gray-500">Capture & Share</span>
            </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <span className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center space-x-2">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
            <button onClick={Logout} className="ml-4 rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200">
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <button onClick={Logout} className="w-full mt-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:shadow-md transition-all">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navigation