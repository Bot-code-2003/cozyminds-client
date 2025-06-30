"use client";

import { useState } from "react";
import {
  Sun,
  Moon,
  User,
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  BookOpen,
  Info,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";

const Navbar = ({ isScrolled, user, openLoginModal, openSignupModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const navigationItems = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Blog", path: "/starlitblogs", icon: <BookOpen size={16} /> },
    { name: "About", path: "/aboutus", icon: <Info size={16} /> },
    {
      name: "Public Journals",
      path: "/public-journals",
      icon: <BookOpen size={16} />,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="w-full bg-white dark:bg-[#1A1A1A] border-b border-gray-200/20 dark:border-gray-700/20 py-3 px-4 md:px-6 fixed top-0 left-0 z-[999] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center group cursor-pointer"
        >
          <div className=" h-8 rounded-2xl mr-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-in-out text-2xl">
            <span role="img" aria-label="Starlit Journals" style={{fontSize: '1.7rem', lineHeight: 1}}>🌠</span>
          </div>
          <div className="text-xl font-bold tracking-light flex items-baseline">
  <span className="text-[var(--accent)]">Starlit</span>
  <span className="text-gray-800 dark:text-white ml-1 opacity-80">Journals</span>
</div>
        </button>

        {/* Desktop Navigation & Actions */}
        <div className="hidden custom-md:flex items-center gap-x-4 lg:gap-x-6">
          {/* Navigation */}
          <div className="flex items-center gap-x-1 lg:gap-x-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#5999a8] transition-colors group"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-[#5999a8]" />
              ) : (
                <Moon size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-[#5999a8]" />
              )}
            </button>

            {user ? (
              <button
                onClick={() => handleNavigation("/profile")}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#468b97] transition-colors font-medium text-sm shadow-sm"
              >
                <User size={16} />
                <span>{user.nickname || "Profile"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button
                  onClick={openSignupModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-lg hover:bg-[#468b97] transition-colors font-medium shadow-sm"
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="custom-md:hidden">
          <button
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="custom-md:hidden fixed inset-0 top-[60px] z-[998] bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-700">
          <div className="w-full h-full px-4 sm:px-6 py-4 overflow-y-auto">
            {/* Mobile Navigation */}
            <div className="space-y-2 mb-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {user ? (
                /* Mobile User Profile */
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-[#5999a8] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
                >
                  <User size={18} />
                  {user.nickname || "Profile"}
                </button>
              ) : (
                /* Mobile Auth Buttons */
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openLoginModal();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openSignupModal();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-[#5999a8] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
                  >
                    <UserPlus size={18} />
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Public Journals Link Mobile */}
            <div className="mt-4">
              <Link
                to="/public-journals"
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-gray-600 dark:text-gray-300 hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
              >
                <BookOpen size={18} />
                Public Journals
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;