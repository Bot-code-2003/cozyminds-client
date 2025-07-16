"use client";
import { useEffect, useCallback, useMemo, useState } from "react";
import { usePublicStories } from "../../context/PublicStoriesContext";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import PublicJournalCard, { PublicJournalCardSkeleton } from "./PublicJournalCard";
import Sidebar from "./Sidebar";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/LandingNavbar";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Loader2, AlertCircle, Users, ArrowLeft, BookOpen, Bell, Filter, Grid, List, Clock, Heart, X, Compass } from 'lucide-react';
import { Helmet } from "react-helmet";
import { CheckCircle } from 'lucide-react';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Header = ({ showFollowingOnly, isLoggedIn, onBackToAll, category }) => (
  <div className="mb-8">
    {showFollowingOnly && (
      <button
        onClick={onBackToAll}
        className="flex items-center gap-2 text-[var(--accent)] font-medium mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to All Stories</span>
      </button>
    )}
    <div className="text-center mb-8">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {showFollowingOnly ? "Your Feed" : "Discover Stories"}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {showFollowingOnly
          ? "Latest stories from writers you follow"
          : "Explore captivating stories and narratives from our creative community"}
      </p>
    </div>
  </div>
);

const TagHeader = ({ tag, onClear, category }) => (
  <div className="mb-8">
    <button
      onClick={onClear}
      className="flex items-center gap-2 text-[var(--accent)] font-medium mb-6 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>Back to All Stories</span>
    </button>
    <div className="text-center">
      <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 capitalize">
        Stories tagged with <span className="text-[var(--accent)]">#{tag.toLowerCase()}</span>
      </h1>
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
      <span className="text-5xl">{showFollowingOnly ? "👥" : "📚"}</span>
    </div>
    <div className="max-w-md mx-auto space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {showFollowingOnly ? "No stories from your follows" : "No public stories yet"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {showFollowingOnly
          ? "The writers you follow haven't posted any stories yet. Explore all stories to discover new voices and narratives."
          : "Be the first to share your story with the community and inspire others to start their storytelling journey!"}
      </p>
      {showFollowingOnly && (
        <div className="pt-4">
          <button
            onClick={toggleFollowingOnly}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent)] to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explore All Stories</span>
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
          Loading stories
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
      <div className="flex justify-center py-12 transition-colors duration-200">
        <div className="flex flex-col items-center gap-3 px-6 py-8 border-2 border-[var(--border)] rounded-xl border border-gray-100 dark:border-gray-700 max-w-sm w-full">
          <CheckCircle className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">
            All Done!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Explore more stories, or{' '}
            <Link
              to="/journaling-alt"
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              create your own
            </Link>.
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
        className={`inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 font全世界

        font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''}`}
        style={{ minWidth: 180 }}
      >
        {loadingMore ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading more...</span>
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
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem("user");
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
};

const PublicStories = () => {
  const [hasSubscriptionNotifications, setHasSubscriptionNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    stories,
    loading,
    error,
    likedStories,
    savedStories,
    hasMore,
    loadingMore,
    feedType,
    showFollowingOnly,
    fetchStories,
    handleLike,
    handleSave,
    setFeedType,
    setShowFollowingOnly,
    fetchStoriesByTag,
    handleFeedTypeChange,
    toggleFollowingOnly,
    loadMore,
    selectedTag,
    handleTagSelect,
    resetForNewCategory,
  } = usePublicStories();

  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const user = useMemo(() => getCurrentUser(), []);
  const isLoggedIn = !!user;
  const location = useLocation();

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
    (storyId) => {
      const story = stories.find((s) => s._id === storyId);
      if (story) {
        const url = `${window.location.origin}/stories/${story.userId.anonymousName}/${story.slug}`;
        navigator.clipboard.writeText(url);
      }
    },
    [stories]
  );

  const handleBackToAll = useCallback(() => {
    if (showFollowingOnly) {
      toggleFollowingOnly();
    }
  }, [showFollowingOnly, toggleFollowingOnly]);

  const handleTopicClick = useCallback((topic) => {
    handleTagSelect(topic);
    setIsSidebarOpen(false);
  }, [handleTagSelect]);

  const handleWriterClick = useCallback((writer) => {
    // Navigation to writer's profile can be implemented here
  }, []);

  // Reset and fetch stories when component mounts
  useEffect(() => {
    resetForNewCategory();
    fetchStories(1, feedType, false);
  }, [resetForNewCategory, fetchStories, feedType]);

  // Re-fetch stories when user logs in
  useEffect(() => {
    const handleUserLoggedIn = () => {
      fetchStories(1, feedType, false);
    };
    window.addEventListener("user-logged-in", handleUserLoggedIn);
    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
    };
  }, [fetchStories, feedType]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSubscriptionNotifications();
    }
  }, [isLoggedIn, fetchSubscriptionNotifications]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      if (selectedTag) {
        fetchStoriesByTag(selectedTag, Math.floor(stories.length / 20) + 1, true);
      } else {
        loadMore();
      }
    }
  }, [hasMore, loadingMore, selectedTag, fetchStoriesByTag, stories.length, loadMore]);

  const handleCustomFeedTypeChange = useCallback((newFeedType) => {
    if (newFeedType !== feedType) {
      setFeedType(newFeedType);
      fetchStories(1, newFeedType, false);
    }
  }, [feedType, fetchStories, setFeedType]);

  const handleCustomToggleFollowing = useCallback(() => {
    const newShowFollowingOnly = !showFollowingOnly;
    setShowFollowingOnly(newShowFollowingOnly);
    fetchStories(1, feedType, false);
  }, [showFollowingOnly, feedType, fetchStories, setShowFollowingOnly]);

  const handleTagClear = useCallback(() => {
    fetchStories(1, feedType, false);
  }, [fetchStories, feedType]);

  if (loading && !loadingMore) {
    return (
      <>
        <Helmet>
          <title>Read Public Stories | Anonymous Confessions & Stories</title>
          <meta name="description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta name="keywords" content="read public stories, public diaries, anonymous confessions, share secrets, online diary, confession stories, mental health, anonymous blog, community stories" />
          <meta property="og:title" content="Read Public Stories | Anonymous Confessions & Stories" />
          <meta property="og:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://starlitjournals.com${location.pathname}`} />
          <meta property="og:image" content="/public/andy_the_sailor.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Read Public Stories | Anonymous Confessions & Stories" />
          <meta name="twitter:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta name="twitter:image" content="/public/andy_the_sailor.png" />
        </Helmet>
        {isLoggedIn ? (
          <Navbar name="New Story" link="/journaling-alt" />
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
        <Helmet>
          <title>Read Public Stories | Anonymous Confessions & Stories</title>
          <meta name="description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta name="keywords" content="read public stories, public diaries, anonymous confessions, share secrets, online diary, confession stories, mental health, anonymous blog, community stories" />
          <meta property="og:title" content="Read Public Stories | Anonymous Confessions & Stories" />
          <meta property="og:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://starlitjournals.com${location.pathname}`} />
          <meta property="og:image" content="/public/andy_the_sailor.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Read Public Stories | Anonymous Confessions & Stories" />
          <meta name="twitter:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
          <meta name="twitter:image" content="/public/andy_the_sailor.png" />
        </Helmet>
        {isLoggedIn ? (
          <Navbar name="New Story" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <ErrorState error={error} onRetry={() => fetchStories(1, feedType, false)} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Read Public Stories | Anonymous Confessions & Stories</title>
        <meta name="description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
        <meta name="keywords" content="read public stories, public diaries, anonymous confessions, share secrets, online diary, confession stories, mental health, anonymous blog, community stories" />
        <meta property="og:title" content="Read Public Stories | Anonymous Confessions & Stories" />
        <meta property="og:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://starlitjournals.com${location.pathname}`} />
        <meta property="og:image" content="/public/andy_the_sailor.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Read Public Stories | Anonymous Confessions & Stories" />
        <meta name="twitter:description" content="Explore and read public stories from real people. Join a safe, anonymous community to share your own story or discover others'." />
        <meta name="twitter:image" content="/public/andy_the_sailor.png" />
      </Helmet>
      {isLoggedIn ? (
        <Navbar name="New Story" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      {modals}

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-all"
        aria-label="Open filters"
      >
        <Compass className="w-6 h-6" />
      </button>

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
                handleTopicClick(topic);
                setIsSidebarOpen(false);
              }}
              onWriterClick={handleWriterClick}
              isLoggedIn={isLoggedIn}
              category="story"
            />
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-[var(--bg-primary)] ${!isLoggedIn ? 'pt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <main className="md:col-span-8">
              {selectedTag ? (
                <TagHeader 
                  tag={selectedTag} 
                  onClear={handleTagClear} 
                  category="story"
                />
              ) : (
                <>
                  <Header
                    showFollowingOnly={showFollowingOnly}
                    isLoggedIn={isLoggedIn}
                    onBackToAll={handleBackToAll}
                    category="story"
                  />
                  <ControlPanel
                    isLoggedIn={isLoggedIn}
                    showFollowingOnly={showFollowingOnly}
                    toggleFollowingOnly={handleCustomToggleFollowing}
                    feedType={feedType}
                    handleFeedTypeChange={handleCustomFeedTypeChange}
                    hasNotifications={hasSubscriptionNotifications}
                  />
                </>
              )}
              
              {stories.length === 0 && !loading ? (
                <EmptyState 
                  showFollowingOnly={showFollowingOnly} 
                  toggleFollowingOnly={handleCustomToggleFollowing} 
                  isLoggedIn={isLoggedIn} 
                  category="story"
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 items-stretch">
                  {stories.map((story) => (
                    <div key={story._id} className="h-full">
                      <PublicJournalCard
                        journal={story}
                        onLike={() => handleLike(story)}
                        onShare={handleShare}
                        isLiked={likedStories.has(story._id)}
                        isSaved={savedStories.has(story._id)}
                        onSave={() => handleSave(story._id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <LoadMoreButton
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                category="story"
              />
            </main>

            <aside className="hidden md:block md:col-span-4">
              <Sidebar
                onTopicClick={handleTopicClick}
                onWriterClick={handleWriterClick}
                isLoggedIn={isLoggedIn}
                category="story"
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicStories;