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
    const [authorProfile, setAuthorProfile] = useState(journal.author || null);
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
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

    const storyPreview = useMemo(() => {
      if (journal.category === "story" && journal.metaDescription) {
        return journal.metaDescription;
      }
      if (!journal.content) return "Discover what happens in this story...";

      const parser = new DOMParser();
      const doc = parser.parseFromString(journal.content, "text/html");
      const text = doc.body.textContent || "";
      const preview = text.trim().substring(0, 150);
      return preview + (text.length > 150 ? "..." : "");
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
          className={`group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 ${
            isHovered ? "shadow-md" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="article"
          aria-labelledby={`journal-title-${journal._id}`}
        >
          <Link
            to={`/${authorProfile?.anonymousName || "anonymous"}/${
              journal.slug
            }`}
            className="block"
            aria-label={`Read story: ${journal.title}`}
          >
            {/* Thumbnail Section */}
            {thumbnail ? (
              <div className="relative h-56 overflow-hidden">
                <img
                  src={thumbnail}
                  alt={`Cover for ${journal.title}`}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-gray-900/60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime}
                </div>
              </div>
            ) : (
              <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
            )}

            {/* Content Section */}
            <div className="p-4">
              {/* Title */}
              <h2
                id={`journal-title-${journal._id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
              >
                {journal.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {storyPreview}
              </p>

              {/* Author and Stats */}
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1 transition-colors"
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
                    className="w-7 h-7 rounded-full"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {authorProfile?.anonymousName || "Anonymous"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
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
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
                        isLiked
                          ? "text-red-500 bg-red-50 dark:bg-red-900/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                      }`}
                      aria-label={isLiked ? "Unlike story" : "Like story"}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isLiked ? "currentColor" : "none"}
                      />
                      <span>{journal.likeCount || 0}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`p-1 rounded-md transition-colors ${
                        isSavedProp
                          ? "text-blue-500 bg-blue-50 dark:bg-blue-900/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      }`}
                      aria-label={isSavedProp ? "Unsave story" : "Save story"}
                    >
                      <Bookmark
                        className="w-4 h-4"
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
    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse"
    role="status"
    aria-label="Loading story card"
  >
    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
    <div className="p-4">
      <div className="mb-3 h-5 bg-gray-200 dark:bg-gray-700 w-3/4 rounded" />
      <div className="mb-3 space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-5/6 rounded" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-3/4 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="space-y-1">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

export default JournalCard;
