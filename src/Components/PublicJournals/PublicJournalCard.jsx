"use client";

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, Eye, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import { motion } from "framer-motion";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";

const PublicJournalCard = ({ journal, onLike, onShare, isLiked }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  // Get user from session storage
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // Memoized calculations
  const moodDetails = useMemo(() => {
    try {
      return getThemeDetails(journal.mood);
    } catch (error) {
      return { emoji: "😐", name: "Neutral", color: "#6b7280" };
    }
  }, [journal.mood]);

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
      return text.length > 120 ? text.slice(0, 120) + "..." : text;
    } catch (error) {
      return "Tap to read this journal entry...";
    }
  }, [journal.content]);

  const readingTime = useMemo(() => {
    const wordCount = journal.content?.split(" ").length || 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [journal.content]);

  const cardClass = useMemo(() => {
    try {
      return getCardClass(journal.theme);
    } catch (error) {
      return "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30";
    }
  }, [journal.theme]);

  const handleLike = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openLoginModal();
      return;
    }
    onLike(journal._id);
  }, [onLike, journal._id, user, openLoginModal]);

  const handleShare = useCallback(async (e) => {
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
  }, [journal.slug, journal.title, user, openLoginModal]);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative w-full h-full"
      >
        <Link
          to={`/public-journal/${journal.slug}`}
          className="block relative w-full h-full bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
          style={{
            boxShadow: isHovered 
              ? '0 32px 64px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)'
              : '0 4px 20px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Hero Section - Fixed Height */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            {firstImage && !imageError ? (
              <div className="relative w-full h-full">
                <img
                  src={firstImage}
                  alt=""
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
                  } ${isHovered ? 'scale-105' : 'scale-100'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            ) : (
              <div className={`w-full h-full ${cardClass} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <motion.div
                  className="absolute inset-0 "
                  animate={{
                    background: isHovered 
                      ? `radial-gradient(circle at 50% 50%, ${moodDetails?.color}20, transparent 70%)`
                      : `radial-gradient(circle at 30% 30%, ${moodDetails?.color}10, transparent 70%)`
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            )}

            {/* Floating Elements */}
            <div className="absolute inset-0 p-5">
              {/* Top Row */}
              <div className="flex items-start justify-between">
                {/* Author Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-black/5 dark:border-white/10"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {journal.authorName?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {journal.authorName || "Anonymous"}
                  </span>
                </motion.div>

                {/* Reading Time */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-xl rounded-2xl text-white shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">{readingTime} min</span>
                </motion.div>
              </div>

              {/* Bottom Row */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                {/* Date & Mood */}
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-black/5 dark:border-white/10"
                  >
                    {formattedDate}
                  </motion.div>

                  {journal.mood && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white font-medium shadow-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: moodDetails?.color || "#6366f1",
                        boxShadow: `0 8px 25px -8px ${moodDetails?.color || "#6366f1"}60`,
                      }}
                    >
                      <span className="text-base">{moodDetails?.emoji}</span>
                      <span className="text-sm">{moodDetails?.name}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section - Flexible but with min-height */}
          <div className="p-6 space-y-4 flex-1 flex flex-col min-h-0">
            {/* Title */}
            <div className="space-y-2 flex-shrink-0">
              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {journal.title || "Untitled Entry"}
              </motion.h3>

              {/* Tags */}
              {journal.tags && journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {journal.tags.slice(0, 3).map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                  {journal.tags.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400">
                      +{journal.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Preview Text - Flexible but with max height */}
            <div className="flex-1 flex flex-col min-h-0">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 text-sm flex-1">
                {textPreview}
              </p>

              {/* Action Bar - Fixed at bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-4 flex-shrink-0">
                {/* Left Actions */}
                <div className="flex items-center gap-1">
                  {/* Like Button */}
                  <motion.button
                    onClick={handleLike}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isLiked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                    }`}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Navigate to the journal entry and scroll to comments
                      window.location.href = `/public-journal/${journal.slug}#comments`;
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {journal.commentCount || 0}
                    </span>
                  </motion.div>

                  {/* Share */}
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share</span>
                  </motion.button>
                </div>

                {/* Read More */}
                <motion.div
                  className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span>Read more</span>
                  <motion.span
                    className="ml-1 text-lg"
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {modals}
    </>
  );
};

export default PublicJournalCard;