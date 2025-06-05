"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import { Tag, BarChart2, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { getCardClass, getThemeDetails } from "./Dashboard/ThemeDetails";

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

    if (id) {
      fetchJournalEntry();
    } else {
      setError("Invalid journal entry ID");
      setLoading(false);
    }
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Process content to handle image dimensions and recreate editor styling
  const processContent = (content) => {
    if (!content) return "No content available.";

    try {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      // Find all images and ensure they have the proper container structure
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        const width = img.getAttribute("width");
        const height = img.getAttribute("height");

        // Check if image is already in a resizable container
        if (!img.closest(".resizable-image-container")) {
          // Create the container structure that matches the editor
          const container = document.createElement("div");
          container.className = "resizable-image-container";

          // Apply the exact same styling as the editor
          container.style.cssText = `
          position: relative;
          display: inline-block;
          margin: 16px 8px 16px 0;
          vertical-align: top;
          min-width: 50px;
          min-height: 50px;
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(156, 163, 175, 0.2);
        `;

          // Set dimensions if available
          if (width) {
            container.style.width = width + "px";
          } else {
            container.style.width = "300px"; // default width
          }

          if (height) {
            container.style.height = height + "px";
          } else {
            container.style.height = "200px"; // default height
          }

          // Wrap the image
          img.parentNode.insertBefore(container, img);
          container.appendChild(img);

          // Style the image to fill the container exactly like in editor
          img.style.cssText = `
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          margin: 0;
          padding: 0;
        `;

          // Remove width/height attributes from img since container handles sizing
          img.removeAttribute("width");
          img.removeAttribute("height");
        } else {
          // If already in container, just ensure proper styling
          const container = img.closest(".resizable-image-container");
          if (width) container.style.width = width + "px";
          if (height) container.style.height = height + "px";
        }
      });

      return tempDiv.innerHTML;
    } catch (error) {
      console.error("Error processing content:", error);
      return content;
    }
  };

  if (loading) {
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

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {error ? "Error Loading Entry" : "Entry Not Found"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {error || "This journal entry doesn't exist or has been removed."}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
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
  } catch (error) {
    console.error("Error getting theme details:", error);
    currentTheme = { icon: "📝", dateIcon: "📅" };
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${getCardClass(
        entry.theme
      )} ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      style={{ backgroundAttachment: "fixed" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br ${moodStyle.gradient} opacity-30 dark:opacity-10`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl ${moodStyle.gradient} opacity-30 dark:opacity-10`}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        {/* <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white "
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div> */}

        {/* Journal Container */}
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Theme Header Banner */}
            <div className={`h-3 bg-gradient-to-r ${moodStyle.gradient}`}></div>

            {/* Header Section */}
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
              {/* Title and Theme Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight break-words">
                    {entry.title || "Untitled Entry"}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-lg">{currentTheme.icon}</span>
                    <span className="font-medium">
                      {entry.theme
                        ? entry.theme.replace("theme_", "").toUpperCase()
                        : "DEFAULT"}{" "}
                      THEME
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
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
                  <span>{formatDate(entry.date)}</span>
                </div>

                {/* Word Count */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                  <BarChart2 size={16} />
                  <span>{entry.wordCount || 0} words</span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2">
                {entry.tags && entry.tags.length > 0 ? (
                  entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400 py-1.5">
                    No tags
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-2 sm:p-4 text-gray-900 dark:text-gray-100">
              <div className="relative">
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
          </div>
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
          border-left: 4px solid #3b82f6;
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
          color: #3b82f6;
          text-decoration: underline;
          transition: opacity 0.2s;
          word-break: break-all;
        }

        .journal-content-display a:hover {
          opacity: 0.8;
        }

        /* Image handling - exact match to editor styling */
        .journal-content-display img {
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(156, 163, 175, 0.2);
          margin: 16px 0;
          display: block;
          max-width: 100%;
          height: auto;
        }

        /* Resizable image containers - exact match to editor */
        .journal-content-display .resizable-image-container {
          position: relative;
          display: inline-block;
          margin: 16px 8px 16px 0;
          vertical-align: top;
          min-width: 50px;
          min-height: 50px;
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(156, 163, 175, 0.2);
        }

        .journal-content-display .resizable-image-container img {
          margin: 0 !important;
          display: block !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          padding: 0 !important;
        }

        /* Handle paragraphs containing images */
        .journal-content-display p:has(.resizable-image-container) {
          line-height: 0;
          margin: 1.5rem 0;
        }

        /* Dark mode adjustments for images */
        .dark .journal-content-display .resizable-image-container {
          border-color: rgba(75, 85, 99, 0.5);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .dark .journal-content-display img:not(.resizable-image-container img) {
          border-color: rgba(75, 85, 99, 0.5);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .journal-content-display .resizable-image-container {
            display: block !important;
            margin: 16px 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
          }

          .journal-content-display .resizable-image-container img {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JournalEntry;
