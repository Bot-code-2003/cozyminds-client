"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  Bell,
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
  const { darkMode, setDarkMode } = useDarkMode();
  const { coins } = useCoins();
  const { mails, setMails, user: userData, hasUnreadMails } = useMails();

  const isRootPath = location.pathname === "/";
  const isJournalingAlt = location.pathname === "/journaling-alt";

  const userId = userData?._id;

  // Fetch subscription notifications
  const fetchSubscriptionNotifications = useCallback(async () => {
    if (!userData?._id) return;
    
    try {
      const response = await API.get(`/subscriptions/${userData._id}`);
      const subscriptions = response.data.subscriptions || [];
      const hasNotifications = subscriptions.some(sub => sub.hasNewContent);
      setHasSubscriptionNotifications(hasNotifications);
    } catch (error) {
      console.error("Error fetching subscription notifications:", error);
    }
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchSubscriptionNotifications();
    }
  }, [userData, fetchSubscriptionNotifications]);

  if (location.pathname === "/" && link === "/") return null;

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
  };

  const currentLoc = location.pathname.split("/")[1];

  return (
    <>
      <nav className="w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-900/10 dark:border-white/10 py-3 px-8 flex justify-between items-center sticky top-0 z-[999]">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center group cursor-pointer"
        >
          <div className="w-8 h-8 bg-[#5999a8] rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 ease-out">
            <Star size={16} className="text-white" />
          </div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-[#5999a8]">STARLIT</span>
            <span className="text-gray-900 dark:text-white ml-1">JOURNALS</span>
          </div>
        </button>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                handleNavigation("/public-journals");
                window.scrollTo(0, 0);
              }}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-md font-medium text-gray-700 dark:text-gray-300 relative"
            >
              <BookOpen size={16} className="mr-2" />
              Public Journals
              {hasSubscriptionNotifications && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </button>

            <button
              onClick={() => handleNavigation("/cozyshop")}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              <ShoppingBag size={16} className="mr-2" />
              Shop
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Mail Button */}
            <button
              onClick={() => setMailModalOpen(!mailModalOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 relative"
              aria-label="Mail"
            >
              <Mail size={18} className="text-gray-600 dark:text-gray-400" />
              {hasUnreadMails && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={18} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={18} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Coins Display */}
          <div className="flex items-center px-3 py-2 bg-gray-900/5 dark:bg-white/10 rounded-lg">
            <Coins size={16} className="text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="font-medium text-gray-900 dark:text-white text-md">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* New Entry Button */}
          {!isJournalingAlt && (
            <button
              onClick={() => handleNavigation(link)}
              className="flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium text-md"
            >
              <Plus size={16} className="mr-2" />
              {name}
            </button>
          )}

          {/* User Dropdown */}
          {userData && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200"
              >
                <User size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium text-md mr-1">
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
                <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-900/10 dark:border-white/10 py-2 z-[1000]">
                  <button
                    onClick={() => {
                      handleNavigation("/profile-settings");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-left text-gray-900 dark:text-white hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-md"
                  >
                    <Settings size={16} className="mr-3" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation("/subscriptions");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-left text-gray-900 dark:text-white hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-md relative"
                  >
                    <Users size={16} className="mr-3" />
                    Subscriptions
                    {hasSubscriptionNotifications && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation("/saved-entries");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-left text-gray-900 dark:text-white hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200 text-md"
                  >
                    <Bookmark size={16} className="mr-3" />
                    Saved
                  </button>
                  <div className="h-px bg-gray-900/10 dark:bg-white/10 mx-2 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-md"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2.5 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 transition-all duration-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X size={20} className="text-gray-900 dark:text-white" />
          ) : (
            <Menu size={20} className="text-gray-900 dark:text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl z-[1000]">
          <div className="p-6 space-y-6">
            {/* Coins Display Mobile */}
            <div className="flex items-center justify-center px-4 py-3 bg-gray-900/5 dark:bg-white/10 rounded-xl">
              <Coins
                size={18}
                className="text-yellow-600 dark:text-yellow-400 mr-2"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {coins.toLocaleString()} Coins
              </span>
            </div>

            {/* Mobile Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleNavigation("/public-journals")}
                className="flex flex-col items-center px-4 py-6 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200 relative"
              >
                <BookOpen size={24} className="mb-2 text-gray-900 dark:text-white" />
                <span className="text-md font-medium text-gray-900 dark:text-white">Public Journals</span>
                {hasSubscriptionNotifications && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>

              <button
                onClick={() => handleNavigation("/cozyshop")}
                className="flex flex-col items-center px-4 py-6 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200"
              >
                <ShoppingBag size={24} className="mb-2 text-gray-900 dark:text-white" />
                <span className="text-md font-medium text-gray-900 dark:text-white">Shop</span>
              </button>

              <button
                onClick={() => {
                  setMailModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center px-4 py-6 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200 relative"
              >
                <Mail size={24} className="mb-2 text-gray-900 dark:text-white" />
                <span className="text-md font-medium text-gray-900 dark:text-white">Mail</span>
                {hasUnreadMails && (
                  <span className="absolute top-4 right-8 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className="flex flex-col items-center px-4 py-6 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200"
              >
                {darkMode ? (
                  <Sun size={24} className="mb-2 text-gray-900 dark:text-white" />
                ) : (
                  <Moon size={24} className="mb-2 text-gray-900 dark:text-white" />
                )}
                <span className="text-md font-medium text-gray-900 dark:text-white">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>

            {/* New Entry Button Mobile */}
            {!isJournalingAlt && (
              <button
                onClick={() => handleNavigation(link)}
                className="flex items-center justify-center w-full px-4 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium"
              >
                <Plus size={18} className="mr-2" />
                {name}
              </button>
            )}

            {/* User Actions Mobile */}
            {userData && (
              <div className="border-t border-gray-900/10 dark:border-white/10 pt-6 space-y-4">
                <div className="text-center text-gray-900 dark:text-white font-medium">
                  Welcome, {userData.nickname || "User"}!
                </div>
                <button
                  onClick={() => handleNavigation("/profile-settings")}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200"
                >
                  <Settings size={18} className="mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Profile Settings</span>
                </button>
                <button
                  onClick={() => handleNavigation("/subscriptions")}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200 relative"
                >
                  <Users size={18} className="mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Subscriptions</span>
                  {hasSubscriptionNotifications && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => handleNavigation("/saved-entries")}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-900/5 dark:bg-white/10 rounded-xl hover:bg-gray-900/10 dark:hover:bg-white/20 transition-all duration-200"
                >
                  <Bookmark size={18} className="mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Saved</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mail Modal */}
      {mailModalOpen && (
        <InGameMail toggleMailModal={() => setMailModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;