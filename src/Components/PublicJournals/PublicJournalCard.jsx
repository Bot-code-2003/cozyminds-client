"use client";

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, Clock, Eye, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import { motion } from "framer-motion";
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

  // console.log(moodDetails);

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
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        openLoginModal();
        return;
      }
      onShare(journal._id);
    },
    [onShare, journal._id, user, openLoginModal]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <motion.article
        className="group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[var(--border)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image/Hero Section */}
        <Link
          to={`/publicjournal/${journal.slug}`}
          state={{ journal }}
          className="relative block w-full h-52 overflow-hidden"
        >
          {firstImage && !imageError ? (
            <motion.img
              src={firstImage}
              alt={journal.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className={`w-full h-full ${cardClass} relative flex items-center justify-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* <div className="text-center text-white">
                <motion.div
                  className="text-6xl mb-4 drop-shadow-lg"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {moodDetails.icon}
                </motion.div>
              </div> */}
            </motion.div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {/* Mood indicator */}
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
              <span className="text-sm">{moodDetails.emoji}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {moodDetails.name}
              </span>
            </div>

            {/* Reading time */}
            <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              <span className="font-medium">{readingTime} min read</span>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Author Section */}
          <Link
            to={`/profile/${journal.authorName}`}
            className="mb-2 flex items-center gap-3 p-3 -m-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 group/author"
          >
            {/* Author Avatar */}
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md group-hover/author:shadow-lg transition-shadow">
                {journal.authorName?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors">
                {journal.authorName || "Anonymous"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Follow indicator */}
            <div className="opacity-0 group-hover/author:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Title */}
          <Link
            to={`/publicjournal/${journal.slug}`}
            state={{ journal }}
            className="block group/title"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors mb-2">
              {journal.title}
            </h2>
          </Link>

          {/* Preview Text */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
            {textPreview}
          </p>

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {journal.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
              {journal.tags.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                  +{journal.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-1">
              {/* Like Button */}
              <motion.button
                onClick={handleLike}
                className="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group/like"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-200 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {journal.likes?.length || 0}
                </span>
              </motion.button>

              {/* Share Button */}
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group/share"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </motion.button>

              {/* Comments */}
              {/* <div className="flex items-center gap-2 px-3 py-2 text-gray-400 dark:text-gray-500 rounded-lg">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">0</span>
              </div> */}
            </div>

            {/* Read More Button */}
            <Link
              to={`/publicjournal/${journal.slug}`}
              state={{ journal }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium text-sm group/read shadow-sm hover:shadow-md"
            >
              <span>Read</span>
              <motion.span
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
                className="group-hover/read:translate-x-0.5 transition-transform"
              >
                →
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.article>
      {modals}
    </>
  );
};

export default PublicJournalCard;
