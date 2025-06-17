"use client";

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, Clock, Eye, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import { motion, AnimatePresence } from "framer-motion";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";

const PublicJournalCard = ({ journal, onLike, onShare, isLiked }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  // Get user from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Memoized calculations
  const moodDetails = useMemo(() => {
    try {
      return getThemeDetails(journal.mood);
    } catch (error) {
      console.error("Error getting mood details:", error);
      return { emoji: "😐", name: "Neutral", color: "#6b7280" };
    }
  }, [journal.mood]);

  const cardClass = useMemo(() => {
    try {
      return getCardClass(journal.theme);
    } catch (error) {
      console.error("Error getting card class:", error);
      return "bg-gradient-to-br from-gray-100 to-gray-200";
    }
  }, [journal.theme]);

  const formattedDate = useMemo(() => {
    try {
      if (!journal.createdAt) return "Unknown date";
      const date = new Date(journal.createdAt);
      if (isNaN(date.getTime())) return "Invalid date";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  }, [journal.createdAt]);

  const firstImage = useMemo(() => {
    if (!journal.content) return null;
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = journal.content;
      const img = tempDiv.querySelector("img");
      return img?.src || null;
    } catch (error) {
      console.error("Error extracting image:", error);
      return null;
    }
  }, [journal.content]);

  const textPreview = useMemo(() => {
    if (!journal.content) return "";
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = journal.content;
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => img.remove());
      const text = tempDiv.textContent || tempDiv.innerText || "";
      return text.length > 140 ? text.slice(0, 140) + "..." : text;
    } catch (error) {
      console.error("Error extracting text:", error);
      return "";
    }
  }, [journal.content]);

  const readingTime = useMemo(() => {
    const wordCount = journal.content?.split(" ").length || 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [journal.content]);

  const currentTheme = useMemo(() => {
    return getThemeDetails(journal.theme) || { dateIcon: "📅", readMoreText: "Read more" };
  }, [journal.theme]);

  const handleLike = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        openLoginModal();
        return;
      }
      onLike(journal._id);
    },
    [onLike, journal._id, user, openLoginModal]
  );

  const handleShare = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        openLoginModal();
        return;
      }

      const shareUrl = `${window.location.origin}/public-journal/${journal.slug}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: journal.title || "CozyMind Journal Entry",
            url: shareUrl,
          });
          // Optional: Add a subtle visual feedback for successful share
        } catch (error) {
          console.error("Error sharing:", error);
          // User might have cancelled share, or other error occurred
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("Journal link copied to clipboard!"); // Simple alert for fallback
        } catch (err) {
          console.error("Failed to copy: ", err);
          alert("Failed to copy link to clipboard.");
        }
      } else {
        alert("Web Share API and clipboard not supported on this browser.");
      }
    },
    [journal.slug, journal.title, user, openLoginModal]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Link
        to={`/public-journal/${journal.slug}`}
        className="group relative block rounded-apple overflow-hidden border border-[var(--border)] transition-all duration-500 max-h-[500px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Top portion: Background image or theme background */}
        <div
          className={`relative w-full h-48 ${firstImage && !imageError ? "" : cardClass}`}
          style={
            firstImage && !imageError
              ? {
                  backgroundImage: `url(${firstImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
          }
        >
          {/* Overlay for better text readability when there's an image */}
          {firstImage && !imageError && (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          )}

          {/* Animated background gradient for non-image cards */}
          {(!firstImage || imageError) && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${
                  moodDetails?.color || "var(--accent)"
                }15, ${moodDetails?.color || "var(--accent)"}05)`,
              }}
            />
          )}

         {/* Top badges */}
<div className="relative">
  {/* Author badge - top left */}
  <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
      {journal.authorName?.charAt(0).toUpperCase() || "A"}
    </div>
    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
      {journal.authorName || "Anonymous"}
    </span>
  </div>

  {/* Reading time - top right */}
  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
    <Eye className="w-3 h-3" />
    <span className="font-medium">{readingTime} min read</span>
  </div>
</div>

        </div>

        {/* Bottom portion: Main content */}
        <div className="relative p-6 bg-[var(--bg-secondary)] flex flex-col min-h-[300px]">
          {/* Header with date and mood */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
              <span className="text-sm">{currentTheme?.dateIcon || "📅"}</span>
              <span className="px-2 py-1 bg-[var(--bg-primary)] rounded-full">
                {formattedDate}
              </span>
            </div>

            {journal.mood && (
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: moodDetails?.color || "#6366f1",
                  boxShadow: `0 4px 14px 0 ${moodDetails?.color || "#6366f1"}40`,
                }}
              >
                <span className="text-sm">{moodDetails?.emoji}</span>
                <span>{moodDetails?.name}</span>
              </div>
            )}
          </div>

          {/* Title with enhanced styling */}
          <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent)] line-clamp-1 transition-colors duration-300 relative">
            {journal.title || "Untitled Entry"}
            <div className="absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </h3>

          {/* Tags with improved design */}
          {journal.tags && journal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {journal.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 transform group-hover:scale-105 transition-transform duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  #{tag}
                </span>
              ))}
              {journal.tags.length > 2 && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]">
                  +{journal.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Content preview with enhanced styling */}
          <div className="flex-1 overflow-hidden pb-16">
            <div className="relative h-full">
              <div
                className="absolute left-0 top-0 w-1 h-full rounded-full opacity-60"
                style={{ backgroundColor: moodDetails?.color || "var(--accent)" }}
              />
              <div className="pl-4 h-full overflow-hidden">
                <div className="text-sm text-[var(--text-secondary)] journal-card-content">
                  {textPreview || "No content available."}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced footer section with actions - Absolute positioned */}
          <div className="absolute bottom-0 left-0 z-10 right-0 flex items-center justify-between p-6 pt-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
            {/* Left side - Interaction buttons */}
            <div className="flex items-center gap-1">
              {/* Like Button */}
              <motion.button
                onClick={handleLike}
                className="flex items-center gap-2 px-1 py-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group/like"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-200 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-xs font-medium">
                  {journal.likes?.length || 0}
                </span>
              </motion.button>

              {/* Comments Indicator */}
              <Link
                to={`/public-journal/${journal.slug}#comments`}
                className="flex items-center gap-2 px-1 py-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group/comments"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{journal.commentCount || 0}</span>
              </Link>

              {/* Share Button */}
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-1 py-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group/share"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">Share</span>
              </motion.button>
            </div>

            {/* Right side - Read more */}
            <div className="flex items-center text-[var(--accent)] font-medium text-sm group-hover:gap-2 transition-all duration-300">
              <span>{currentTheme?.readMoreText || "Read more"}</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </div>
        </div>

      </Link>

      {/* Card content styling */}
      <style jsx global>{`
        .journal-card-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1.5;
          max-height: 6rem;
        }

        .journal-card-content * {
          display: inline;
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }

        .journal-card-content h1,
        .journal-card-content h2,
        .journal-card-content h3,
        .journal-card-content h4,
        .journal-card-content h5,
        .journal-card-content h6,
        .journal-card-content p,
        .journal-card-content ul,
        .journal-card-content ol,
        .journal-card-content li,
        .journal-card-content blockquote {
          display: inline;
        }

        .journal-card-content br {
          display: none;
        }

        .journal-card-content strong {
          font-weight: bold;
        }

        .journal-card-content em {
          font-style: italic;
        }

        .journal-card-content img,
        .journal-card-content figure {
          display: none;
        }
      `}</style>

      {modals}
    </>
  );
};

export default PublicJournalCard;