"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Filter,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Tag,
  SortAsc,
  SortDesc,
  Lock,
  Globe,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import Navbar from "./Navbar";
import { getThemeDetails, getCardClass } from "./ThemeDetails";
import JournalCard from "./JorunalCard";
import { logout, getWithExpiry } from "../../utils/anonymousName";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Mood options with emojis, descriptions and colors
const MOODS = [
  { emoji: "😄", name: "Happy", description: "Feeling joyful and content", color: "#3EACA8" },
  { emoji: "😐", name: "Neutral", description: "Neither good nor bad", color: "#547AA5" },
  { emoji: "😔", name: "Sad", description: "Feeling down or blue", color: "#6A67CE" },
  { emoji: "😡", name: "Angry", description: "Frustrated or irritated", color: "#E07A5F" },
  { emoji: "😰", name: "Anxious", description: "Worried or nervous", color: "#9B72CF" },
  { emoji: "🥱", name: "Tired", description: "Low energy or exhausted", color: "#718EBC" },
  { emoji: "🤔", name: "Reflective", description: "Thoughtful and introspective", color: "#5D8A66" },
  { emoji: "🥳", name: "Excited", description: "Enthusiastic and energized", color: "#F2B147" },
  { emoji: "💖", name: "Grateful", description: "Thankful and appreciative", color: "#FF6B9D" },
  { emoji: "😂", name: "Funny", description: "Amused and entertained", color: "#FFD93D" },
  { emoji: "🤩", name: "Inspired", description: "Creative and motivated", color: "#6BCF7F" },
  { emoji: "😞", name: "Disappointed", description: "Let down or unsatisfied", color: "#A8A8A8" },
  { emoji: "😱", name: "Scared", description: "Afraid or frightened", color: "#8B5CF6" },
  { emoji: "🧚", name: "Imaginative", description: "Creative and dreamy", color: "#F59E0B" },
];

const JournalEntries = () => {
  const { collection } = useParams();
  const decodedCollection = decodeURIComponent(collection || "All");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { inventory } = useCoins();

  // State management
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postType, setPostType] = useState("private"); // Default to private
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    period: "all",
    mood: null,
    tag: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

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

  // Reset state when switching post types or user
  useEffect(() => {
    setPage(1);
    setJournalEntries([]);
    setFilteredEntries([]);
    setHasMore(true);
  }, [postType, user]);

  // Fetch journals
  useEffect(() => {
    const fetchJournals = async () => {
      if (!user?._id || !hasMore || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const endpoint = `/journals/dashboard/${postType}/${user._id}?page=${page}&limit=10`;
        const response = await API.get(endpoint);
        const { journals: fetchedJournals, hasMore: newHasMore, total } = response.data;

        if (!fetchedJournals || !Array.isArray(fetchedJournals)) {
          throw new Error("Invalid response format: journals missing or not an array");
        }

        const filteredByCollection =
          decodedCollection === "All"
            ? fetchedJournals
            : fetchedJournals.filter(
                (entry) =>
                  entry.collections &&
                  Array.isArray(entry.collections) &&
                  entry.collections.includes(decodedCollection)
              );

        setJournalEntries((prev) =>
          page === 1 ? filteredByCollection : [...prev, ...filteredByCollection]
        );
        setHasMore(newHasMore);
      } catch (err) {
        setError(`Failed to load ${postType} journal entries: ${err.message}`);
        console.error(`Error fetching ${postType} journal entries:`, err);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, [page, postType, user, decodedCollection, hasMore]);

  // Filtering and sorting
  useEffect(() => {
    let filtered = [...journalEntries];
    const { period, mood, tag } = filters;

    // Apply filters
    if (mood) {
      filtered = filtered.filter((entry) => entry.mood === mood);
    }

    if (tag) {
      filtered = filtered.filter(
        (entry) => entry.tags && entry.tags.includes(tag)
      );
    }

    if (period !== "all") {
      const now = new Date();
      let startDate;

      switch (period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(
          (entry) => new Date(entry.date || entry.createdAt) >= startDate
        );
      }
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEntries(filtered);
  }, [journalEntries, filters, sortOrder]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await API.delete(`/journal/${id}`);
        setJournalEntries((prev) => prev.filter((entry) => entry._id !== id));
        setFilteredEntries((prev) => prev.filter((entry) => entry._id !== id));
      } catch (error) {
        console.error("Error deleting entry:", error);
        setError("Failed to delete journal entry.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getAllTags = () => {
    const tags = new Set();
    journalEntries.forEach((entry) => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const allTags = getAllTags();

  const EmptyState = () => (
    <div className="p-8 text-center border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-light)] mb-4">
        <Calendar size={24} className="text-[var(--accent)]" />
      </div>
      <p className="text-[var(--text-primary)] text-lg font-medium mb-2">
        No entries found.
      </p>
      <p className="text-[var(--text-secondary)] mb-6">
        {journalEntries.length
          ? "Try adjusting your filters or search terms."
          : "Start journaling to create your first entry."}
      </p>
      <Link
        to="/journaling-alt"
        className="px-5 py-2.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
      >
        New Entry
      </Link>
    </div>
  );

  return (
    <div className={`min-h-screen journal-entries-container ${darkMode ? "dark" : "light"}`}>
      <Navbar user={user} handleLogout={handleLogout} darkMode={darkMode} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">{decodedCollection} Journals</h1>
          
        </div>

        <div className="bg-[--bg-secondary] p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--bg-secondary)]"
              >
                <Filter size={16} className="mr-2 opacity-70" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown size={16} className="ml-2 opacity-70" />
              </button>

              <select
                value={filters.period}
                onChange={(e) => updateFilter("period", e.target.value)}
                className="px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none appearance-none pr-8 text-[var(--text-secondary)]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>

              <button
                onClick={toggleSortOrder}
                className="flex items-center px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--bg-secondary)]"
                title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
              >
                {sortOrder === "desc" ? (
                  <SortDesc size={16} className="mr-2 opacity-70" />
                ) : (
                  <SortAsc size={16} className="mr-2 opacity-70" />
                )}
                <span className="hidden md:inline">
                  {sortOrder === "desc" ? "Newest" : "Oldest"}
                </span>
              </button>
            </div>
            {/* Public/Private Toggle Buttons - Responsive */}
            <div className="flex gap-2 mt-3 md:mt-0">
              <button
                onClick={() => setPostType("private")}
                className={`flex items-center px-3 py-2 rounded-lg font-semibold border border-[var(--border)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  postType === "private"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
                title="Private Journals"
              >
                <Lock size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Private</span>
              </button>
              <button
                onClick={() => setPostType("public")}
                className={`flex items-center px-3 py-2 rounded-lg font-semibold border border-[var(--border)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  postType === "public"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
                title="Public Journals"
              >
                <Globe size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Public</span>
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 mb-6 rounded-lg animate-fadeIn">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Filter by Mood</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("mood", null)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    !filters.mood
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] border border-[var(--border)]"
                  }`}
                >
                  All Moods
                </button>
                {MOODS.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => updateFilter("mood", mood.name)}
                    className={`flex items-center px-3 py-1 text-xs rounded-full ${
                      filters.mood === mood.name
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] border-[var(--border)]"
                    }`}
                  >
                    <span className="mr-1">{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Filter by Tag</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter("tag", null)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      !filters.tag
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] border-[var(--border)]"
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateFilter("tag", tag)}
                      className={`flex items-center px-3 py-1 text-xs rounded-full ${
                        filters.tag === tag
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-secondary)] border-[var(--border)]"
                      }`}
                    >
                      <Tag size={12} className="mr-1 opacity-70" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {isLoading && journalEntries.length === 0 ? (
          <div className="text-center py-10">Loading entries...</div>
        ) : filteredEntries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <JournalCard
                key={entry._id}
                entry={entry}
                deleteEntry={deleteEntry}
                moods={MOODS}
                formatDate={formatDate}
                getThemeDetails={getThemeDetails}
                getCardClass={getCardClass}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        <Link
          to="/journaling-alt"
          className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-[var(--accent)] flex items-center justify-center rounded-full shadow-lg text-white"
        >
          <Calendar size={24} />
        </Link>
      </div>
    </div>
  );
};

export default JournalEntries;