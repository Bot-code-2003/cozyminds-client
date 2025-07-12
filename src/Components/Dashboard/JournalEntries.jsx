"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import Navbar from "./Navbar";
import JournalCard from "../PublicJournals/PublicJournalCard.jsx";
import { logout, getWithExpiry } from "../../utils/anonymousName";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const JournalEntries = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [journals, setJournals] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from storage
  useEffect(() => {
    const storedUser = getWithExpiry("user");
    if (storedUser) {
      setUser(storedUser);
    } else {
      setError("No user logged in. Please log in to view journals.");
      setIsLoading(false);
    }
  }, []);

  // Fetch all journals for the user
  useEffect(() => {
    if (!user?._id || isLoading) return;
    const fetchJournals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = `/journals/${user._id}`;
        const response = await API.get(endpoint);
        const { journals: fetchedJournals } = response.data;
        setJournals(fetchedJournals);
        setHasMore(fetchedJournals.length > 20);
        setPage(1); // Reset to first page on new fetch
      } catch (err) {
        setError("Failed to load journal entries.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJournals();
    // eslint-disable-next-line
  }, [user]);

  // Client-side pagination
  const journalsToShow = journals.slice(0, page * 20);
  const handleLoadMore = () => {
    if (!isLoading && journalsToShow.length < journals.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-3">Error</h2>
          <p className="mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
            Log Out
          </button>
        </div>
    </div>
  );
  }

  return (
    <div className={`min-h-screen journal-entries-container ${darkMode ? "dark" : "light"} bg-[var(--bg-primary)] transition-colors duration-500`}>
      <Navbar user={user} handleLogout={handleLogout} darkMode={darkMode} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-journal-title)] tracking-tight drop-shadow-sm">Your Journals</h1>
        </div>
        {isLoading && journalsToShow.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-secondary)] animate-pulse">Loading entries...</div>
        ) : journalsToShow.length === 0 ? (
          <div className="p-8 text-center border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl">
            <p className="text-[var(--text-primary)] text-lg font-medium mb-2">No entries found.</p>
            <p className="text-[var(--text-secondary)] mb-6">Start journaling to create your first entry.</p>
            <Link
              to="/journaling-alt"
              className="px-5 py-2.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              New Entry
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-fadeInUp">
            {journalsToShow.map((entry) => (
              <div key={entry._id} className="relative">
                {/* Public/Private Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm z-10
                    ${entry.isPublic
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-200 text-gray-700 border border-gray-300'}
                  `}
                  title={entry.isPublic ? 'This journal is public' : 'This journal is private'}
                >
                  {entry.isPublic ? 'Public' : 'Private'}
                </span>
              <JournalCard
                journal={entry}
              />
              </div>
            ))}
          </div>
        )}
        {journalsToShow.length < journals.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-[var(--accent)] text-white py-3 px-8 rounded-apple shadow-apple hover:bg-[var(--accent-hover)] transition-colors disabled:bg-[var(--accent-light)] font-semibold text-lg"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        <Link
          to="/journaling-alt"
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent)] flex items-center justify-center rounded-full shadow-apple text-white hover:bg-[var(--accent-hover)] transition-all duration-200"
        >
          <span className="text-2xl">+</span>
        </Link>
      </div>
    </div>
  );
};

export default JournalEntries;