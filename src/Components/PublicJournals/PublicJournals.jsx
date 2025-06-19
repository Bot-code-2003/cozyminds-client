"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { usePublicJournals } from "../../context/PublicJournalsContext";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import PublicJournalCard from "./PublicJournalCard";
import FilterSection from "./FilterSection";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  AlertCircle,
  Users,
  ArrowLeft,
  BookOpen,
  Bell,
  Filter,
  Grid,
  List,
} from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Header = ({ showFollowingOnly, isLoggedIn, onBackToAll }) => (
  <div className="mb-8">
    {showFollowingOnly && (
      <button
        onClick={onBackToAll}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to All Journals</span>
      </button>
    )}

    <div className="text-center mb-8">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {showFollowingOnly ? "Your Feed" : "Discover Journals"}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {showFollowingOnly
          ? "Latest posts from writers you follow"
          : "Explore stories and thoughts from our vibrant community of writers"}
      </p>
    </div>
  </div>
);
const ControlPanel = ({
  isLoggedIn,
  showFollowingOnly,
  toggleFollowingOnly,
  feedType,
  handleFeedTypeChange,
  hasNotifications,
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
    {/* Mobile Layout */}
    <div className="block lg:hidden">
      {/* Top Section - Feed Toggle (if logged in) */}
      {isLoggedIn && (
        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex gap-1 bg-gray-50 dark:bg-slate-700 rounded-xl p-1">
            
            <button
              onClick={() => showFollowingOnly && toggleFollowingOnly()}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                !showFollowingOnly
                  ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              All Journals
            </button>
            <button
              onClick={() => !showFollowingOnly && toggleFollowingOnly()}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                showFollowingOnly
                  ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Following
            </button>
          </div>
        </div>
      )}

      {/* Bottom Section - Filters and Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Filter Section - Only show when not in following mode */}
          <div className="flex-1">
            {!showFollowingOnly && (
              <FilterSection
                feedType={feedType}
                handleFeedTypeChange={handleFeedTypeChange}
              />
            )}
          </div>

          {/* User Actions - Compact mobile version */}
          {isLoggedIn && (
            <div className="flex gap-2 ml-4">
              <Link
                to="/subscriptions"
                className="flex items-center justify-center w-10 h-10 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 relative"
              >
                <Users className="w-4 h-4" />
                {hasNotifications && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </Link>
              
              <Link
                to="/journaling-alt"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden lg:block p-6">
      <div className="flex items-center justify-between">
        {/* Left side - Feed Controls */}
        <div className="flex items-center gap-6">
          {/* Feed Toggle Buttons */}
          {isLoggedIn && (
            <div className="flex gap-2">
              <button
                onClick={toggleFollowingOnly}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showFollowingOnly
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Following
              </button>
              <button
                onClick={toggleFollowingOnly}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !showFollowingOnly
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                All Journals
              </button>
            </div>
          )}

          {/* Filter Section - Only show when not in following mode */}
          {!showFollowingOnly && (
            <FilterSection
              feedType={feedType}
              handleFeedTypeChange={handleFeedTypeChange}
            />
          )}
        </div>

        {/* Right side - User Actions */}
        {isLoggedIn && (
          <div className="flex gap-3">
            <Link
              to="/subscriptions"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 font-medium relative"
            >
              <Users className="w-4 h-4" />
              <span>Subscriptions</span>
              {hasNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </Link>
            
            <Link
              to="/journaling-alt"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Write</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);
const EmptyState = ({ showFollowingOnly, toggleFollowingOnly, isLoggedIn }) => (
  <div className="text-center py-20">
    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
      <span className="text-5xl">{showFollowingOnly ? "👥" : "📖"}</span>
    </div>

    <div className="max-w-md mx-auto space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {showFollowingOnly
          ? "No posts from your follows"
          : "No public journals yet"}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {showFollowingOnly
          ? "The writers you follow haven't posted anything yet. Explore all journals to discover new voices and stories."
          : "Be the first to share your thoughts with the community and inspire others to start their journaling journey!"}
      </p>

      {showFollowingOnly && (
        <div className="pt-4">
          <button
            onClick={toggleFollowingOnly}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explore All Journals</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 px-8 py-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-500 opacity-20" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Loading journals
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Discovering amazing stories for you...
        </p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 max-w-md">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>

      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {error}
      </p>

      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
      >
        Try Again
      </button>
    </div>
  </div>
);

const LoadMoreButton = ({ loadingMore, hasMore, onLoadMore }) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <span className="text-2xl">🎉</span>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              You've reached the end!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thanks for exploring our community
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingMore) {
    return (
      <div className="text-center mt-12 lg:mt-16">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Loading more journals...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mt-12 lg:mt-16">
      <button
        onClick={onLoadMore}
        className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-lg"
      >
        <span>Load More Journals</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-current rounded-full opacity-60" />
          <div className="w-1 h-1 bg-current rounded-full opacity-40" />
          <div className="w-1 h-1 bg-current rounded-full opacity-20" />
        </div>
      </button>
    </div>
  );
};

const PublicJournals = () => {
  const [hasSubscriptionNotifications, setHasSubscriptionNotifications] = useState(false);

  const {
    journals,
    loading,
    loadingMore,
    error,
    likedJournals,
    hasMore,
    feedType,
    showFollowingOnly,
    fetchJournals,
    handleLike,
    handleFeedTypeChange,
    toggleFollowingOnly,
    loadMore,
  } = usePublicJournals();

  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  const user = useMemo(() => {
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, []);

  const isLoggedIn = !!user;

  // Fetch subscription notifications
  const fetchSubscriptionNotifications = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await API.get(`/subscriptions/${user._id}`);
      const subscriptions = response.data.subscriptions || [];
      const hasNotifications = subscriptions.some((sub) => sub.hasNewContent);
      setHasSubscriptionNotifications(hasNotifications);
    } catch (error) {
      console.error("Error fetching subscription notifications:", error);
    }
  }, [user]);

  const handleShare = useCallback(
    (journalId) => {
      const journal = journals.find((j) => j._id === journalId);
      if (journal) {
        const url = `${window.location.origin}/publicjournal/${journal.slug}`;
        navigator.clipboard.writeText(url);
      }
    },
    [journals]
  );

  const handleBackToAll = useCallback(() => {
    if (showFollowingOnly) {
      toggleFollowingOnly();
    }
  }, [showFollowingOnly, toggleFollowingOnly]);

  const handleSave = useCallback(async (journalId, shouldSave, setIsSaved) => {
    if (!user) {
      openLoginModal();
      return;
    }
    try {
      if (shouldSave) {
        await API.post(`/users/${user._id}/save-journal`, { journalId });
        setIsSaved(true);
      } else {
        await API.post(`/users/${user._id}/unsave-journal`, { journalId });
        setIsSaved(false);
      }
      // Optionally update local state for instant feedback
      // setJournals((prev) => prev.map(j => j._id === journalId ? { ...j, isSaved: shouldSave } : j));
    } catch (err) {
      // Optionally show error
      console.error('Error saving/unsaving journal:', err);
    }
  }, [user, openLoginModal]);

  useEffect(() => {
    fetchJournals(1);
  }, [fetchJournals]);

  // Re-fetch journals when user logs in
  useEffect(() => {
    const handleUserLoggedIn = () => {
      fetchJournals(1);
    };
    window.addEventListener("user-logged-in", handleUserLoggedIn);
    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
    };
  }, [fetchJournals]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSubscriptionNotifications();
    }
  }, [isLoggedIn, fetchSubscriptionNotifications]);

  if (loading && !loadingMore) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <LoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <ErrorState error={error} onRetry={() => fetchJournals(1)} />
      </>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}

      <div className={`min-h-screen bg-[var(--bg-primary)] ${!isLoggedIn ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Header
            showFollowingOnly={showFollowingOnly}
            isLoggedIn={isLoggedIn}
            onBackToAll={handleBackToAll}
          />

          <ControlPanel
            isLoggedIn={isLoggedIn}
            showFollowingOnly={showFollowingOnly}
            toggleFollowingOnly={toggleFollowingOnly}
            feedType={feedType}
            handleFeedTypeChange={handleFeedTypeChange}
            hasNotifications={hasSubscriptionNotifications}
          />

          {journals.length === 0 ? (
            <EmptyState
              showFollowingOnly={showFollowingOnly}
              toggleFollowingOnly={toggleFollowingOnly}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <>
              {/* Journal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {journals.map((journal) => (
                  <div key={journal._id} className="h-full">
                    <PublicJournalCard
                      journal={journal}
                      onLike={handleLike}
                      onShare={handleShare}
                      isLiked={likedJournals.has(journal._id)}
                      isSaved={user && journal.saved && Array.isArray(journal.saved) ? journal.saved.includes(user._id) : false}
                      onSave={handleSave}
                    />
                  </div>
                ))}
              </div>

              <LoadMoreButton
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </>
          )}
        </div>
        {modals}
      </div>
    </>
  );
};

export default PublicJournals;