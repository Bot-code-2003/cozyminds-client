// JournalEntry.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import { Tag, BarChart2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { getCardClass, getThemeDetails } from "./Dashboard/ThemeDetails";
import { motion, AnimatePresence } from "framer-motion";

// Mood styling configurations
const moodStyles = {
  Happy: {
    bgColor: "bg-green-500/20",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    emoji: "😄",
    gradient: "from-green-500/10 to-green-500/30",
  },
  Neutral: {
    bgColor: "bg-blue-400/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-400",
    emoji: "😐",
    gradient: "from-blue-400/10 to-blue-400/30",
  },
  Sad: {
    bgColor: "bg-blue-600/20",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
    emoji: "😔",
    gradient: "from-blue-600/10 to-blue-600/30",
  },
  Angry: {
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    emoji: "😡",
    gradient: "from-red-500/10 to-red-500/30",
  },
  Anxious: {
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    emoji: "😰",
    gradient: "from-purple-500/10 to-purple-500/30",
  },
  Tired: {
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-500",
    borderColor: "border-gray-500",
    emoji: "🥱",
    gradient: "from-gray-500/10 to-gray-500/30",
  },
  Reflective: {
    bgColor: "bg-green-600/20",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    emoji: "🤔",
    gradient: "from-green-600/10 to-green-600/30",
  },
  Excited: {
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    emoji: "🥳",
    gradient: "from-yellow-500/10 to-yellow-500/30",
  },
  default: {
    bgColor: "bg-[#F4A261]/20",
    textColor: "text-[#F4A261]",
    borderColor: "border-[#F4A261]",
    emoji: "😶",
    gradient: "from-[#F4A261]/10 to-[#F4A261]/30",
  },
};

const JournalEntry = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournalEntry = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/journal/${id}`);
        setEntry(response.data.journal);
      } catch (err) {
        console.error("Error fetching journal entry:", err);
        setError("Failed to load journal entry. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntry();
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--bg-primary)] p-8 rounded-xl shadow-lg border border-[var(--border)]"
        >
          <p className="text-lg font-medium tracking-wide flex items-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ⟳
            </motion.span>
            LOADING ENTRY...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--bg-primary)] p-8 rounded-xl shadow-lg border border-[var(--border)] max-w-md w-full text-center"
        >
          <h2 className="text-xl font-bold mb-4 tracking-wider">
            {error ? "ERROR" : "NO ENTRY FOUND"}
          </h2>
          <p className="mb-6 opacity-80 text-sm">
            {error || "This journal entry doesn't exist or has been removed."}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] rounded-lg text-sm font-medium tracking-wider transition-all duration-200 hover:bg-[var(--accent)]/80"
            >
              <ArrowLeft size={16} />
              BACK TO DASHBOARD
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Get mood styling
  const moodStyle = entry.mood
    ? moodStyles[entry.mood] || moodStyles.default
    : moodStyles.default;

  // Get theme details
  const currentTheme = getThemeDetails(entry.theme);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`min-h-screen ${
        darkMode ? "bg-[#1A1A1A] text-[#F8F1E9]" : "bg-[#F8F1E9] text-[#1A1A1A]"
      } flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden transition-colors duration-300 ${getCardClass(
        entry.theme
      )}`}
    >
      {/* Theme-specific decorative elements */}
      <div
        className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b ${moodStyle.gradient} opacity-15 dark:opacity-10 transform -skew-y-6 pointer-events-none`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t ${moodStyle.gradient} opacity-15 dark:opacity-10 transform skew-y-6 pointer-events-none`}
      ></div>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl z-10">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/")
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-lg bg-[var(--accent)]/90 hover:bg-[var(--accent)] transition-all duration-200 text-sm font-medium tracking-wider shadow-sm"
        >
          <ArrowLeft size={16} />
          BACK
        </motion.button>

        {/* Journal Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[var(--bg-primary)]/80 backdrop-blur-md rounded-xl shadow-xl border border-[var(--border)] overflow-hidden"
        >
          {/* Theme Header Banner */}
          <div
            className={`relative h-14 bg-gradient-to-r ${moodStyle.gradient} flex items-center justify-between px-4 sm:px-6`}
          >
            <span className="text-sm font-medium tracking-wider opacity-80">
              {entry.theme
                ? entry.theme.replace("theme_", "").toUpperCase()
                : "DEFAULT"}{" "}
              THEME
            </span>
            <span role="img" aria-label="theme-icon" className="text-2xl">
              {currentTheme.icon}
            </span>
          </div>

          {/* Content Container */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header Section */}
            <div className="border-b border-[var(--border)] pb-6 mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-4 break-words">
                {entry.title}
              </h1>

              {/* Date & Stats Row */}
              <div className="flex flex-wrap gap-3 text-sm opacity-80 tracking-wide">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-3 py-1.5 rounded-full"
                >
                  <span>{currentTheme.dateIcon}</span>
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {formatDate(entry.date)}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-3 py-1.5 rounded-full"
                >
                  <BarChart2 size={16} />
                  <span>{entry.wordCount} WORDS</span>
                </motion.div>
              </div>
            </div>

            {/* Mood & Tags Section */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Mood Badge */}
              {entry.mood && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide rounded-full ${moodStyle.bgColor} ${moodStyle.textColor} border ${moodStyle.borderColor} shadow-sm`}
                >
                  <span className="text-lg">{moodStyle.emoji}</span>
                  <span>{entry.mood}</span>
                </motion.div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {entry.tags && entry.tags.length > 0 ? (
                    entry.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium tracking-wide rounded-full ${
                          darkMode
                            ? "bg-[#F8F1E9]/10 text-[#F8F1E9] border-[#F8F1E9]/20"
                            : "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/20"
                        } border shadow-sm hover:scale-105 transition-transform duration-200`}
                      >
                        <Tag size={12} />
                        <span>{tag}</span>
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-xs opacity-60 tracking-wide py-1.5">
                      NO TAGS
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Journal Content */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-1.5 h-full bg-[var(--accent)]/40 rounded"></div>
              <div
                className={`pl-5 text-base sm:text-lg leading-relaxed tracking-wide max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)]/50 scrollbar-track-transparent ${
                  darkMode ? "text-[#F8F1E9]/90" : "text-[#1A1A1A]/90"
                }`}
              >
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JournalEntry;
