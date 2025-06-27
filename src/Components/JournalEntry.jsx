"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import { useJournals } from "../context/JournalContext";
import {
  Tag,
  BarChart2,
  ArrowLeft,
  Loader2,
  Sparkles,
  Calendar,
  Clock,
} from "lucide-react";
import { getCardClass, getThemeDetails } from "./Dashboard/ThemeDetails";
import Navbar from "./Dashboard/Navbar";
import { logout } from "../utils/anonymousName";

// Mood styling configurations
const moodStyles = {
  Happy: {
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    emoji: "😄",
    gradient:
      "from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20",
  },
  Neutral: {
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
    emoji: "😐",
    gradient:
      "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
  },
  Sad: {
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    emoji: "😔",
    gradient:
      "from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20",
  },
  Angry: {
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
    emoji: "😡",
    gradient: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
  },
  Anxious: {
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
    emoji: "😰",
    gradient:
      "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
  },
  Tired: {
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
    emoji: "🥱",
    gradient:
      "from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20",
  },
  Reflective: {
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-200 dark:border-teal-800",
    emoji: "🤔",
    gradient:
      "from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20",
  },
  Excited: {
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800",
    emoji: "🥳",
    gradient:
      "from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20",
  },
  default: {
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800",
    emoji: "😶",
    gradient:
      "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
  },
};

const handleLogout = () => {
  logout();
  window.location.href = "/";
};

// Moods data
const moods = [
  { name: "Happy", emoji: "😄", color: "#10b981" },
  { name: "Neutral", emoji: "😐", color: "#3b82f6" },
  { name: "Sad", emoji: "😔", color: "#6366f1" },
  { name: "Angry", emoji: "😡", color: "#ef4444" },
  { name: "Anxious", emoji: "😰", color: "#8b5cf6" },
  { name: "Tired", emoji: "🥱", color: "#6b7280" },
  { name: "Reflective", emoji: "🤔", color: "#14b8a6" },
  { name: "Excited", emoji: "🥳", color: "#f59e0b" },
  { name: "Grateful", emoji: "💖", color: "#FF6B9D" },
  { name: "Funny", emoji: "😂", color: "#FFD93D" },
  { name: "Inspired", emoji: "🤩", color: "#6BCF7F" },
  { name: "Disappointed", emoji: "😞", color: "#A8A8A8" },
  { name: "Scared", emoji: "😱", color: "#8B5CF6" },
  { name: "Imaginative", emoji: "🧚", color: "#F59E0B" },
];

const RecommendationCard = ({ entry, formatDate, getThemeDetails }) => {
  const moodData = moods.find((m) => m.name === entry.mood);
  const currentTheme = getThemeDetails(entry.theme);

  // Extract first image from content with improved error handling
  const getFirstImage = (content) => {
    if (!content) return null;
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const img = tempDiv.querySelector("img");
      return img?.src || null;
    } catch (error) {
      console.error("Error parsing content for image:", error);
      return null;
    }
  };

  const firstImage = getFirstImage(entry.content);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Link
      to={`/journal/${entry._id}`}
      className="group flex flex-col sm:flex-row border rounded-lg overflow-hidden transition-all duration-300 max-w-3xl mx-auto my-4 shadow-sm hover:shadow-md focus:shadow-md focus:outline-none bg-white dark:bg-gray-800"
    >
      {/* Image Section - Top on mobile, right on desktop */}
      <div className="w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 order-1 sm:order-2">
        {firstImage ? (
          <img
            src={firstImage}
            alt={entry.title || "Journal entry"}
            className="w-full h-full object-cover aspect-[4/3] rounded-md"
            loading="lazy"
          />
        ) : (
          <div
            className={`${getCardClass(
              entry.theme
            )} w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center`}
          >
            <span className="text-3xl sm:text-4xl">
              {/* {currentTheme?.icon || "📝"} */}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 sm:p-6 order-2 sm:order-1">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {entry.mood && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: moodData?.color || "#6366f1" }}
            >
              <span className="text-base">{moodData?.emoji}</span>
              <span>{entry.mood}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} />
            <span>{formatDate(entry.date)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {entry.title || "Untitled Entry"}
        </h3>

        {/* Content Preview */}
        <div
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 recommendation-content"
          dangerouslySetInnerHTML={{
            __html: entry.content || "No content available.",
          }}
        />

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{entry.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

const JournalEntry = () => {
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const {
    journalEntries,
    loading: contextLoading,
    error: contextError,
  } = useJournals();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contextLoading && journalEntries.length > 0) {
      const foundEntry = journalEntries.find((entry) => entry._id === id);
      if (foundEntry) {
        setEntry(foundEntry);
        generateRecommendations(foundEntry);
      } else {
        setError("Journal entry not found");
      }
      setLoading(false);
    } else if (!contextLoading && journalEntries.length === 0) {
      setError("No journal entries found");
      setLoading(false);
    }
  }, [id, journalEntries, contextLoading]);

  // Generate recommendations based on tags and mood
  const generateRecommendations = (currentEntry) => {
    if (!journalEntries || journalEntries.length <= 1) {
      setRecommendations([]);
      return;
    }

    const otherEntries = journalEntries.filter(
      (entry) => entry._id !== currentEntry._id
    );
    const scoredEntries = otherEntries.map((entry) => {
      let score = 0;

      // Score based on matching tags
      if (currentEntry.tags && entry.tags) {
        const commonTags = currentEntry.tags.filter((tag) =>
          entry.tags.includes(tag)
        );
        score += commonTags.length * 3;
      }

      // Score based on matching mood
      if (currentEntry.mood && entry.mood === currentEntry.mood) {
        score += 2;
      }

      // Score based on theme similarity
      if (currentEntry.theme && entry.theme === currentEntry.theme) {
        score += 1;
      }

      // Add recency bonus (newer entries get slight preference)
      const daysDiff =
        Math.abs(new Date(entry.date) - new Date(currentEntry.date)) /
        (1000 * 60 * 60 * 24);
      if (daysDiff < 7) score += 1;
      if (daysDiff < 30) score += 0.5;

      return { ...entry, score };
    });

    // Sort by score and take top 3
    const topRecommendations = scoredEntries
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setRecommendations(topRecommendations);
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Process content to handle full-width images
  const processContent = (content) => {
    if (!content) return "No content available.";

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      const images = tempDiv.querySelectorAll("img.full-width-image");

      images.forEach((img) => {
        // Skip if already wrapped
        if (img.parentElement.classList.contains("full-width-image-container"))
          return;

        const container = document.createElement("div");
        container.className = "full-width-image-container";
        container.style.cssText = `
        position: relative;
        display: block;
        width: 100%;
        margin: 32px 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(156, 163, 175, 0.2);
        background: white;
      `;

        // Apply original-safe image styling
        img.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
        max-height: 600px;
        margin: 0 auto;
      `;

        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
      });

      return tempDiv.innerHTML;
    } catch (error) {
      console.error("Error processing content:", error);
      return content;
    }
  };

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Loading entry...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || contextError || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {error || contextError
                ? "Error Loading Entry"
                : "Entry Not Found"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {error ||
                contextError ||
                "This journal entry doesn't exist or has been removed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get mood styling with fallback
  const moodStyle = entry.mood
    ? moodStyles[entry.mood] || moodStyles.default
    : moodStyles.default;

  // Get theme details with error handling
  let currentTheme;
  try {
    currentTheme = getThemeDetails(entry.theme);
    // console.log("Theme details:", currentTheme);
  } catch (error) {
    console.error("Error getting theme details:", error);
    currentTheme = { icon: "📝", dateIcon: "📅" };
  }

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        name="New Entry"
        link={"/journaling-alt"}
      />
      {/* Minimal Absolute Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-6 z-30 p-2 rounded-full bg-white/80 dark:bg-black/60 hover:bg-blue-100 dark:hover:bg-slate-800 text-blue-700 dark:text-blue-200 shadow transition-colors"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>
      <div
        style={{ backgroundAttachment: "fixed" }}
        className={`min-h-screen transition-colors duration-300 text-[var(--text-primary)] bg-[var(--bg-primary)] ${
          entry.theme === "theme_default"
            ? "bg-white dark:bg-black"
            : getCardClass(entry.theme)
        } `}
      >
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          <div
            className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br ${moodStyle.gradient} opacity-20 dark:opacity-10`}
          ></div>
        </div>

        {/* Main Container */}
        <div className=" p-4 sm:p-6 lg:p-8">
          {/* Journal Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden mb-8">
              {/* Header Section */}
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  {entry.title || "Untitled Entry"}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Mood Badge */}
                  {entry.mood && (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${moodStyle.bgColor} ${moodStyle.textColor} ${moodStyle.borderColor} font-medium text-sm`}
                    >
                      <span className="text-base">{moodStyle.emoji}</span>
                      <span>{entry.mood}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    <span>{currentTheme.dateIcon}</span>
                    <span>
                      {new Date(entry.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Word Count */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    <BarChart2 size={16} />
                    <span>{entry.wordCount || 0} words</span>
                  </div>
                </div>

                {/* Tags Section */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <Tag size={12} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
                <div className="prose prose-gray dark:prose-invert max-w-none prose-lg">
                  <div
                    className="journal-content-display"
                    dangerouslySetInnerHTML={{
                      __html: processContent(entry.content),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-blue-500" size={20} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    You might also like
                  </h2>
                </div>
                <div className="space-y-4">
                  {recommendations.map((recommendedEntry) => (
                    <RecommendationCard
                      key={recommendedEntry._id}
                      entry={recommendedEntry}
                      formatDate={formatDate}
                      getThemeDetails={getThemeDetails}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rich Text Content Styles */}
        <style jsx global>{`
          .journal-content-display {
            line-height: 1.8;
            color: rgb(17, 24, 39);
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .dark .journal-content-display {
            color: rgb(243, 244, 246);
          }

          .journal-content-display p {
            margin: 1.25rem 0;
            color: inherit;
          }

          .journal-content-display h1,
          .journal-content-display h2,
          .journal-content-display h3 {
            font-weight: 700;
            margin: 2rem 0 1rem 0;
            color: inherit;
            word-wrap: break-word;
          }

          .journal-content-display h1 {
            font-size: 2rem;
            line-height: 1.2;
          }

          .journal-content-display h2 {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .journal-content-display h3 {
            font-size: 1.25rem;
            line-height: 1.4;
          }

          .journal-content-display strong {
            font-weight: 700;
            color: inherit;
          }

          .journal-content-display em {
            font-style: italic;
          }

          .journal-content-display u {
            text-decoration: underline;
          }

          .journal-content-display ul,
          .journal-content-display ol {
            margin: 1.25rem 0;
            padding-left: 1.5rem;
          }

          .journal-content-display ul {
            list-style-type: disc;
          }

          .journal-content-display ol {
            list-style-type: decimal;
          }

          .journal-content-display li {
            margin: 0.5rem 0;
            line-height: 1.7;
          }

          .journal-content-display ul ul {
            list-style-type: circle;
          }

          .journal-content-display ul ul ul {
            list-style-type: square;
          }

          .journal-content-display blockquote {
            border-left: 4px solid #5B8A9E;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            background: rgba(59, 130, 246, 0.05);
            padding: 1.5rem;
            border-radius: 0.75rem;
            position: relative;
          }

          .journal-content-display code {
            background: rgba(156, 163, 175, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
            font-size: 0.875rem;
            border: 1px solid rgba(156, 163, 175, 0.2);
            word-break: break-all;
          }

          .journal-content-display pre {
            background: rgba(156, 163, 175, 0.1);
            padding: 1.5rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid rgba(156, 163, 175, 0.2);
          }

          .journal-content-display pre code {
            background: none;
            padding: 0;
            border: none;
            word-break: normal;
          }

          .journal-content-display a {
            color: #5B8A9E;
            text-decoration: underline;
            transition: opacity 0.2s;
            word-break: break-all;
          }

          .journal-content-display a:hover {
            opacity: 0.8;
          }

          /* Full-width image handling */
          .journal-content-display .full-width-image-container {
            position: relative;
            display: block;
            width: 100%;
            margin: 24px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.2);
            background: transparent;
          }

          .journal-content-display .full-width-image-container img {
            margin: 0 !important;
            display: block !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
            padding: 0 !important;
            max-height: 400px !important;
          }

          /* Recommendation content styling */
          .recommendation-content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.4;
          }

          .recommendation-content * {
            display: inline;
            margin: 0;
            padding: 0;
            border: 0;
            font-size: inherit;
            font: inherit;
            vertical-align: baseline;
          }

          .recommendation-content img,
          .recommendation-content figure {
            display: none;
          }

          .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          /* Dark mode adjustments for images */
          .dark .journal-content-display .full-width-image-container {
            border-color: rgba(75, 85, 99, 0.5);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .journal-content-display .full-width-image-container {
              margin: 16px 0 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default JournalEntry;