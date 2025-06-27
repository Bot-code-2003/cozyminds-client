"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { usePublicJournals } from "../../context/PublicJournalsContext";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import PublicJournalCard, { PublicJournalCardSkeleton } from "./PublicJournalCard";
import Sidebar from "./Sidebar";
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
  Clock,
  Heart,
  X,
  Compass
} from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Header = ({ showFollowingOnly, isLoggedIn, onBackToAll }) => (
  <div className="mb-8">
    {showFollowingOnly && (
      <button
        onClick={onBackToAll}
        className="flex items-center gap-2 text-[var(--accent)] font-medium mb-6 transition-colors group"
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

const TagHeader = ({ tag, onClear }) => (
  <div className="mb-8">
    <button
      onClick={onClear}
      className="flex items-center gap-2 text-[var(--accent)] font-medium mb-6 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>Back to All Journals</span>
    </button>
    <div className="text-center">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 capitalize">
        Journals tagged with <span className="text-[var(--accent)]">#{tag.toLowerCase()}</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Exploring stories and thoughts about "{tag.toLowerCase()}" from our community.
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
  <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 mb-8 p-2">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side: Feed type and filters */}
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto">
        {isLoggedIn && (
          <div className="flex-shrink-0 flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
            <button
              onClick={() => showFollowingOnly && toggleFollowingOnly()}
              className={`flex-1 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                !showFollowingOnly
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => !showFollowingOnly && toggleFollowingOnly()}
              className={`flex-1 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap ${
                showFollowingOnly
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Following
            </button>
          </div>
        )}

        {!showFollowingOnly && (
          <div className="flex-shrink-0 flex items-center gap-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
            {[
              { type: "-createdAt", label: "Latest", icon: Clock },
              { type: "likeCount", label: "Popular", icon: Heart },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleFeedTypeChange(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  feedType === type
                    ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent)] to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
    <div className="flex flex-col items-center gap-4 bg-[var(--bg-primary)] px-8 py-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-[var(--accent)] opacity-20" />
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
    <div className="text-center p-8 bg-[var(--bg-primary)] rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 max-w-md">
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
        className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
      >
        Try Again
      </button>
    </div>
  </div>
);

const LoadMoreButton = ({ loadingMore, hasMore, onLoadMore }) => {
  if (!hasMore) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-3 px-10 py-8 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-xl animate-fadeIn">
          <span className="text-4xl mb-2">🎉</span>
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
            You've reached the end!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-2 max-w-xs">
            Thanks for exploring our community. Check back soon for more inspiring journals, or <Link to="/journaling-alt" className="text-[var(--accent)] underline hover:text-blue-600">start your own journal</Link> to inspire others!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mt-12 lg:mt-16">
      <button
        onClick={onLoadMore}
        disabled={loadingMore}
        className={`inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''}`}
        style={{ minWidth: 180 }}
      >
        {loadingMore ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading more journals...</span>
          </>
        ) : (
          <>
            <span>Load More</span>
            <svg className="w-5 h-5 ml-1 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </>
        )}
      </button>
    </div>
  );
};

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem('user');
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (item && item.value) return item.value;
    return item;
  } catch {
    return null;
  }
};

const PublicJournals = () => {
  const [hasSubscriptionNotifications, setHasSubscriptionNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    journals,
    loading,
    error,
    hasMore,
    loadingMore,
    likedJournals,
    feedType,
    showFollowingOnly,
    fetchJournals,
    handleLike,
    handleFeedTypeChange,
    toggleFollowingOnly,
    loadMore,
    selectedTag,
    handleTagSelect,
  } = usePublicJournals();

  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  const user = useMemo(() => getCurrentUser(), []);
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

  // Handle topic click from sidebar
  const handleTopicClick = useCallback((topic) => {
    // You can implement filtering by topic here
    // For now, we'll just log it. You can extend this to filter journals by topic
  }, []);

  // Handle writer click from sidebar
  const handleWriterClick = useCallback((writer) => {
    // You can implement navigation to writer's profile here
    // For now, we'll just log it. You can extend this to navigate to writer's profile
  }, []);

  // Handle apply filters from FilterSection
  const handleApplyFilters = useCallback((filters) => {
    fetchJournals(1, feedType, filters);
  }, [fetchJournals, feedType]);

  useEffect(() => {
    fetchJournals(1);
  }, []);

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
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {[...Array(4)].map((_, i) => (
            <PublicJournalCardSkeleton key={i} />
          ))}
        </div>
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
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      {modals}

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-all"
        aria-label="Open filters"
      >
        <Compass className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar (Off-canvas) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={() => setIsSidebarOpen(false)}>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed top-3 right-3 z-[10001] w-12 h-12 flex items-center justify-center rounded-full bg-white/95 dark:bg-gray-900/95 border border-gray-300 dark:border-gray-700 shadow-2xl text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 animate-float"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
            aria-label="Close sidebar"
          >
              <X className="w-7 h-7" />
          </button>
          <div
            className="fixed top-0 left-0 h-full w-full max-w-full bg-[var(--bg-primary)] shadow-lg overflow-y-auto p-0 animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              onTopicClick={(topic) => {
                handleTagSelect(topic);
                setIsSidebarOpen(false);
              }}
              onWriterClick={handleWriterClick}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-[var(--bg-primary)] ${!isLoggedIn ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <main className="md:col-span-8">
              {selectedTag ? (
                <TagHeader tag={selectedTag} onClear={() => fetchJournals(1, feedType, false)} />
              ) : (
                <>
                  <Header
                    showFollowingOnly={showFollowingOnly}
                    isLoggedIn={isLoggedIn}
                    onBackToAll={toggleFollowingOnly}
                  />
                  <ControlPanel
                    isLoggedIn={isLoggedIn}
                    showFollowingOnly={showFollowingOnly}
                    toggleFollowingOnly={toggleFollowingOnly}
                    feedType={feedType}
                    handleFeedTypeChange={handleFeedTypeChange}
                    hasNotifications={hasSubscriptionNotifications}
                  />
                </>
              )}
              
              {journals.length === 0 && !loading ? (
                <EmptyState showFollowingOnly={showFollowingOnly} toggleFollowingOnly={toggleFollowingOnly} isLoggedIn={isLoggedIn} />
              ) : (
                <div className="grid grid-cols-1 gap-6 items-stretch">
                  {journals.map((journal) => (
                    <div key={journal._id} className="h-full">
                      <PublicJournalCard
                        journal={journal}
                        onLike={() => handleLike(journal)}
                        onShare={handleShare}
                        isLiked={likedJournals.has(journal._id)}
                        isSaved={user && journal.saved && Array.isArray(journal.saved) ? journal.saved.includes(user._id) : false}
                        onSave={handleSave}
                      />
                    </div>
                  ))}
                </div>
              )}

              <LoadMoreButton
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </main>
            <aside className="hidden md:block md:col-span-4">
              <Sidebar
                onTopicClick={handleTagSelect}
                onWriterClick={handleWriterClick}
                isLoggedIn={isLoggedIn}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicJournals;