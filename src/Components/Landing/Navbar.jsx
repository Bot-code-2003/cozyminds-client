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
  };

  return (
    <nav className="w-full bg-[var(--bg-navbar)] backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-[999] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#5999a8] to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Star size={16} className="text-white" />
          </div>
          <div className="text-xl font-bold tracking-tight">
            <span className="text-[#5999a8]">Starlit</span>{" "}
            <span className="dark:text-[#F8F1E9] text-[#1A1A1A]">Journals</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#5999a8] dark:hover:border-[#5999a8] transition-all duration-200 group"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun
                size={18}
                className="text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
              />
            ) : (
              <Moon
                size={18}
                className="text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
              />
            )}
          </button>

          {user ? (
            /* User Profile */
            <button
              onClick={() => handleNavigation("/profile")}
              className="flex items-center gap-2 px-4 py-2 bg-[#5999a8] text-white rounded-lg hover:bg-[#5999a8]/90 transition-all duration-200 font-medium"
            >
              <User size={16} />
              {user.nickname || "Profile"}
            </button>
          ) : (
            /* Auth Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] font-medium transition-all duration-200"
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="flex items-center gap-2 px-4 py-2 bg-[#5999a8] text-white rounded-lg hover:bg-[#5999a8]/90 transition-all duration-200 font-medium"
              >
                <UserPlus size={16} />
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg z-[1000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Mobile Navigation */}
            <div className="space-y-2 mb-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
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
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {user ? (
                /* Mobile User Profile */
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-[#5999a8] text-white rounded-lg font-medium"
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
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openSignupModal();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-[#5999a8] text-white rounded-lg font-medium"
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
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:text-[#5999a8] dark:hover:text-[#5999a8] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
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
