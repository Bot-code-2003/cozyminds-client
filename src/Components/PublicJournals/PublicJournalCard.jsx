"use client";

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, Eye, MessageCircle, User, Bookmark, BookmarkCheck, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import { motion } from "framer-motion";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";

const PublicJournalCard = ({ journal, onLike, onShare, isLiked, isSaved: isSavedProp, onSave }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });
  const [isSaved, setIsSaved] = useState(isSavedProp || false);

  // Get user from session storage
  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  }, []);

  // Mood options
  const moods = [
    { emoji: "😄", name: "Happy", color: "#3EACA8" },
    { emoji: "😐", name: "Neutral", color: "#547AA5" },
    { emoji: "😔", name: "Sad", color: "#6A67CE" },
    { emoji: "😡", name: "Angry", color: "#E07A5F" },
    { emoji: "😰", name: "Anxious", color: "#9B72CF" },
    { emoji: "🥱", name: "Tired", color: "#718EBC" },
    { emoji: "🤔", name: "Reflective", color: "#5D8A66" },
    { emoji: "🥳", name: "Excited", color: "#F2B147" },
  ];

  // Find mood details by name (case-insensitive)
  const moodDetails = useMemo(() => 
    moods.find((m) => m.name.toLowerCase() === (journal.mood?.toLowerCase() || "")) || 
    { emoji: "😐", name: "Neutral", color: "#6b7280" },
    [journal.mood]
  );

  const formattedDate = useMemo(() => {
    try {
      if (!journal.createdAt) return "Recently";
      const date = new Date(journal.createdAt);
      if (isNaN(date.getTime())) return "Recently";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Recently";
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
      return null;
    }
  }, [journal.content]);

  const textPreview = useMemo(() => {
    if (!journal.content) return "Tap to read this journal entry...";
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = journal.content;
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => img.remove());
      const text = tempDiv.textContent || tempDiv.innerText || "";
      return text.length > 120 ? text.substring(0, 120) + "..." : text;
    } catch (error) {
      return "Tap to read this journal entry...";
    }
  }, [journal.content]);

  const readingTime = useMemo(() => {
    const wordCount = journal.content?.split(/\s+/).filter(Boolean).length || 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [journal.content]);

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
        } catch (error) {
          // User cancelled or error occurred
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          // Could add a toast notification here
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      }
    },
    [journal.slug, journal.title, user, openLoginModal]
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        openLoginModal();
        return;
      }
      if (onSave) {
        onSave(journal._id, !isSaved, setIsSaved);
      }
    },
    [user, openLoginModal, onSave, journal._id, isSaved]
  );

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative w-full h-full"
      >
        <Link
          to={`/public-journal/${journal.slug}`}
          className="block relative w-full h-full "
          aria-label={`Read journal by ${journal.authorName || "Anonymous"}`}
        >
          {/* Main Card Container */}
          <div className="relative h-full shadow-lg bg-[var(--bg-secondary)] backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 flex flex-col">
            
            {/* Mood Strip */}
            <div 
              className="h-1 w-full"
              style={{ backgroundColor: moodDetails.color }}
            />

            {/* Header Section */}
            <div className="p-5 pb-0 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: moodDetails.color }}
                  >
                    {journal.authorName?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {journal.authorName || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Mood Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodDetails.emoji}</span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">feeling</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {moodDetails.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-5 flex-1 flex flex-col">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 leading-tight">
                {journal.title || "Untitled Entry"}
              </h3>

              {/* Preview Text */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed flex-1">
                {textPreview}
              </p>

              {/* Tags */}
              {journal.tags && journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {journal.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {journal.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-500">
                      +{journal.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {firstImage && !imageError && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-slate-800">
                  <img
                    src={firstImage}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    } ${isHovered ? "scale-105" : "scale-100"}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              {/* Left Actions */}
              <div className="flex items-center gap-1">
                {/* Like Button */}
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isLiked
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                  }`}
                  aria-label={isLiked ? "Unlike journal" : "Like journal"}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {journal.likes?.length || 0}
                  </span>
                </motion.button>

                {/* Comments */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/public-journal/${journal.slug}#comments`;
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
                  aria-label="View comments"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {journal.commentCount || 0}
                  </span>
                </motion.button>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
                  aria-label={isSaved ? "Unsave journal" : "Save journal"}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Share */}
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
                  aria-label="Share journal"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Reading Time */}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent"
              animate={{
                borderColor: isHovered ? moodDetails.color + "40" : "transparent",
              }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </div>
        </Link>
      </motion.div>

      {modals}
    </>
  );
};

export default PublicJournalCard;