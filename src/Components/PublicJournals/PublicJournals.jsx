"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Clock, Heart, Eye, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JournalCard, { JournalCardSkeleton } from "./PublicStoryCard";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { createAvatar } from "@dicebear/core";
import { Link } from "react-router-dom";
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

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

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

// Tag Filter Component
const TagFilters = memo(({ tags, selectedTag, onTagSelect }) => {
  const navigate = useNavigate();

  const handleTagClick = useCallback(
    (tag) => {
      if (tag) {
        navigate(`/tag/${tag.toLowerCase()}`, {
          state: { contentType: "journals" },
        });
      }
    },
    [navigate]
  );

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4 pt-2 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => onTagSelect(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !selectedTag
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-label="Show all journals"
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Filter by ${tag} tag`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

TagFilters.displayName = "TagFilters";

// Main PublicJournals Component
const PublicJournals = () => {
  const [featuredJournals, setFeaturedJournals] = useState([]);
  const [latestJournals, setLatestJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [likedJournals, setLikedJournals] = useState(new Set());
  const [savedJournals, setSavedJournals] = useState(new Set());

  const popularTags = [
    "Personal",
    "Reflection",
    "Life",
    "Growth",
    "Thoughts",
    "Experience",
    "Daily",
    "Mindfulness",
  ];
  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  const getCurrentUser = useCallback(() => {
    try {
      const itemStr = localStorage.getItem("user");
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      return item?.value || item;
    } catch {
      return null;
    }
  }, []);

  const getThumbnail = useCallback((journal) => {
    if (!journal.content) return null;
    if (journal.thumbnail) {
      try {
        new URL(journal.thumbnail);
        return journal.thumbnail;
      } catch {
        return null;
      }
    }
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
    return null;
  }, []);

  // Fetch featured journals
  const fetchFeaturedJournals = useCallback(async () => {
    try {
      const response = await API.get("/journals/top-liked", { timeout: 5000 });
      setFeaturedJournals(response.data.journals || []);
    } catch (error) {
      console.error("Error fetching featured journals:", error);
    }
  }, []);

  // Fetch latest journals
  const fetchLatestJournals = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);

        const params = {
          page: pageNum,
          limit: 12,
          sort: "-createdAt",
          category: "journal",
        };

        if (selectedTag) {
          params.tag = selectedTag;
        }

        const endpoint = selectedTag
          ? `/journals/by-tag/${encodeURIComponent(selectedTag)}`
          : "/journals/public";
        const response = await API.get(endpoint, { params, timeout: 5000 });

        const newJournals = response.data.journals || [];

        if (append) {
          setLatestJournals((prev) => [...prev, ...newJournals]);
        } else {
          setLatestJournals(newJournals);
        }

        setHasMore(response.data.hasMore);
        setPage(pageNum);

        const user = getCurrentUser();
        if (user) {
          const liked = new Set(
            newJournals
              .filter((journal) => journal.likes?.includes(user._id))
              .map((journal) => journal._id)
          );
          const saved = new Set(
            newJournals
              .filter((journal) => user.savedEntries?.includes(journal._id))
              .map((journal) => journal._id)
          );

          if (append) {
            setLikedJournals((prev) => new Set([...prev, ...liked]));
            setSavedJournals((prev) => new Set([...prev, ...saved]));
          } else {
            setLikedJournals(liked);
            setSavedJournals(saved);
          }
        }
      } catch (error) {
        console.error("Error fetching journals:", error);
        setError("Failed to fetch journals");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedTag, getCurrentUser]
  );

  // Handle like
  const handleLike = useCallback(
    async (journal) => {
      const user = getCurrentUser();
      if (!user) {
        openLoginModal();
        return;
      }

      const journalId = journal._id;
      const isCurrentlyLiked = likedJournals.has(journalId);

      setLikedJournals((prev) => {
        const newSet = new Set(prev);
        isCurrentlyLiked ? newSet.delete(journalId) : newSet.add(journalId);
        return newSet;
      });

      const updateJournal = (journals) =>
        journals.map((j) =>
          j._id === journalId
            ? { ...j, likeCount: j.likeCount + (isCurrentlyLiked ? -1 : 1) }
            : j
        );

      setFeaturedJournals(updateJournal);
      setLatestJournals(updateJournal);

      try {
        await API.post(`/journals/${journalId}/like`, { userId: user._id });
      } catch (error) {
        setLikedJournals((prev) => {
          const newSet = new Set(prev);
          isCurrentlyLiked ? newSet.add(journalId) : newSet.delete(journalId);
          return newSet;
        });
        setFeaturedJournals(updateJournal);
        setLatestJournals(updateJournal);
        console.error("Error liking journal:", error);
      }
    },
    [likedJournals, getCurrentUser, openLoginModal]
  );

  // Handle save
  const handleSave = useCallback(
    async (journalId, isSaved) => {
      const user = getCurrentUser();
      if (!user) {
        openLoginModal();
        return;
      }

      setSavedJournals((prev) => {
        const newSet = new Set(prev);
        isSaved ? newSet.add(journalId) : newSet.delete(journalId);
        return newSet;
      });

      try {
        await API.post(`/journals/${journalId}/save`, { userId: user._id });
      } catch (error) {
        setSavedJournals((prev) => {
          const newSet = new Set(prev);
          isSaved ? newSet.delete(journalId) : newSet.add(journalId);
          return newSet;
        });
        console.error("Error saving journal:", error);
      }
    },
    [savedJournals, getCurrentUser, openLoginModal]
  );

  // Handle tag selection
  const handleTagSelect = useCallback(
    (tag) => {
      setSelectedTag(tag);
      setPage(1);
      fetchLatestJournals(1, false);
    },
    [fetchLatestJournals]
  );

  // Load more journals
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchLatestJournals(page + 1, true);
    }
  }, [hasMore, loadingMore, page, fetchLatestJournals]);

  // Initial load
  useEffect(() => {
    fetchFeaturedJournals();
    fetchLatestJournals();
  }, [fetchFeaturedJournals, fetchLatestJournals]);

  if (loading && !loadingMore) {
    return (
      <div className="min-h-[50vh] bg-gray-50 dark:bg-gray-900">
        <TagFilters
          tags={popularTags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <JournalCardSkeleton key={i} />
            ))}
          </div>
        </div>
        {modals}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchLatestJournals();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Retry loading journals"
          >
            Try Again
          </button>
        </div>
        {modals}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TagFilters
        tags={popularTags}
        selectedTag={selectedTag}
        onTagSelect={handleTagSelect}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Journals Section */}
        {!selectedTag && featuredJournals.length > 0 && (
          <section className="mb-12" aria-labelledby="featured-journals">
            <div className="flex max-w-3xl mx-auto items-center gap-4 my-8 ">
              <div className="flex-1 h-[0.5px] bg-gray-300" />
              <h2 className="text-2xl  text-gray-900 whitespace-nowrap">
                Featured Journals
              </h2>
              <div className="flex-1 h-[0.5px] bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 h-auto sm:h-[500px] lg:h-[600px]">
              {featuredJournals.map((journal, index) => {
                const isLarge = index === 0;
                const isMedium = index === 1;
                const thumbnail = getThumbnail(journal);
                const avatarStyle =
                  journal.author?.profileTheme?.avatarStyle || "avataaars";
                const avatarSeed = journal.author?.anonymousName || "Anonymous";
                const avatarUrl = getAvatarSvg(avatarStyle, avatarSeed);

                return (
                  <div
                    key={journal._id}
                    className={`
                      group rounded-lg relative overflow-hidden bg-gray-900 border border-gray-800 hover:shadow-lg transition-all duration-300
                      ${isLarge ? "sm:col-span-2 sm:row-span-2" : ""}
                      ${isMedium ? "lg:col-span-2" : ""}
                    `}
                    role="article"
                    aria-labelledby={`featured-journal-${journal._id}`}
                  >
                    {thumbnail && (
                      <div className="absolute inset-0">
                        <img
                          src={thumbnail}
                          alt={`Thumbnail for ${journal.title}`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                    )}

                    <div
                      className={`
                        relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between text-white
                        ${isLarge ? "p-6 sm:p-8" : "p-4 sm:p-6"}
                      `}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={avatarUrl}
                            alt={`Avatar of ${
                              journal.author?.anonymousName || "Anonymous"
                            }`}
                            className="w-6 h-6 rounded-full border border-white/20"
                            loading="lazy"
                          />
                          <span className="text-sm font-medium text-white/90 truncate max-w-[150px] sm:max-w-[200px]">
                            {journal.author?.anonymousName || "Anonymous"}
                          </span>
                        </div>

                        <h3
                          id={`featured-journal-${journal._id}`}
                          className={`
                            font-bold leading-tight mb-2 line-clamp-3 text-white
                            ${
                              isLarge
                                ? "text-xl sm:text-2xl"
                                : "text-base sm:text-lg"
                            }
                          `}
                        >
                          {journal.title}
                        </h3>

                        {isLarge && (
                          <p className="text-sm leading-relaxed line-clamp-3 mb-4 text-white/80">
                            {journal.metaDescription ||
                              (journal.content
                                ? journal.content
                                    .replace(/<[^>]*>/g, "")
                                    .substring(0, 120) + "..."
                                : "No preview available")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <Heart
                              className="w-4 h-4 text-white/80"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-white/80">
                              {journal.likeCount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye
                              className="w-4 h-4 text-white/80"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-white/80">
                              {journal.commentCount || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLike(journal);
                            }}
                            className={`
                              p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                              ${
                                likedJournals.has(journal._id)
                                  ? "bg-red-500 text-white"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }
                            `}
                            aria-label={
                              likedJournals.has(journal._id)
                                ? "Unlike journal"
                                : "Like journal"
                            }
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={
                                likedJournals.has(journal._id)
                                  ? "currentColor"
                                  : "none"
                              }
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSave(
                                journal._id,
                                !savedJournals.has(journal._id)
                              );
                            }}
                            className={`
                              p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                              ${
                                savedJournals.has(journal._id)
                                  ? "bg-blue-500 text-white"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }
                            `}
                            aria-label={
                              savedJournals.has(journal._id)
                                ? "Unsave journal"
                                : "Save journal"
                            }
                          >
                            <BookOpen
                              className="w-4 h-4"
                              fill={
                                savedJournals.has(journal._id)
                                  ? "currentColor"
                                  : "none"
                              }
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/${journal.author?.anonymousName || "anonymous"}/${
                        journal.slug
                      }`}
                      className="absolute inset-0 z-20"
                      aria-label={`Read journal: ${journal.title}`}
                    />
                  </div>
                );
              })}

              {featuredJournals.length < 3 && (
                <div className="hidden lg:block bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <BookOpen
                      className="w-8 h-8 mx-auto mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-sm">More journals coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Latest Journals Section */}
        <section aria-labelledby="latest-journals">
          <div className="flex max-w-3xl mx-auto items-center gap-4 my-8 ">
            <div className="flex-1 h-[0.5px] bg-gray-300" />
            <h2 className="text-2xl  text-gray-900 whitespace-nowrap">
              Latest Journals
            </h2>
            <div className="flex-1 h-[0.5px] bg-gray-300" />
          </div>

          {latestJournals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No journals found.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 sm:gap-6">
                {latestJournals.map((journal) => (
                  <JournalCard
                    key={journal._id}
                    journal={journal}
                    onLike={handleLike}
                    onSave={handleSave}
                    isLiked={likedJournals.has(journal._id)}
                    isSaved={savedJournals.has(journal._id)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Load more journals"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      {modals}
    </div>
  );
};

export default PublicJournals;
