"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../Dashboard/Navbar";
import {
  Bookmark,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Heart,
} from "lucide-react";
import JournalCard, { JournalCardSkeleton } from "./PublicStoryCard";
import { useDarkMode } from "../../context/ThemeContext";
import axios from "axios";

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

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

console.log("👉 Current user in SavedEntries:", getCurrentUser());

const SavedEntries = () => {
  const [savedJournals, setSavedJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedJournals, setLikedJournals] = useState(new Set());
  const [savedJournalIds, setSavedJournalIds] = useState(new Set());

  const { darkMode } = useDarkMode();
  const user = useMemo(() => getCurrentUser(), []);

  const fetchSavedJournals = useCallback(
    async (pageNum = 1, append = false) => {
      if (!user?._id) {
        setError("Please log in to view saved entries");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/journals/saved/${user._id}`, {
          params: {
            page: pageNum,
            limit: 12,
          },
        });

        console.log("Raw API response:", response.data);

        const { journals, hasMore: moreAvailable } = response.data;

        // Use journal.author directly
        const transformedJournals = journals.map((journal) => ({
          ...journal,
          author: journal.author
            ? {
                _id: journal.author.userId, // Use userId from author
                anonymousName: journal.author.anonymousName,
                profileTheme: journal.author.profileTheme,
              }
            : null,
        }));

        if (append) {
          setSavedJournals((prev) => [...prev, ...transformedJournals]);
        } else {
          setSavedJournals(transformedJournals);
        }

        setHasMore(moreAvailable);
        setPage(pageNum);

        const savedIds = new Set(transformedJournals.map((j) => j._id));
        setSavedJournalIds(savedIds);
      } catch (err) {
        console.error("Error fetching saved journals:", err);
        setError(err.response?.data?.message || "Failed to load saved entries");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user?._id]
  );

  // Load more journals
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchSavedJournals(page + 1, true);
    }
  }, [fetchSavedJournals, page, hasMore, loadingMore]);

  // Handle like functionality
  const handleLike = useCallback(
    async (journal) => {
      if (!user) return;

      try {
        const isCurrentlyLiked = likedJournals.has(journal._id);
        const response = await API.post(`/journals/${journal._id}/like`);

        if (response.status === 200) {
          setLikedJournals((prev) => {
            const newSet = new Set(prev);
            if (isCurrentlyLiked) {
              newSet.delete(journal._id);
            } else {
              newSet.add(journal._id);
            }
            return newSet;
          });

          // Update the journal's like count in the saved journals
          setSavedJournals((prev) =>
            prev.map((j) =>
              j._id === journal._id
                ? {
                    ...j,
                    likeCount: isCurrentlyLiked
                      ? (j.likeCount || 1) - 1
                      : (j.likeCount || 0) + 1,
                  }
                : j
            )
          );
        }
      } catch (error) {
        console.error("Error liking journal:", error);
      }
    },
    [user, likedJournals]
  );

  // Handle save/unsave functionality
  const handleSave = useCallback(
    async (journalId, shouldSave) => {
      if (!user) return;

      try {
        const response = await API.post(`/journals/${journalId}/save`);

        if (response.status === 200) {
          if (!shouldSave) {
            // Remove from saved journals if unsaving
            setSavedJournals((prev) => prev.filter((j) => j._id !== journalId));
            setSavedJournalIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(journalId);
              return newSet;
            });
          }
        }
      } catch (error) {
        console.error("Error saving/unsaving journal:", error);
      }
    },
    [user]
  );

  // Retry loading
  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setSavedJournals([]);
    setPage(1);
    setHasMore(true);
    fetchSavedJournals(1, false);
  }, [fetchSavedJournals]);

  // Initial load
  useEffect(() => {
    fetchSavedJournals();
  }, [fetchSavedJournals]);

  // Loading state
  if (loading && savedJournals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
              <Bookmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto animate-pulse" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <JournalCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to Load Saved Entries
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (savedJournals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl mb-8">
              <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Saved Stories Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Start exploring and save stories you'd like to read later. Your
              saved stories will appear here.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Bookmark className="w-4 h-4" />
              <span>Tip: Click the bookmark icon on any story to save it</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar name="New Entry" link="/journaling-alt" />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
            <Bookmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Saved Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {savedJournals.length}{" "}
            {savedJournals.length === 1 ? "story" : "stories"} saved for later
            reading
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {savedJournals.map((journal) => (
            <JournalCard
              key={journal._id}
              journal={journal}
              onLike={handleLike}
              isLiked={likedJournals.has(journal._id)}
              isSaved={savedJournalIds.has(journal._id)}
              onSave={handleSave}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={`inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 ${
                loadingMore
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:scale-[1.02]"
              }`}
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading more stories...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Load More Stories
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading More Skeletons */}
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <JournalCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedEntries;
