"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  MoreHorizontal,
  ThumbsUp, // Add ThumbsUp icon
} from "lucide-react";
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
    if (item && item.value) return item.value;
    return item;
  } catch {
    return null;
  }
};

const JournalCard = ({
  journal,
  onLike,
  isLiked,
  isSaved: isSavedProp,
  onSave,
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

  // Determine prefix based on current route
  const prefix = location.pathname.startsWith("/stories") ? "/stories" : "/journals";

  const thumbnail = useMemo(() => {
    if (journal.thumbnail && !imageError) return journal.thumbnail;
    if (!journal.content || imageError) return null;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const img = tempDiv.querySelector("img");
    return img?.src || null;
  }, [journal.thumbnail, journal.content, imageError]);

  const textPreview = useMemo(() => {
    if (!journal.content) return "No content available.";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.trim().substring(0, 200) + (text.length > 200 ? "…" : "");
  }, [journal.content]);

  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(journal.createdAt), {
        addSuffix: true,
      });
    } catch {
      return "some time ago";
    }
  }, [journal.createdAt]);

  const readingTime = useMemo(() => {
    if (!journal.content) return "1 min read";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  }, [journal.content]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (
        journal.userId &&
        typeof journal.userId === "object" &&
        journal.userId !== null
      ) {
        // If this is the logged-in user, use local storage for anonymousName/profileTheme
        if (user && user._id === journal.userId._id) {
          setAuthorProfile({
            userId: user._id,
            anonymousName: user.anonymousName,
            profileTheme: user.profileTheme,
          });
        } else {
          setAuthorProfile({
            userId: journal.userId._id,
            anonymousName: journal.userId.anonymousName,
            profileTheme: journal.userId.profileTheme,
          });
        }
        return;
      }

      const authorId = journal.userId;
      if (!authorId) return;

      if (user && user._id === authorId) {
        setAuthorProfile({
          userId: user._id,
          anonymousName: user.anonymousName,
          profileTheme: user.profileTheme,
        });
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${authorId}`
        );
        const author = res.data.user;
        setAuthorProfile({
          userId: author._id,
          anonymousName: author.anonymousName,
          profileTheme: author.profileTheme,
        });
      } catch {
        setAuthorProfile(null);
      }
    };
    fetchProfile();
  }, [journal.userId, user]);

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/id/${authorProfile.userId}`);
  };

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) return openLoginModal();

      setIsLiking(true);
      try {
        await onLike(journal);
      } catch (error) {
        // Handle error
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
        // Handle error
      } finally {
        setIsSaving(false);
      }
    },
    [user, onSave, journal._id, isSavedProp, openLoginModal]
  );

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/public-journals/${journal.slug}#comments`);
  };

  const ActionButton = ({
    icon: Icon,
    value,
    active,
    onClick,
    disabled,
    "aria-label": ariaLabel,
    fillOnActive = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group/btn flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 disabled:opacity-50 ${
        active
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
      aria-label={ariaLabel}
    >
      <Icon
        className={`w-4 h-4 transition-all duration-200 ${
          active ? "scale-105" : "group-hover/btn:scale-110"
        }`}
        fill={active && fillOnActive ? "currentColor" : "none"}
      />
      {value !== null && (
        <span className="text-sm font-medium">{value}</span>
      )}
    </button>
  );

  return (
    <>
      <article
        className="group pb-2 relative bg-[var(--bg-primary)] rounded-2xl border-b border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`${prefix}/${authorProfile?.anonymousName || "anonymous"}/${journal.slug}`}
          className="block"
        >
          <div
            className={`${
              thumbnail ? "flex flex-col lg:flex-row" : "flex flex-col"
            } gap-6`}
          >
            {/* Content Section */}
            <div className={`${thumbnail ? "lg:flex-1" : "w-full"} min-w-0`}>
              {/* Author Info */}
              <div
                className="flex items-center gap-3 mb-4 cursor-pointer"
                onClick={handleAuthorClick}
              >
                <img
                  src={getAvatarSvg(
                    authorProfile?.profileTheme?.avatarStyle || "avataaars",
                    authorProfile?.anonymousName || "Anonymous"
                  )}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {authorProfile?.anonymousName || "Anonymous"}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {readingTime}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                {journal.title}
              </h2>

              {/* Preview */}
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed line-clamp-3 mb-6">
                {textPreview}
              </p>

              {/* Bottom Actions Row */}
              {journal.isPublic && (
                <div className="flex items-center justify-between mt-4">
                  {/* Left: Date, Likes, Comments */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(journal.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {journal.likeCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {journal.commentCount || 0}
                    </span>
                  </div>
                  {/* Right: Save Button */}
                  <div>
                    <ActionButton
                      icon={(props) => <Bookmark {...props} className="w-5 h-5" />} // Make save icon bigger
                      value={null}
                      active={isSavedProp}
                      onClick={handleSave}
                      disabled={isSaving}
                      aria-label={isSavedProp ? "Unsave journal" : "Save journal"}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Image Section */}
            {thumbnail && (
              <div className="lg:w-80 lg:flex-shrink-0">
                <div className="aspect-[16/10] lg:aspect-[4/3] h-48 lg:h-56 relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                  <img
                    src={thumbnail}
                    alt=""
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isHovered ? "scale-105" : "scale-100"
                    }`}
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )}
          </div>
        </Link>
      </article>
      {modals}
    </>
  );
};

export default JournalCard;

export const PublicJournalCardSkeleton = () => (
  <article className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Content Section Skeleton */}
      <div className="lg:flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
          </div>
        </div>

        <div className="h-7 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
        <div className="h-6 w-3/5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />

        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-9 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-9 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>

      {/* Image Section Skeleton */}
      <div className="lg:w-80 lg:flex-shrink-0">
        <div className="aspect-[16/10] lg:aspect-[4/3] h-48 lg:h-56 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </article>
);