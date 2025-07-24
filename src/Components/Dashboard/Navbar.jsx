"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginModal from "../Landing/LoginModal";
import SignupModal from "../Landing/SignupModal";
import axios from "axios";
import {
  Plus,
  ChevronDown,
  Mail,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  BookOpen,
  Users,
  Bookmark,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import InGameMail from "./Mail/InGameMail";
import { useMails } from "../../context/MailContext";
import { logout } from "../../utils/anonymousName";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
} from "@dicebear/collection";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const avatarStyles = {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem("user");
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem("user");
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
};

const Navbar = ({ name = "New Entry", link = "/journaling-alt" }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLoginModal = () => {
    setShowSignup(false);
    setShowLogin(true);
  };
  const openSignupModal = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [hasSubscriptionNotifications, setHasSubscriptionNotifications] =
    useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const currentUser = getCurrentUser();

  const navigationItems = [];

  return (
    <>
      <nav className="relative w-full bg-white/70 backdrop-blur-xl border-b border-gray-900/10 py-3 px-8 flex justify-between items-center fixed top-0 left-0 z-[999]">
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center group cursor-pointer"
          aria-label="Go to homepage"
        >
          <div className="text-2xl font-bold tracking-tight flex items-baseline">
            <span className="text-[var(--accent)] newsreader">Starlit</span>
            <span className="text-gray-800 ml-1 newsreader opacity-80">
              Journals
            </span>
          </div>
        </button>

        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 transition-all duration-200 text-sm font-medium text-gray-700 relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                {item.name === "Journals" && hasSubscriptionNotifications && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={() => setMailModalOpen(!mailModalOpen)}
                className="p-2 rounded-lg hover:bg-gray-900/5 transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Open mail"
              >
                <Mail size={16} className="text-gray-600" />
                {hasUnreadMails && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>
            )}

            {!currentUser && (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-gray-700 hover:text-black transition-colors text-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignupModal}
                  className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                  Get started
                </button>
              </>
            )}
          </div>
          {currentUser && !isJournalingAlt && (
            <button
              onClick={() => handleNavigation(link)}
              className="flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <Plus size={16} className="mr-2" />
              {name}
            </button>
          )}
          {currentUser && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-900/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={getAvatarSvg(
                    currentUser.profileTheme?.avatarStyle || "avataaars",
                    currentUser.anonymousName ||
                      currentUser.nickname ||
                      currentUser.email
                  )}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-900 font-medium text-sm mr-1">
                  {currentUser.nickname ||
                    currentUser.anonymousName ||
                    currentUser.email ||
                    "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-900/10 py-1 z-10">
                  <button
                    onClick={() => handleNavigation("/saved-entries")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Bookmark size={14} className="mr-2" />
                    Saved
                  </button>
                  <button
                    onClick={() => handleNavigation("/subscriptions")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users size={14} className="mr-2" />
                    Subscriptions
                  </button>
                  <button
                    onClick={() => handleNavigation("/profile-settings")}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={14} className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
            className="p-2 rounded-lg hover:bg-gray-900/5 transition-colors mobile-menu-button"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-700" />
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
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-900/5"
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>

            <div className="">
              {currentUser && (
                <button
                  onClick={() => handleNavigation("/profile-settings")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <Settings size={18} />
                  Settings
                </button>
              )}
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>

            {!currentUser && (
              <div className="pt-4 space-y-2">
                <button
                  onClick={openLoginModal}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignupModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Get started
                </button>
              </div>
            )}

            {currentUser && !isJournalingAlt && (
              <div className="pt-4 border-t border-gray-200">
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

      {mailModalOpen && (
        <InGameMail closeModal={() => setMailModalOpen(false)} />
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitchToSignup={openSignupModal}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
      />
    </>
  );
};

export default Navbar;
