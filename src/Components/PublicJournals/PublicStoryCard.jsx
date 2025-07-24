"use client";

import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  ({ journal, onLike, isLiked, isSaved: isSavedProp, onSave }) => {
    const [imageError, setImageError] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [authorProfile, setAuthorProfile] = useState(journal.author || null);

    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useDarkMode();
    const { modals, openLoginModal } = AuthModals({ darkMode });

    const user = useMemo(() => getCurrentUser(), []);

    const prefix = location.pathname.startsWith("/stories")
      ? "/stories"
      : "/journals";

    const thumbnail = useMemo(() => {
      if (!journal.content || imageError) return null;

      // Try journal thumbnail first
      if (journal.thumbnail) return journal.thumbnail;

      // Parse HTML content for first valid image
      const parser = new DOMParser();
      const doc = parser.parseFromString(journal.content, "text/html");
      const img = doc.querySelector("img[src]");

      // Validate image URL
      if (img?.src) {
        try {
          new URL(img.src);
          return img.src;
        } catch {
          return null;
        }
      }
      return null;
    }, [journal.thumbnail, journal.content, imageError]);

    const storyPreview = useMemo(() => {
      if (journal.category === "story" && journal.metaDescription) {
        return journal.metaDescription;
      }
      if (!journal.content) return "No content available.";

      const parser = new DOMParser();
      const doc = parser.parseFromString(journal.content, "text/html");
      const text = doc.body.textContent || "";
      return text.trim().substring(0, 120) + (text.length > 120 ? "…" : "");
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

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          if (!journal.userId) {
            setAuthorProfile(null);
            return;
          }

          const authorId =
            typeof journal.userId === "object"
              ? journal.userId._id
              : journal.userId;

          if (user && user._id === authorId) {
            setAuthorProfile({
              userId: user._id,
              anonymousName: user.anonymousName,
              profileTheme: user.profileTheme,
            });
            return;
          }

          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/${authorId}`,
            { timeout: 5000 }
          );
          const author = res.data.user;
          setAuthorProfile({
            userId: author._id,
            anonymousName: author.anonymousName,
            profileTheme: author.profileTheme,
          });
        } catch (error) {
          console.error("Failed to fetch author profile:", error);
          setAuthorProfile(null);
        }
      };
      fetchProfile();
    }, [journal.userId, user]);

    const handleAuthorClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (authorProfile?.userId) {
          navigate(`/profile/id/${authorProfile.userId}`);
        }
      },
      [navigate, authorProfile]
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
          className="group py-4 sm:py-6 md:py-8 border-b border-gray-200 dark:border-gray-800 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
          role="article"
          aria-labelledby={`journal-title-${journal._id}`}
        >
          <Link
            to={`/${authorProfile?.anonymousName || "anonymous"}/${
              journal.slug
            }`}
            className="block"
            aria-label={`Read journal: ${journal.title}`}
          >
            <div className="flex flex-col sm:flex-row sm:gap-4 md:gap-6">
              {/* Content Section */}
              <div className="flex-1 min-w-0">
                {/* Author Info */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden transition-all hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-700 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleAuthorClick}
                    aria-label={`View profile of ${
                      authorProfile?.anonymousName || "Anonymous"
                    }`}
                  >
                    <img
                      src={getAvatarSvg(
                        authorProfile?.profileTheme?.avatarStyle || "avataaars",
                        authorProfile?.anonymousName || "Anonymous"
                      )}
                      alt={`Avatar of ${
                        authorProfile?.anonymousName || "Anonymous"
                      }`}
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <button
                        className="font-medium text-gray-900 dark:text-white hover:underline truncate max-w-[150px] sm:max-w-[200px] focus:outline-none focus:underline"
                        onClick={handleAuthorClick}
                        aria-label={`View profile of ${
                          authorProfile?.anonymousName || "Anonymous"
                        }`}
                      >
                        {authorProfile?.anonymousName || "Anonymous"}
                      </button>
                      <span className="text-gray-400 hidden sm:inline">·</span>
                      <time className="whitespace-nowrap">
                        {formatDistanceToNow(new Date(journal.createdAt), {
                          addSuffix: true,
                        })}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Category Tag */}
                {journal.tags && journal.tags.length > 0 && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded">
                      {journal.tags[0]}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2
                  id={`journal-title-${journal._id}`}
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2"
                >
                  {journal.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                  {storyPreview}
                </p>

                {/* Meta and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    <span>{readingTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isLiked
                          ? "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      aria-label={isLiked ? "Unlike journal" : "Like journal"}
                    >
                      <Heart
                        className="w-3 h-3"
                        fill={isLiked ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                      <span>{journal.likeCount || 0}</span>
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`p-1.5 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSavedProp
                          ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      aria-label={
                        isSavedProp ? "Unsave journal" : "Save journal"
                      }
                    >
                      <Bookmark
                        className="w-3 h-3"
                        fill={isSavedProp ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              {thumbnail && (
                <div className="w-full sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 mt-4 sm:mt-0 flex-shrink-0">
                  <div className="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded">
                    <img
                      src={thumbnail}
                      alt={`Thumbnail for ${journal.title}`}
                      className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-105"
                      onError={() => setImageError(true)}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
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
    className="py-4 sm:py-6 md:py-8 border-b border-gray-200 dark:border-gray-800 animate-pulse"
    role="status"
    aria-label="Loading journal card"
  >
    <div className="flex flex-col sm:flex-row sm:gap-4 md:gap-6">
      <div className="flex-1 min-w-0">
        {/* Author skeleton */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden sm:block" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Category skeleton */}
        <div className="mb-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="mb-2 space-y-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 w-5/6 rounded" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 w-3/4 rounded" />
        </div>

        {/* Description skeleton */}
        <div className="mb-3 sm:mb-4 space-y-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-4/5 rounded" />
        </div>

        {/* Meta skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Thumbnail skeleton */}
      <div className="w-full sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 mt-4 sm:mt-0 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

export default JournalCard;
