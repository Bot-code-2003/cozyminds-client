"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bookmark, Clock } from "lucide-react";
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

    const avatarUrl = getAvatarSvg(
      journal.author?.profileTheme?.avatarStyle || "avataaars",
      journal.author?.anonymousName || "Anonymous"
    );

    return (
      <>
        <article className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
            style={{
              backgroundImage: `url(${
                thumbnail ||
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%236366f1;stop-opacity:0.3' /><stop offset='100%' style='stop-color:%238b5cf6;stop-opacity:0.3' /></linearGradient></defs><rect width='400' height='300' fill='%23f8fafc' /><rect width='400' height='300' fill='url(%23grad)' /><text x='200' y='150' text-anchor='middle' fill='%2364748b' font-size='48' opacity='0.3'>📚</text></svg>"
              })`,
            }}
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Author Info - Top */}
          <button
            className="absolute top-4 left-4 z-20 flex items-center gap-3 hover:bg-black/30 rounded-xl px-3 py-2 -ml-3 transition-all duration-300 group/author"
            onClick={handleAuthorClick}
            aria-label={`View profile of ${
              journal.author?.anonymousName || "Anonymous"
            }`}
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={`${journal.author?.anonymousName || "Anonymous"}'s avatar`}
                className="w-10 h-10 rounded-full border-2 border-white/80 shadow-lg backdrop-blur-sm bg-white/10 group-hover/author:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="text-white">
              <div className="font-semibold text-sm drop-shadow-lg group-hover/author:text-blue-200 transition-colors duration-200">
                {journal.author?.anonymousName || "Anonymous"}
              </div>
              <div className="text-xs text-left text-white/80 font-medium">
                {formatDistanceToNow(new Date(journal.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </button>

          {/* Actions - Top Right */}
          {!hideStats && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 backdrop-blur-sm ${
                  isLiked
                    ? "text-white bg-red-500/80 border border-red-400/50 shadow-lg"
                    : "text-white/90 bg-black/40 border border-white/20 hover:bg-red-500/60"
                } ${isLiking ? "scale-95" : "hover:scale-105 active:scale-95"}`}
                aria-label={isLiked ? "Unlike story" : "Like story"}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    isLiked ? "scale-[1.02]" : ""
                  }`}
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span className="tabular-nums min-w-[1rem] text-center">
                  {journal.likeCount || 0}
                </span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isSavedProp
                    ? "text-white bg-blue-500/80 border border-blue-400/50 shadow-lg"
                    : "text-white/90 bg-black/40 border border-white/20 hover:bg-blue-500/60"
                } ${isSaving ? "scale-95" : "hover:scale-105 active:scale-95"}`}
                aria-label={isSavedProp ? "Unsave story" : "Save story"}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    isSavedProp ? "scale-[1.02]" : ""
                  }`}
                  fill={isSavedProp ? "currentColor" : "none"}
                />
              </button>
            </div>
          )}

          {/* Title and Content - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
            <h2 className="text-xl font-bold mb-2 line-clamp-2 leading-tight drop-shadow-lg group-hover:text-blue-200 transition-colors duration-300">
              {journal.title}
            </h2>

            {/* Reading Time */}
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{readingTime}</span>
            </div>
          </div>

          {/* Hover Effect Shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
          </div>

          {/* Link Overlay */}
          <Link
            to={`/${journal.author?.anonymousName || "anonymous"}/${
              journal.slug
            }`}
            className="absolute inset-0 z-10"
            aria-label={`Read ${journal.title} by ${
              journal.author?.anonymousName || "Anonymous"
            }`}
          />
        </article>
        {modals}
      </>
    );
  }
);

JournalCard.displayName = "JournalCard";

export const JournalCardSkeleton = () => (
  <div
    className="h-80 rounded-2xl overflow-hidden animate-pulse bg-gradient-to-br from-gray-200/80 via-gray-300/60 to-gray-400/40 dark:from-gray-700/60 dark:via-gray-800/40 dark:to-gray-900/20 relative"
    role="status"
    aria-label="Loading story card"
  >
    {/* Skeleton Author */}
    <div className="absolute top-4 left-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-gray-600/60" />
      <div className="space-y-1.5">
        <div className="h-3 w-20 bg-white/60 dark:bg-gray-600/60 rounded" />
        <div className="h-2.5 w-16 bg-white/40 dark:bg-gray-700/40 rounded" />
      </div>
    </div>

    {/* Skeleton Actions */}
    <div className="absolute top-4 right-4 flex gap-2">
      <div className="h-7 w-12 bg-white/60 dark:bg-gray-600/60 rounded-full" />
      <div className="w-7 h-7 bg-white/60 dark:bg-gray-600/60 rounded-full" />
    </div>

    {/* Skeleton Title */}
    <div className="absolute bottom-6 left-6 right-6 space-y-3">
      <div className="space-y-2">
        <div className="h-5 bg-white/70 dark:bg-gray-600/70 rounded w-5/6" />
        <div className="h-5 bg-white/60 dark:bg-gray-700/60 rounded w-3/4" />
      </div>
      <div className="h-4 w-20 bg-white/50 dark:bg-gray-700/50 rounded" />
    </div>
  </div>
);

export default JournalCard;
