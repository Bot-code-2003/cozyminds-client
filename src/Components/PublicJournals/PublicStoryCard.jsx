"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  MoreHorizontal,
  ThumbsUp,
  ArrowUpRight,
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

  const storyPreview = useMemo(() => {
    if (journal.category === 'story' && journal.metaDescription) {
      return journal.metaDescription;
    }
    if (!journal.content) return "No content available.";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.trim().substring(0, 120) + (text.length > 120 ? "…" : "");
  }, [journal.category, journal.metaDescription, journal.content]);

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

  const MetricButton = ({ icon: Icon, count, onClick, active = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-all duration-200 ${
        active
          ? "text-white bg-blue-600 hover:bg-blue-700"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{count}</span>
    </button>
  );

  // Fallback image for when no thumbnail is available
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='%236b7280' font-size='16' font-family='system-ui'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <>
      <article
        className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Overlay */}
        <div className="relative aspect-[3/4] overflow-hidden">
        <Link
  to={`${prefix}/${authorProfile?.anonymousName || "anonymous"}/${journal.slug}`}
  className="block"
  onClick={() => {
    window.scrollTo({ top: 0, left: 0 });
  }}
>

            <img
              src={thumbnail || fallbackImage}
              alt=""
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              onError={() => setImageError(true)}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Reading Time Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {readingTime}
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-white text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                {journal.title}
              </h2>
              
              {/* Description */}
              <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-3">
                {storyPreview}
              </p>
              
              {/* Author Info */}
              <div 
                className="flex items-center gap-2 cursor-pointer group/author mb-3"
                onClick={handleAuthorClick}
              >
                <img
                  src={getAvatarSvg(
                    authorProfile?.profileTheme?.avatarStyle || "avataaars",
                    authorProfile?.anonymousName || "Anonymous"
                  )}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white/50 group-hover/author:border-white transition-colors"
                />
                <div>
                  <div className="text-white text-sm font-medium group-hover/author:text-blue-200 transition-colors">
                    {authorProfile?.anonymousName || "Anonymous"}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {new Date(journal.createdAt).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              {journal.isPublic && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MetricButton
                      icon={ThumbsUp}
                      count={journal.likeCount || 0}
                      onClick={handleLike}
                      active={isLiked}
                    />
                    <MetricButton
                      icon={MessageCircle}
                      count={journal.commentCount || 0}
                      onClick={handleCommentClick}
                    />
                  </div>
                  
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isSavedProp
                        ? "text-yellow-400 bg-yellow-400/20"
                        : "text-white/70 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    <Bookmark 
                      className="w-4 h-4" 
                      fill={isSavedProp ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              )}
            </div>
          </Link>
        </div>
      </article>
      {modals}
    </>
  );
};

export default JournalCard;

export const PublicJournalCardSkeleton = () => (
  <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="aspect-[3/4] relative">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
      
      {/* Skeleton overlay content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Reading time skeleton */}
        <div className="absolute top-4 right-4">
          <div className="h-6 w-16 bg-white/20 rounded-full" />
        </div>
        
        {/* Title skeleton */}
        <div className="mb-2">
          <div className="h-6 w-4/5 bg-white/20 rounded-md mb-1" />
          <div className="h-6 w-3/5 bg-white/20 rounded-md" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-white/20 rounded-md" />
          <div className="h-4 w-4/5 bg-white/20 rounded-md" />
          <div className="h-4 w-3/5 bg-white/20 rounded-md" />
        </div>
        
        {/* Author skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <div>
            <div className="h-4 w-20 bg-white/20 rounded-md mb-1" />
            <div className="h-3 w-16 bg-white/20 rounded-md" />
          </div>
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-12 bg-white/20 rounded-md" />
            <div className="h-8 w-12 bg-white/20 rounded-md" />
          </div>
          <div className="h-8 w-8 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  </article>
);