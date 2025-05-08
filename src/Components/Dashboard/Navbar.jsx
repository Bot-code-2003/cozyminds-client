"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  ArrowLeft,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import InGameMail from "./Mail/InGameMail";
import axios from "axios";

// Configure API
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Navbar = ({ name = "New Entry", link = "/journaling-alt" }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { coins, isInitialized } = useCoins();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [hasUnreadMails, setHasUnreadMails] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  const isRootPath = location.pathname === "/";
  const isJournalingAlt = location.pathname === "/journaling-alt";

  // Load user data once
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    setUserData(user);
  }, []);

  const userId = userData?._id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch mails
  useEffect(() => {
    if (!userId) {
      setMails([]);
      setHasUnreadMails(false);
      return;
    }

    const fetchMails = async () => {
      try {
        const response = await API.get(`/mails/${userId}`);
        const fetchedMails = response.data.mails;
        setMails(fetchedMails);
        setHasUnreadMails(fetchedMails.some((mail) => !mail.read));
      } catch (err) {
        console.error("Error fetching mails:", err);
        setMails([]);
        setHasUnreadMails(false);
      }
    };

    fetchMails();
  }, [userId]);

  if (location.pathname === "/" && link === "/") return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="w-full bg-[var(--bg-navbar)] border-b border-[var(--border)] py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-lg font-bold tracking-wider text-[var(--text-primary)]">
            COZY<span className="text-[var(--accent)]">MINDS</span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Coins display */}
          {isInitialized && (
            <div className="flex items-center py-1">
              <span className="text-yellow-300 mr-1">🪙</span>
              <span className="text-[var(--text-primary)]">{coins}</span>
            </div>
          )}

          {/* Shop button */}
          <Link
            to="/cozyshop"
            className="p-2 hover:text-[var(--accent)] transition-colors"
            aria-label="Shop"
          >
            <ShoppingBag size={18} />
          </Link>

          {/* Mail button */}
          <button
            onClick={() => setMailModalOpen(!mailModalOpen)}
            className="p-2 hover:text-[var(--accent)] transition-colors relative"
            aria-label="Mail"
          >
            <Mail size={18} />
            {hasUnreadMails && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--highlight)]"></span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[var(--accent)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Navigation buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* New Entry button */}
            {!isJournalingAlt && (
              <Link
                to={link}
                className="flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Plus size={18} className="mr-2" />
                {name}
              </Link>
            )}

            {/* Dashboard button */}
            {/* {!isRootPath && (
              <Link
                to="/"
                className="flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                Dashboard
              </Link>
            )} */}
          </div>

          {/* User dropdown */}
          {userData && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hidden md:flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{userData.nickname || "User"}</span>
                <ChevronDown size={16} className="ml-2" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 shadow-md z-30 bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <Link
                    to="/profile-settings"
                    className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mail Modal */}
      {mailModalOpen && (
        <InGameMail
          toggleMailModal={() => setMailModalOpen(false)}
          mails={mails}
          setMails={setMails}
          setHasUnreadMails={setHasUnreadMails}
          userId={userId}
        />
      )}
    </>
  );
};

export default Navbar;
