"use client";

import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Bookmark, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
} from "@dicebear/collection";
import axios from "axios";

const avatarStyles = {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem("user");
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    return item?.value || item;
  } catch {
    return null;
  }
};

const JournalCard = memo(
  ({
    journal,
    onLike,
    isLiked,
    isSaved: isSavedProp,
    onSave,
    hideStats = false,
  }) => {
    const [imageError, setImageError] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const { modals, openLoginModal } = AuthModals({ darkMode });

    const user = useMemo(() => getCurrentUser(), []);

    const thumbnail = useMemo(() => {
      if (imageError) return null;

      if (journal.thumbnail) return journal.thumbnail;

      if (journal.content) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(journal.content, "text/html");
          const img = doc.querySelector("img[src]");

          if (img?.src) {
            try {
              new URL(img.src);
              return img.src;
            } catch {
              return null;
            }
          }
        } catch {
          return null;
        }
      }
      return null;
    }, [journal.thumbnail, journal.content, imageError]);

    // useEffect(() => {
    //   console.log("🧪 Journal Data:", journal);
    // }, [journal]);

    const storyPreview = useMemo(() => {
      if (journal.metaDescription) {
        return journal.metaDescription;
      }
      if (!journal.content) return "Discover what happens in this story...";

      const parser = new DOMParser();
      const doc = parser.parseFromString(journal.content, "text/html");
      const text = doc.body.textContent || "";
      const preview = text.trim().substring(0, 120);
      return preview + (text.length > 120 ? "..." : "");
    }, [journal.category, journal.metaDescription, journal.content]);

    const readingTime = useMemo(() => {
      if (!journal.content) return "1 min read";

      const parser = new DOMParser();
      const doc = parser.parseFromString(journal.content, "text/html");
      const text = doc.body.textContent || "";
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return `${minutes} min read`;
    }, [journal.content]);

    const handleAuthorClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (journal.author?.userId) {
          navigate(`/profile/id/${journal.author.userId}`);
        }
      },
      [navigate, journal.author]
    );

    const handleLike = useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return openLoginModal();

        setIsLiking(true);
        try {
          await onLike(journal);
        } catch (error) {
          console.error("Error liking:", error);
        } finally {
          setIsLiking(false);
        }
      },
      [onLike, journal, user, openLoginModal]
    );

    const handleSave = useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return openLoginModal();
        setIsSaving(true);
        try {
          await onSave(journal._id, !isSavedProp);
        } catch (error) {
          console.error("Error saving:", error);
        } finally {
          setIsSaving(false);
        }
      },
      [user, onSave, journal._id, isSavedProp, openLoginModal]
    );

    return (
      <>
        <article
          className={`group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-black/30 hover:border-gray-300/60 dark:hover:border-gray-600/60 ${
            isHovered ? "transform hover:-translate-y-2 hover:scale-[1.02]" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="article"
          aria-labelledby={`journal-title-${journal._id}`}
        >
          <Link
            to={`/${journal.author?.anonymousName || "anonymous"}/${
              journal.slug
            }`}
            className="block"
            aria-label={`Read story: ${journal.title}`}
          >
            {/* Thumbnail Section */}
            {thumbnail ? (
              <div className="relative h-52 overflow-hidden">
                <img
                  src={thumbnail}
                  alt={`Cover for ${journal.title}`}
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Reading time badge */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300 group-hover:scale-105">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span className="tracking-wide">{readingTime}</span>
                </div>
              </div>
            ) : (
              <div className="h-52 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_70%)]" />
                <div className="relative z-10 text-5xl opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                  📚
                </div>

                {/* Reading time badge for no-image state */}
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3 h-3" />
                  {readingTime}
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h2
                id={`journal-title-${journal._id}`}
                className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
              >
                {journal.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium opacity-90">
                {storyPreview}
              </p>

              {/* Author & Actions Section */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100/60 dark:border-gray-800/60">
                <button
                  className="flex items-center gap-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 rounded-xl px-3 py-2.5 -ml-3 transition-all duration-300 group/author"
                  onClick={handleAuthorClick}
                  aria-label={`View profile of ${
                    journal.author?.anonymousName || "Anonymous"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={getAvatarSvg(
                        journal.author?.profileTheme?.avatarStyle ||
                          "avataaars",
                        journal.author?.anonymousName || "Anonymous"
                      )}
                      alt={`Avatar of ${
                        journal.author?.anonymousName || "Anonymous"
                      }`}
                      className="w-9 h-9 rounded-full ring-2 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300 group-hover/author:ring-blue-300 dark:group-hover/author:ring-blue-600 group-hover/author:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-900 opacity-80"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors duration-200">
                      {journal.author?.anonymousName || "Anonymous"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                      {formatDistanceToNow(new Date(journal.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </button>

                {!hideStats && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/like ${
                        isLiked
                          ? "text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50/60 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      } ${
                        isLiking
                          ? "scale-95"
                          : "hover:scale-105 active:scale-95"
                      }`}
                      aria-label={isLiked ? "Unlike story" : "Like story"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 group-hover/like:scale-110 ${
                          isLiked ? "scale-110" : ""
                        }`}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                      <span className="min-w-[1rem] text-center tabular-nums">
                        {journal.likeCount || 0}
                      </span>
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`p-2.5 rounded-xl transition-all duration-300 group/save ${
                        isSavedProp
                          ? "text-blue-600 bg-blue-50/80 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                      } ${
                        isSaving
                          ? "scale-95"
                          : "hover:scale-110 active:scale-95"
                      }`}
                      aria-label={isSavedProp ? "Unsave story" : "Save story"}
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-all duration-300 group-hover/save:scale-110 ${
                          isSavedProp ? "scale-110" : ""
                        }`}
                        fill={isSavedProp ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </article>
        {modals}
      </>
    );
  }
);

JournalCard.displayName = "JournalCard";

export const JournalCardSkeleton = () => (
  <div
    className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
    role="status"
    aria-label="Loading story card"
  >
    {/* Skeleton Image */}
    <div className="h-52 bg-gradient-to-br from-gray-100/80 via-gray-200/60 to-gray-300/40 dark:from-gray-800/60 dark:via-gray-750/40 dark:to-gray-700/20 relative">
      <div className="absolute top-4 right-4 h-7 w-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full shadow-sm" />
    </div>

    {/* Skeleton Content */}
    <div className="p-6">
      {/* Skeleton Title */}
      <div className="mb-3 space-y-2">
        <div className="h-6 bg-gradient-to-r from-gray-200/80 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-800/40 w-5/6 rounded-lg" />
        <div className="h-6 bg-gradient-to-r from-gray-200/60 to-gray-300/40 dark:from-gray-700/40 dark:to-gray-800/20 w-2/3 rounded-lg" />
      </div>

      {/* Skeleton Description */}
      <div className="mb-6 space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200/70 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/30 w-full rounded-md" />
        <div className="h-4 bg-gradient-to-r from-gray-200/60 to-gray-300/40 dark:from-gray-700/40 dark:to-gray-800/20 w-4/5 rounded-md" />
        <div className="h-4 bg-gradient-to-r from-gray-200/50 to-gray-300/30 dark:from-gray-700/30 dark:to-gray-800/10 w-3/5 rounded-md" />
      </div>

      {/* Skeleton Author & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100/60 dark:border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gray-200/80 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-800/40 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gradient-to-r from-gray-200/70 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/30 rounded-md" />
            <div className="h-3 w-16 bg-gradient-to-r from-gray-200/60 to-gray-300/40 dark:from-gray-700/40 dark:to-gray-800/20 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-gradient-to-r from-gray-200/70 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl" />
          <div className="w-9 h-9 bg-gradient-to-br from-gray-200/70 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default JournalCard;
