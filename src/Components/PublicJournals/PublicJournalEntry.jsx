"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Share2,
  BarChart2,
  Tag,
  Loader2,
  Users,
  Calendar,
  Flame,
  Clock,
  Eye,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { usePublicJournals } from "../../context/PublicJournalsContext";
import AuthModals from "../Landing/AuthModals";
import Comments from "./Comments";
import { motion } from "framer-motion";
import PublicRecommendations from "./PublicRecommendations";

import { Helmet } from "react-helmet";
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs } from '@dicebear/collection';
import { getWithExpiry } from '../../utils/anonymousName';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const moodStyles = {
  Happy: {
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    emoji: "😄",
  },
  Neutral: {
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
    emoji: "😐",
  },
  Sad: {
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    emoji: "😔",
  },
  Angry: {
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
    emoji: "😡",
  },
  Anxious: {
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
    emoji: "😰",
  },
  Tired: {
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
    emoji: "🥱",
  },
  Reflective: {
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-200 dark:border-teal-800",
    emoji: "🤔",
  },
  Excited: {
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800",
    emoji: "🥳",
  },
  default: {
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800",
    emoji: "😶",
  },
};

const avatarStyles = {
  avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const AuthorCardSkeleton = () => (
  <div className="flex items-start gap-3 mb-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const PublicJournalEntry = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  // Use PublicJournals context for single journal fetching and state
  const { fetchSingleJournalBySlug, singleJournalLoading, singleJournalError, handleLike: contextHandleLike } =
    usePublicJournals();

  const [journal, setJournal] = useState(location.state?.journal || null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize current user
  const getCurrentUser = () => getWithExpiry('user');

  const isLoggedIn = useMemo(() => !!getCurrentUser(), []);

  // Use the context's fetchSingleJournalBySlug
  const loadJournal = useCallback(async () => {
    if (journal && journal.slug === slug) {
      return;
    }
    try {
      const entry = await fetchSingleJournalBySlug(slug);
      setJournal(entry);
    } catch (err) {
      console.error("Error loading journal:", err);
    }
  }, [slug, fetchSingleJournalBySlug, journal]);

  // Fetch author profile by userId (not authorName)
  const fetchAuthorProfile = useCallback(async () => {
    // Defensive: get userId as string
    let userId = null;
    if (journal?.userId) {
      userId = typeof journal.userId === 'object' ? journal.userId._id : journal.userId;
    }
    if (!userId) return;
    // If author is current user, use local storage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser._id === userId) {
      setAuthorProfile({
        userId: currentUser._id,
        anonymousName: currentUser.anonymousName,
        profileTheme: currentUser.profileTheme,
        bio: currentUser.bio,
      });
      return;
    }
    try {
      const response = await API.get(`/user/${userId}`);
      const author = response.data.user;
      setAuthorProfile({
        userId: author._id,
        anonymousName: author.anonymousName,
        profileTheme: author.profileTheme,
        bio: author.bio,
      });
      // Check subscription status
      if (getCurrentUser() && getCurrentUser()._id !== author._id) {
        const subResponse = await API.get(
          `/subscription-status/${getCurrentUser()._id}/${author._id}`
        );
        setIsSubscribed(subResponse.data.isSubscribed);
      }
    } catch (error) {
      setAuthorProfile(null);
    }
  }, [journal?.userId]);

  useEffect(() => {
    loadJournal();
  }, [slug, loadJournal]);

  useEffect(() => {
    fetchAuthorProfile();
  }, [fetchAuthorProfile]);

  useEffect(() => {
    if (journal && getCurrentUser()) {
      setIsLiked(journal.likes?.includes(getCurrentUser()._id) || false);
    }
  }, [journal, getCurrentUser]);

  useEffect(() => {
    if (journal && getCurrentUser()) {
      setIsSaved(Array.isArray(journal.saved) && journal.saved.includes(getCurrentUser()._id));
    }
  }, [journal, getCurrentUser]);

  // Scroll to top when component mounts or journal changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#comments") {
      let attempts = 0;
      const maxAttempts = 10;
      const intervalTime = 100; // milliseconds

      const scrollInterval = setInterval(() => {
        const el = document.getElementById("comments");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          clearInterval(scrollInterval);
        } else if (attempts >= maxAttempts) {
          clearInterval(scrollInterval);
        }
        attempts++;
      }, intervalTime);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLike = useCallback(async () => {
    if (!getCurrentUser()) {
      openLoginModal();
      return;
    }
    if (!journal) return;
    try {
      const updatedJournal = await contextHandleLike(journal);
      setJournal(updatedJournal);
      setIsLiked(updatedJournal.likes?.includes(getCurrentUser()._id) || false);
    } catch (error) {
      console.error("Error liking journal:", error);
    }
  }, [getCurrentUser, journal, openLoginModal, contextHandleLike]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  }, []);

  const handleSubscribe = useCallback(async () => {
    if (!getCurrentUser() || !authorProfile) return;

    try {
      setSubscribing(true);
      const response = await API.post("/subscribe", {
        subscriberId: getCurrentUser()._id,
        targetUserId: authorProfile.userId,
      });
      setIsSubscribed(response.data.subscribed);

      setAuthorProfile((prev) => ({
        ...prev,
        subscriberCount:
          prev.subscriberCount + (response.data.subscribed ? 1 : -1),
      }));
    } catch (error) {
      console.error("Error handling subscription:", error);
    } finally {
      setSubscribing(false);
    }
  }, [getCurrentUser, authorProfile]);

  const handleSave = useCallback(async () => {
    if (!getCurrentUser()) {
      openLoginModal();
      return;
    }
    try {
      // Call API to save/unsave
      if (!isSaved) {
        await API.post(`/users/${getCurrentUser()._id}/save-journal`, { journalId: journal._id });
        setIsSaved(true);
      } else {
        await API.post(`/users/${getCurrentUser()._id}/unsave-journal`, { journalId: journal._id });
        setIsSaved(false);
      }
    } catch (err) {
      console.error("Error saving/unsaving journal:", err);
    }
  }, [getCurrentUser, openLoginModal, isSaved, journal?._id]);

  const processContent = useCallback((content) => {
    if (!content) return "No content available.";

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        if (img.parentElement.classList.contains("full-width-image-container"))
          return;

        const container = document.createElement("div");
        container.className = "full-width-image-container";
        container.style.cssText = `
           position: relative;
           display: block;
           width: 100%;
           margin: 32px 0;
           border-radius: 12px;
           overflow: hidden;
           box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
           border: 1px solid rgba(156, 163, 175, 0.2);
         `;

        img.style.cssText = `
           width: 100%;
           height: auto;
           display: block;
           object-fit: contain;
           max-height: 600px;
           margin: 0 auto;
         `;

        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
      });

      return tempDiv.innerHTML;
    } catch (error) {
      console.error("Error processing content:", error);
      return content;
    }
  }, []);

  const moodStyle = useMemo(
    () =>
      journal?.mood
        ? moodStyles[journal.mood] || moodStyles.default
        : moodStyles.default,
    [journal?.mood]
  );

  const currentTheme = useMemo(() => {
    try {
      return getThemeDetails(journal?.theme);
    } catch (error) {
      console.error("Error getting theme details:", error);
      return { icon: "📝", dateIcon: "📅" };
    }
  }, [journal?.theme]);

  const readingTime = useMemo(() => {
    if (!journal?.content) return 0;
    const wordCount = journal.content.split(" ").length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [journal?.content]);

  const canSubscribe = useMemo(
    () => getCurrentUser() && authorProfile && authorProfile.userId && getCurrentUser()._id !== authorProfile.userId,
    [getCurrentUser, authorProfile]
  );

  const firstImage = useMemo(() => {
    if (!journal?.content) return null;
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = journal.content;
      const img = tempDiv.querySelector("img");
      return img?.src || null;
    } catch (error) {
      return null;
    }
  }, [journal?.content]);

  if (singleJournalLoading) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={getCurrentUser()}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="max-w-7xl w-full px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-black/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="w-full aspect-[3/2] sm:aspect-[16/9] bg-gray-200 dark:bg-gray-800 mb-6" />
                  {/* Title Skeleton */}
                  <div className="px-4 sm:px-8 pt-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                    {/* Meta Skeleton */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  {/* Content Skeleton */}
                  <div className="px-4 sm:px-6 pb-8">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/6" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Sidebar Skeleton */}
              <div className="hidden lg:block lg:col-span-1 h-fit">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/80 dark:bg-black/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                  <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (singleJournalError) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={getCurrentUser()}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Error Loading Journal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {singleJournalError}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!journal) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={getCurrentUser()}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Journal Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This journal entry doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{journal?.title ? `${journal.title} | Starlit Journals` : "Starlit Journals"}</title>
        <meta
          name="description"
          content={
            journal?.content
              ? journal.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 160) + "..."
              : "Read inspiring journal entries on Starlit Journals."
          }
        />
        <meta name="keywords" content={journal?.tags?.join(", ") || "journal, writing, reflection"} />
        <meta property="og:title" content={journal?.title || "Starlit Journals"} />
        <meta
          property="og:description"
          content={
            journal?.content
              ? journal.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 160) + "..."
              : "Read inspiring journal entries on Starlit Journals."
          }
        />
        <meta
          property="og:image"
          content={
            journal?.featuredImage || "https://starlitjournals.vercel.app/static/images/default-preview.jpg"
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`https://starlitjournals.vercel.app/journal/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Starlit Journals" />
      </Helmet>
      {isLoggedIn ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={getCurrentUser()}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      <div
        style={{ backgroundAttachment: "fixed" }}
        className={`min-h-screen ${isMobile ? 'bg-white dark:bg-black' : (journal.theme === 'theme_default' ? 'bg-white dark:bg-black' : getCardClass(journal.theme))} ${!isLoggedIn ? 'mt-16' : ''}`}
      >
        <div className="w-full sm:max-w-7xl mx-auto sm:px-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header Section */}
                <div className="p-4 sm:p-8 border-b border-black/5 dark:border-white/10">
                  {/* Back Button */}
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-4 sm:mb-6 transition-colors"
                    aria-label="Go back"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  {/* Image */}
                  {firstImage && (
                    <div className="w-full aspect-[3/2] sm:aspect-[16/9]  flex items-center rounded-apple justify-center overflow-hidden mb-4 sm:mb-6 shadow-sm">
                      <img
                        src={firstImage}
                        alt={journal.title || "Journal image"}
                        className="w-full h-full object-cover object-center rounded-apple"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-snug tracking-tight">
                    {journal.title || "Untitled Entry"}
                  </h1>

                  {/* Metadata & Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {/* Mood Badge */}
                    {journal.mood && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border ${moodStyle.borderColor} ${moodStyle.textColor} font-medium text-xs sm:text-sm shadow-sm`}
                        title={`Mood: ${journal.mood}`}
                        aria-label={`Mood: ${journal.mood}`}
                      >
                        <span className="text-sm sm:text-base">{moodStyle.emoji}</span>
                        <span>{journal.mood}</span>
                      </motion.div>
                    )}

                    {/* Date
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                      title={new Date(journal.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      aria-label={`Published on ${new Date(journal.createdAt).toLocaleString("en-US")}`}
                    >
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>
                        {new Date(journal.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </motion.div> */}

                    {/* Reading Time */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                      title={`${readingTime} minute read`}
                      aria-label={`${readingTime} minute read`}
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{readingTime}m</span>
                    </motion.div>

                    {/* Word Count */}
                    {journal.wordCount && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                        title={`${journal.wordCount} words`}
                        aria-label={`${journal.wordCount} words`}
                      >
                        <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{journal.wordCount}</span>
                      </motion.div>
                    )}

                    {/* Tags (limited to 3) */}
                    {journal.tags && journal.tags.length > 0 && (
                      <>
                        {journal.tags.slice(0, 3).map((tag, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                            title={`Tag: ${tag}`}
                            aria-label={`Tag: ${tag}`}
                          >
                            <Tag className="w-3 h-3" />
                            <span>#{tag}</span>
                          </motion.span>
                        ))}
                        {journal.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg">
                            +{journal.tags.length - 3}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {/* Author + Actions Bar */}
                <div className="mt-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Author Profile - Stacked */}
                    {!authorProfile ? (
                      <AuthorCardSkeleton />
                    ) : (
                      <div className="flex items-start gap-3 mb-3">
                        {authorProfile && (
                          <img src={getAvatarSvg(authorProfile.profileTheme?.avatarStyle, authorProfile.anonymousName)} alt={authorProfile.anonymousName} className="w-10 h-10 rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {authorProfile.anonymousName}
                          </h4>
                          {authorProfile.bio && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{authorProfile.bio}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons - Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {authorProfile && authorProfile.userId && (
                          <Link
                            to={`/profile/id/${authorProfile.userId}`}
                            className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                          >
                            Profile
                          </Link>
                        )}
                        {getCurrentUser() && authorProfile && authorProfile.userId && getCurrentUser()._id !== authorProfile.userId && canSubscribe && (
                          <button
                            onClick={handleSubscribe}
                            disabled={subscribing}
                            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                              isSubscribed
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {subscribing ? (
                              <Loader2 className="w-3 h-3 animate-spin inline-block" />
                            ) : isSubscribed ? (
                              "Following"
                            ) : (
                              "Follow"
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Share and Save buttons */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          onClick={handleLike}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            isLiked
                              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                              : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                          } focus:ring-2 ring-blue-500`}
                          title={isLiked ? "Unlike journal" : "Like journal"}
                          aria-label={isLiked ? "Unlike journal" : "Like journal"}
                        >
                          <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                        </motion.button>
                        <motion.button
                          onClick={handleShare}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200 focus:ring-2 ring-blue-500"
                          title="Share journal"
                          aria-label="Share journal"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={handleSave}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200 focus:ring-2 ring-blue-500"
                          title={isSaved ? "Unsave journal" : "Save journal"}
                          aria-label={isSaved ? "Unsave journal" : "Save journal"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    {/* Author Profile (left) */}
                    {!authorProfile ? (
                      <AuthorCardSkeleton />
                    ) : (
                      <div className="flex items-center gap-3 min-w-0">
                        {authorProfile && (
                          <img src={getAvatarSvg(authorProfile.profileTheme?.avatarStyle, authorProfile.anonymousName)} alt={authorProfile.anonymousName} className="w-9 h-9 rounded-full" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                            {authorProfile.anonymousName}
                          </h4>
                          {authorProfile.bio && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate line-clamp-1">{authorProfile.bio}</p>
                          )}
                        </div>
                        {authorProfile && authorProfile.userId && (
                          <Link
                            to={`/profile/id/${authorProfile.userId}`}
                            className="ml-2 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                          >
                            Profile
                          </Link>
                        )}
                        {getCurrentUser() && authorProfile && authorProfile.userId && getCurrentUser()._id !== authorProfile.userId && canSubscribe && (
                          <button
                            onClick={handleSubscribe}
                            disabled={subscribing}
                            className={`ml-2 px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                              isSubscribed
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {subscribing ? (
                              <Loader2 className="w-4 h-4 animate-spin inline-block" />
                            ) : isSubscribed ? (
                              "Following"
                            ) : (
                              "Follow"
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {/* Action Buttons (right) */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={handleLike}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full transition-all duration-200 min-h-12 ${
                          isLiked
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                        } focus:ring-2 ring-blue-500`}
                        title={isLiked ? "Unlike journal" : "Like journal"}
                        aria-label={isLiked ? "Unlike journal" : "Like journal"}
                      >
                        <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                      </motion.button>
                      <motion.button
                        onClick={handleShare}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200 min-h-12 focus:ring-2 ring-blue-500"
                        title="Share journal"
                        aria-label="Share journal"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={handleSave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-all duration-200 min-h-12 focus:ring-2 ring-blue-500"
                        title={isSaved ? "Unsave journal" : "Save journal"}
                        aria-label={isSaved ? "Unsave journal" : "Save journal"}
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>
                </div>
                </div>

                

                {/* Content Section - Reduced padding on mobile */}
                <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                  <div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-lg">
                    <div
                      className="journal-content-display"
                      dangerouslySetInnerHTML={{
                        __html: processContent(journal.content),
                      }}
                    />
                  </div>
                </div>

                <Comments
                  journalId={journal._id}
                  currentUser={getCurrentUser()}
                  onLoginRequired={openLoginModal}
                />
                {/* Recommendations for mobile (after comments) */}
                <div className="block lg:hidden mt-8">
                  <PublicRecommendations slug={journal.slug} />
                </div>
              </article>
            </div>

            {/* Right Sidebar: Recommendations (desktop only) */}
            <div className="hidden lg:block lg:col-span-1 h-fit">
              <PublicRecommendations slug={journal.slug} />
            </div>
          </div>
        </div>

        {/* Rich Text Content Styles */}
        <style jsx global>{`
          .journal-content-display {
            line-height: 1.8;
            color: rgb(17, 24, 39);
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .dark .journal-content-display {
            color: rgb(243, 244, 246);
          }

          .journal-content-display p {
            margin: 1.25rem 0;
            color: inherit;
          }

          .journal-content-display h1,
          .journal-content-display h2,
          .journal-content-display h3 {
            font-weight: 700;
            margin: 2rem 0 1rem 0;
            color: inherit;
            word-wrap: break-word;
          }

          .journal-content-display h1 {
            font-size: 2rem;
            line-height: 1.2;
          }

          .journal-content-display h2 {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .journal-content-display h3 {
            font-size: 1.25rem;
            line-height: 1.4;
          }

          .journal-content-display strong {
            font-weight: 700;
            color: inherit;
          }

          .journal-content-display em {
            font-style: italic;
          }

          .journal-content-display u {
            text-decoration: underline;
          }

          .journal-content-display ul,
          .journal-content-display ol {
            margin: 1.25rem 0;
            padding-left: 1.5rem;
          }

          .journal-content-display ul {
            list-style-type: disc;
          }

          .journal-content-display ol {
            list-style-type: decimal;
          }

          .journal-content-display li {
            margin: 0.5rem 0;
            line-height: 1.7;
          }

          .journal-content-display ul ul {
            list-style-type: circle;
          }

          .journal-content-display ul ul ul {
            list-style-type: square;
          }

          .journal-content-display blockquote {
            border-left: 4px solid #5b8a9e;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            background: rgba(59, 130, 246, 0.05);
            padding: 1.5rem;
            position: relative;
          }

          .journal-content-display code {
            background: rgba(156, 163, 175, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
            font-size: 0.875rem;
            border: 1px solid rgba(156, 163, 175, 0.2);
            word-break: break-all;
          }

          .journal-content-display pre {
            background: rgba(156, 163, 175, 0.1);
            padding: 1.5rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid rgba(156, 163, 175, 0.2);
          }

          .journal-content-display pre code {
            background: none;
            padding: 0;
            border: none;
            word-break: normal;
          }

          .journal-content-display a {
            color: #5b8a9e;
            text-decoration: underline;
            transition: opacity 0.2s;
            word-break: break-all;
          }

          .journal-content-display a:hover {
            opacity: 0.8;
          }

          /* Full-width image handling */
          .journal-content-display .full-width-image-container {
            position: relative;
            display: block;
            width: 100%;
            margin: 24px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.2);
            background: transparent;
          }

          .journal-content-display .full-width-image-container img {
            margin: 0 !important;
            display: block !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
            padding: 0 !important;
            max-height: 400px !important;
          }

          /* Recommendation content styling */
          .recommendation-content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.4;
          }

          .recommendation-content * {
            display: inline;
            margin: 0;
            padding: 0;
            border: 0;
            font-size: inherit;
            font: inherit;
            vertical-align: baseline;
          }

          .recommendation-content img,
          .recommendation-content figure {
            display: none;
          }

          .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          /* Dark mode adjustments for images */
          .dark .journal-content-display .full-width-image-container {
            border-color: rgba(75, 85, 99, 0.5);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .journal-content-display .full-width-image-container {
              margin: 16px 0 !important;
            }
          }
        `}</style>
      </div>
      {modals}
    </>
  );
};

export default PublicJournalEntry;
