"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, User, LogOut } from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";

const Navbar = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("user") || "null");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="bg-[var(--bg-navbar)] border-b border-[var(--border)] py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-[var(--text-primary)]">
            Cozy Journal
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/collections"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Collections
          </Link>
          <Link to="/shop" className="text-[var(--accent)] font-medium">
            Shop
          </Link>
          <button
            onClick={toggleDarkMode}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {userData && (
            <div className="relative group">
              <button className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <User size={20} className="mr-1" />
                <span className="font-medium">{userData.username}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-navbar)] border-b border-[var(--border)] z-50">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/collections"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/shop"
              className="text-[var(--accent)] font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <div className="flex items-center justify-between py-2">
              <span className="text-[var(--text-secondary)]">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            {userData && (
              <button
                onClick={handleLogout}
                className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
