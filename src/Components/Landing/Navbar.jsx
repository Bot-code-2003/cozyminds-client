"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Settings,
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { logout } from "../../utils/anonymousName";

const getAvatarSvg = (style, seed) => {
  const svg = createAvatar(avataaars, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (item.expiry && now.getTime() > item.expiry) {
      localStorage.removeItem('user');
      return null;
    }
    return item.value || item;
  } catch {
    return null;
  }
};

const Navbar = ({ isScrolled, user, openLoginModal, openSignupModal }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const navigationItems = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Blog", path: "/starlitblogs", icon: <BookOpen size={16} /> },
    { name: "About", path: "/aboutus", icon: <Info size={16} /> },
    { name: "Journals", path: "/journals", icon: <BookOpen size={16} /> },
    { name: "Stories", path: "/stories", icon: <Sparkles size={16} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const currentUser = getCurrentUser();

  return (
    <nav className="relative w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-900/10 dark:border-white/10 py-3 px-8 flex justify-between items-center fixed top-0 left-0 z-[999]">
      <button
        onClick={() => handleNavigation("/")}
        className="flex items-center group cursor-pointer"
        aria-label="Go to homepage"
      >
        <div className="h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out shadow-md text-2xl">
          <span role="img" aria-label="Starlit Journals" style={{ fontSize: '1.7rem', lineHeight: 1 }}>🌠</span>
        </div>
        <div className="text-xl font-semibold tracking-tight flex items-baseline">
          <span className="text-[var(--accent)]">Starlit</span>
          <span className="text-gray-800 dark:text-white ml-1 opacity-80">Journals</span>
        </div>
      </button>

      <div className="hidden lg:flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? (
              <Sun size={16} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon size={16} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
          {currentUser ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={getAvatarSvg(currentUser.profileTheme?.avatarStyle || 'avataaars', currentUser.anonymousName || currentUser.nickname || currentUser.email)}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-900 dark:text-white font-medium text-sm mr-1">
                  {currentUser.nickname || currentUser.anonymousName || currentUser.email || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-900/10 dark:border-white/10 py-1 z-10">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={14} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigation("/profile-settings")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings size={14} className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={openLoginModal}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <LogIn size={16} className="mr-2" />
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <UserPlus size={16} className="mr-2" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors mobile-menu-button"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed inset-0 bg-black/40 z-[1000]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-gray-900 p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigation("/profile-settings")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  >
                    <Settings size={18} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSignupModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] font-medium"
                  >
                    <UserPlus size={18} />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;