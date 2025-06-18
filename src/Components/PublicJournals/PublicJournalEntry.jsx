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
} from "lucide-react";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { usePublicJournals } from "../../context/PublicJournalsContext";
import AuthModals from "../Landing/AuthModals";
import Comments from "./Comments";
import { Helmet } from "react-helmet";

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

const PublicJournalEntry = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  // Use PublicJournals context for single journal fetching and state
  const { fetchSingleJournalBySlug, singleJournalLoading, singleJournalError } =
    usePublicJournals();

  const [journal, setJournal] = useState(location.state?.journal || null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Memoize current user
  const currentUser = useMemo(() => {
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, []);

  const isLoggedIn = useMemo(() => !!currentUser, [currentUser]);

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

  const fetchAuthorProfile = useCallback(async () => {
    if (!journal?.authorName) return;

    try {
      const response = await API.get(`/profile/${journal.authorName}`);
      setAuthorProfile(response.data.profile);

      // Check subscription status
      if (currentUser && currentUser._id !== response.data.profile._id) {
        const subResponse = await API.get(
          `/subscription-status/${currentUser._id}/${response.data.profile._id}`
        );
        setIsSubscribed(subResponse.data.isSubscribed);
      }
    } catch (error) {
      console.error("Error fetching author profile:", error);
    }
  }, [journal?.authorName, currentUser]);

  useEffect(() => {
    loadJournal();
  }, [slug, loadJournal]);

  useEffect(() => {
    fetchAuthorProfile();
  }, [fetchAuthorProfile]);

  useEffect(() => {
    if (journal && currentUser) {
      setIsLiked(journal.likes?.includes(currentUser._id) || false);
    }
  }, [journal, currentUser]);

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

  const handleLike = useCallback(async () => {
    if (!currentUser) {
      openLoginModal();
      return;
    }

    if (!journal) return;

    try {
      const response = await API.post(`/journals/${journal._id}/like`, {
        userId: currentUser._id,
      });

      setJournal((prev) => ({
        ...prev,
        likes: response.data.isLiked
          ? [...prev.likes, currentUser._id]
          : prev.likes.filter((id) => id !== currentUser._id),
        likeCount: response.data.likeCount,
      }));
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error liking journal:", error);
    }
  }, [currentUser, journal, openLoginModal]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  }, []);

  const handleSubscribe = useCallback(async () => {
    if (!currentUser || !authorProfile) return;

    try {
      setSubscribing(true);
      const response = await API.post("/subscribe", {
        subscriberId: currentUser._id,
        targetUserId: authorProfile._id,
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
  }, [currentUser, authorProfile]);

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
    () => currentUser && authorProfile && currentUser._id !== authorProfile._id,
    [currentUser, authorProfile]
  );

  if (singleJournalLoading) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={currentUser}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Loading journal...
              </p>
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
            user={currentUser}
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
            user={currentUser}
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
          user={currentUser}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      <div
        style={{ backgroundAttachment: "fixed" }}
        className={`mt-16 min-h-screen bg-gray-50 dark:bg-gray-900 ${getCardClass(
          journal.theme
        )}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                    {journal.title || "Untitled Entry"}
                  </h1>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Mood Badge */}
                    {journal.mood && (
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${moodStyle.bgColor} ${moodStyle.textColor} ${moodStyle.borderColor} font-medium text-sm`}
                      >
                        <span className="text-base">{moodStyle.emoji}</span>
                        <span>{journal.mood}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(journal.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Reading Time */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      <span>{readingTime} min read</span>
                    </div>

                    {/* Word Count */}
                    {journal.wordCount && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium">
                        <BarChart2 size={16} />
                        <span>{journal.wordCount} words</span>
                      </div>
                    )}
                  </div>

                  {/* Tags Section */}
                  {journal.tags && journal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {journal.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <Tag size={12} />
                          <span>#{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 group/like bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2"
                    >
                      <Heart
                        className={`w-5 h-5 transition-transform duration-300 group-hover/like:scale-110 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {journal.likes?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 group/share bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2"
                    >
                      <Share2 className="w-5 h-5 transition-transform duration-300 group-hover/share:scale-110" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
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

                  {/* Mobile Author Card - Only visible on mobile */}
                  <div className="lg:hidden mt-8">
                    {authorProfile && (
                      <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                            {authorProfile.anonymousName?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                              {authorProfile.anonymousName}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {authorProfile.subscriberCount || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                {authorProfile.currentStreak || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {authorProfile.bio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {authorProfile.bio}
                          </p>
                        )}

                        <div className="flex gap-2">
                          {canSubscribe && (
                            <button
                              onClick={handleSubscribe}
                              disabled={subscribing}
                              className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                isSubscribed
                                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                  : "bg-red-500 text-white hover:bg-red-600"
                              } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {subscribing ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>...</span>
                                </div>
                              ) : isSubscribed ? (
                                "Subscribed"
                              ) : (
                                "Subscribe"
                              )}
                            </button>
                          )}
                          <Link
                            to={`/profile/${authorProfile.anonymousName}`}
                            className="px-3 py-2 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            Profile
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <Comments
                  journalId={journal._id}
                  currentUser={currentUser}
                  onLoginRequired={openLoginModal}
                />
              </article>
            </div>

            {/* Sidebar - Author Profile */}
            <div className="hidden lg:block lg:col-span-1 h-fit">
              <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
                {!authorProfile ? (
                  // Skeleton Loading State
                  <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="animate-pulse">
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

                      {/* Author Info Skeleton */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                        </div>
                      </div>

                      {/* Stats Grid Skeleton */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2"></div>
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2"></div>
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                        </div>
                      </div>

                      {/* Join Date Skeleton */}
                      <div className="text-center mb-6">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                      </div>

                      {/* Action Buttons Skeleton */}
                      <div className="space-y-3">
                        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/70 dark:bg-black/70 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
                      About the Author
                    </h3>

                    {/* Author Info */}
                    <Link
                      to={`/profile/${authorProfile.anonymousName}`}
                      className="block group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 -m-4 transition-colors mb-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                          {authorProfile.anonymousName
                            ?.charAt(0)
                            .toUpperCase() || "A"}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                            {authorProfile.anonymousName}
                          </h4>

                          {/* Bio */}
                          {authorProfile.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                              {authorProfile.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {authorProfile.subscriberCount || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Subscribers
                        </p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <Flame className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {authorProfile.currentStreak || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Day Streak
                        </p>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(authorProfile.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {canSubscribe && (
                        <button
                          onClick={handleSubscribe}
                          disabled={subscribing}
                          className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            isSubscribed
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                              : "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl"
                          } ${
                            subscribing ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {subscribing ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>...</span>
                            </div>
                          ) : isSubscribed ? (
                            "Subscribed"
                          ) : (
                            "Subscribe"
                          )}
                        </button>
                      )}

                      <Link
                        to={`/profile/${authorProfile.anonymousName}`}
                        className="block w-full px-4 py-3 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
