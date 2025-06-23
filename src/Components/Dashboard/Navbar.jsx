"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Mail,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  Star,
  BookOpen,
  Users,
  Bookmark,
} from "lucide-react";
import InGameMail from "./Mail/InGameMail";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext.jsx";
import { useMails } from "../../context/MailContext";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Navbar = ({ name = "New Entry", link = "/journaling-alt" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [hasSubscriptionNotifications, setHasSubscriptionNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { darkMode, setDarkMode } = useDarkMode();
  const { coins } = useCoins();
  const { user: userData, hasUnreadMails } = useMails();

  const isRootPath = location.pathname === "/";
  const isJournalingAlt = location.pathname === "/journaling-alt";

  const userId = userData?._id;

  const fetchSubscriptionNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await API.get(`/subscriptions/${userId}`);
      const subscriptions = response.data.subscriptions || [];
      const hasNotifications = subscriptions.some((sub) => sub.hasNewContent);
      setHasSubscriptionNotifications(hasNotifications);
    } catch (error) {
      console.error("Error fetching subscription notifications:", error);
    }
  }, [userId]);

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
    if (userId) {
      fetchSubscriptionNotifications();
    }
  }, [userId, fetchSubscriptionNotifications]);

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

  if (isRootPath && link === "/") return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-900/10 dark:border-white/10 py-3 px-8 flex justify-between items-center sticky top-0 z-[999]">
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center group cursor-pointer"
          aria-label="Go to homepage"
        >
          <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 ease-out">
            <Star size={16} className="text-white" />
          </div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-[var(--accent)]">STARLIT</span>
            <span className="text-gray-900 dark:text-white ml-1">JOURNALS</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleNavigation("/public-journals")}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <BookOpen size={16} className="mr-2" />
              Public Journals
              {hasSubscriptionNotifications && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("/cozyshop")}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <ShoppingBag size={16} className="mr-2" />
              Shop
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMailModalOpen(!mailModalOpen)}
              className="p-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Open mail"
            >
              <Mail size={16} className="text-gray-600 dark:text-gray-400" />
              {hasUnreadMails && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
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
          </div>
          <div className="flex items-center px-3 py-2 bg-gray-900/5 dark:bg-white/10 rounded-lg">
            <Coins size={16} className="text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {coins.toLocaleString()}
            </span>
          </div>
          {!isJournalingAlt && (
            <button
              onClick={() => handleNavigation(link)}
              className="flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <Plus size={16} className="mr-2" />
              {name}
            </button>
          )}
          {userData && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                <User size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium text-sm mr-1">
                  {userData.nickname || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-900/10 dark:border-white/10 py-1 z-10">
                  <button
                    onClick={() => handleNavigation("/saved-entries")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Bookmark size={14} className="mr-2" />
                    Saved
                  </button>
                  <button
                    onClick={() => handleNavigation("/subscriptions")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Users size={14} className="mr-2" />
                    Subscriptions
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
          )}
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors mobile-menu-button"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </nav>

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
              <button
                onClick={() => handleNavigation("/public-journals")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <BookOpen size={18} />
                Public Journals
              </button>
              <button
                onClick={() => handleNavigation("/cozyshop")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <ShoppingBag size={18} />
                Shop
              </button>
              <button
                onClick={() => handleNavigation("/saved-entries")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <Bookmark size={18} />
                Saved
              </button>
              <button
                onClick={() => handleNavigation("/subscriptions")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <Users size={18} />
                Subscriptions
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <button
                onClick={() => handleNavigation("/profile-settings")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <Settings size={18} />
                Settings
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {!isJournalingAlt && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleNavigation(link)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium"
                >
                  <Plus size={18} />
                  {name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mailModalOpen && <InGameMail closeModal={() => setMailModalOpen(false)} />}
    </>
  );
};

export default Navbar;