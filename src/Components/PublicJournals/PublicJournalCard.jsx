"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";

const PublicJournalCard = ({ journal, onLike, isLiked, isSaved: isSavedProp, onSave }) => {
  const [imageError, setImageError] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(journal.likeCount || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [localIsSaved, setLocalIsSaved] = useState(isSavedProp);

  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  
  useEffect(() => { setLocalIsLiked(isLiked); }, [isLiked]);
  useEffect(() => { setLocalIsSaved(isSavedProp); }, [isSavedProp]);
  useEffect(() => { setLocalLikesCount(journal.likeCount || 0); }, [journal.likeCount]);

  const firstImage = useMemo(() => {
    if (!journal.content || imageError) return null;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const img = tempDiv.querySelector("img");
    return img?.src || null;
  }, [journal.content, imageError]);

  const textPreview = useMemo(() => {
    if (!journal.content) return "No content available.";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.trim().substring(0, 200) + (text.length > 200 ? "..." : "");
  }, [journal.content]);

  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(journal.createdAt), { addSuffix: true });
    } catch {
      return "some time ago";
    }
  }, [journal.createdAt]);

  const handleLike = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return openLoginModal();
    
    setIsLiking(true);
    const newLikedState = !localIsLiked;
    setLocalIsLiked(newLikedState);
    setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await onLike(journal._id);
    } catch (error) {
      setLocalIsLiked(!newLikedState);
      setLocalLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  }, [onLike, journal._id, user, openLoginModal, localIsLiked]);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return openLoginModal();
    setIsSaving(true);
    const newSavedState = !localIsSaved;
    setLocalIsSaved(newSavedState);
    try {
      await onSave(journal._id, newSavedState);
    } catch (error) {
      setLocalIsSaved(!newSavedState);
    } finally {
      setIsSaving(false);
    }
  }, [user, onSave, journal._id, localIsSaved, openLoginModal]);

  const StatIcon = ({ icon: Icon, value, active, onClick, disabled, 'aria-label': ariaLabel }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 text-sm transition-colors duration-200 disabled:opacity-50 ${
        active ? 'text-[var(--accent)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
      aria-label={ariaLabel}
    >
      <Icon className="w-4 h-4" />
      {value !== null && <span className="font-medium">{value}</span>}
    </button>
  );

  return (
    <>
      <Link to={`/public-journal/${journal.slug}`} className=" group block mb-8">
        <div className={`grid ${firstImage ? 'grid-cols-1  md:grid-cols-3' : 'grid-cols-1'} gap-8 items-center`}>
          {/* Text Content */}
          <div className={`${firstImage ? 'md:col-span-2' : 'col-span-1'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                {journal.authorName?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{journal.authorName || 'Anonymous'}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors duration-200">
              {journal.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-base line-clamp-3">
              {textPreview}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <StatIcon 
                  icon={Heart} 
                  value={localLikesCount} 
                  active={localIsLiked}
                  onClick={handleLike}
                  disabled={isLiking}
                  aria-label={`Like journal, currently ${localLikesCount} likes`}
                />
                <StatIcon 
                  icon={MessageCircle} 
                  value={journal.commentCount || 0}
                  aria-label={`View comments, currently ${journal.commentCount || 0} comments`}
                />
                <StatIcon
                  icon={Bookmark}
                  value={null}
                  active={localIsSaved}
                  onClick={handleSave}
                  disabled={isSaving}
                  aria-label={localIsSaved ? "Unsave journal" : "Save journal"}
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          
          {/* Image Content */}
          {firstImage && (
            <div className="col-span-1 h-52 md:h-full w-full">
              <img
                src={firstImage}
                alt=""
                className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>
        <hr className="mt-8 border-1 border-[var(--border)]" />
      </Link>
      {modals}
    </>
  );
};

export default PublicJournalCard;

export const PublicJournalCardSkeleton = () => (
  <div className="group block mb-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      {/* Text Content Skeleton */}
      <div className="md:col-span-2 col-span-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      {/* Image Content Skeleton */}
      <div className="col-span-1 h-52 md:h-full w-full">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700" />
      </div>
    </div>
    <hr className="mt-8 border-1 border-[var(--border)]" />
  </div>
);