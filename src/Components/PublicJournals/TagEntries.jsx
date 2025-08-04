import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tag, Loader, Sparkles, TrendingUp } from "lucide-react";
import axios from "axios";
import { useDarkMode } from "../../context/ThemeContext";
import AuthModals from "../Landing/AuthModals";
import Navbar from "../Dashboard/Navbar";
import JournalCard, {
  JournalCardSkeleton,
} from "../PublicJournals/PublicStoryCard";

import romance from "/banners/romance.png";
import comedy from "/banners/comedy.png";
import fantasy from "/banners/fantasy.jpg";
import mystery from "/banners/mystery.png";
import scienceFiction from "/banners/science fiction.jpg";
import horror from "/banners/horror.jpg";
import drama from "/banners/drama.png";
import adventure from "/banners/adventure.jpg";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

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

// Tag banner mapping
const getTagBanner = (tagName) => {
  const banners = {
    romance,
    comedy,
    fantasy,
    mystery,
    "science fiction": scienceFiction,
    horror,
    drama,
    adventure,
  };

  return banners[tagName.toLowerCase()] || fantasy; // Default fallback
};

// Enhanced Related Tags Component
const RelatedTags = ({ currentTag, contentType, onTagSelect }) => {
  const storyTags = [
    "Fantasy",
    "Horror",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Adventure",
    "Drama",
    "Comedy",
  ];
  const journalTags = [
    "Personal",
    "Reflection",
    "Life",
    "Growth",
    "Thoughts",
    "Experience",
    "Daily",
    "Mindfulness",
  ];

  const tags = contentType === "stories" ? storyTags : journalTags;
  const relatedTags = tags
    .filter((tag) => tag.toLowerCase() !== currentTag.toLowerCase())
    .slice(0, 6);

  if (relatedTags.length === 0) return null;

  return (
    <div className="bg-black rounded-b-2xl max-w-7xl mx-auto backdrop-blur-sm border-b border-white/20 py-4  relative z-10">
      <div className="">
        <div className="text-center">
          <p className="text-white/90 text-sm mb-3 font-medium">
            Explore Related Tags
          </p>
          <div className="flex justify-center">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {relatedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className="group px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium whitespace-nowrap hover:bg-white/30 transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  <span className="flex items-center gap-1">{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Hero Section Component
const TagHeroSection = ({ tag, totalCount, contentType }) => {
  const bannerImage = getTagBanner(tag);

  return (
    <div className="relative max-w-7xl rounded-t-2xl mx-auto mt-12 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="">
        <img
          src={bannerImage}
          alt={`${tag} banner`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Bottom Fade */}
    </div>
  );
};

// Enhanced Loading Component
const LoadingState = ({ seo, modals }) => (
  <>
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seo.canonicalUrl} />
    </Helmet>

    <Navbar name="New Entry" link="/journaling-alt" />

    <div className="min-h-screen bg-gray-50">
      <div className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 animate-pulse">
        <div className="text-center text-white">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium">Loading amazing content...</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <JournalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
    {modals}
  </>
);

// Enhanced Error Component
const ErrorState = ({ seo, modals, error, onRetry }) => (
  <>
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seo.canonicalUrl} />
    </Helmet>

    <Navbar name="New Entry" link="/journaling-alt" />

    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Tag className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
    {modals}
  </>
);

const TagEntries = () => {
  const { tag } = useParams();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  const [contentType, setContentType] = useState("stories");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [likedEntries, setLikedEntries] = useState(new Set());
  const [savedEntries, setSavedEntries] = useState(new Set());

  // Memoize user to prevent unnecessary re-renders
  const user = useMemo(() => getCurrentUser(), []);
  const isLoggedIn = !!user;

  // Determine content type from referrer or URL state
  useEffect(() => {
    const state = location.state;
    if (state?.contentType) {
      setContentType(state.contentType);
    } else {
      setContentType("stories"); // Default to stories
    }
  }, [location.state]);

  // Fetch entries by tag
  const fetchEntries = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);

        const params = {
          page: pageNum,
          limit: 12,
          sort: "-createdAt",
          category: contentType === "stories" ? "story" : "journal",
        };

        const response = await API.get(
          `/journals/by-tag/${encodeURIComponent(tag)}`,
          { params }
        );

        const newEntries = response.data.journals || [];

        if (append) {
          setEntries((prev) => [...prev, ...newEntries]);
        } else {
          setEntries(newEntries);
        }

        setHasMore(response.data.hasMore);
        setTotalCount(response.data.totalCount || newEntries.length);
        setPage(pageNum);

        // Update liked/saved status
        if (user) {
          const liked = new Set(
            newEntries
              .filter((entry) => entry.likes?.includes(user._id))
              .map((entry) => entry._id)
          );
          const saved = new Set(
            newEntries
              .filter((entry) => user.savedEntries?.includes(entry._id))
              .map((entry) => entry._id)
          );

          if (append) {
            setLikedEntries((prev) => new Set([...prev, ...liked]));
            setSavedEntries((prev) => new Set([...prev, ...saved]));
          } else {
            setLikedEntries(liked);
            setSavedEntries(saved);
          }
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
        setError("Failed to fetch entries. Please try again later.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [tag, contentType, user]
  );

  // Handle like
  const handleLike = useCallback(
    async (entry) => {
      if (!user) return;

      const entryId = entry._id;
      const isCurrentlyLiked = likedEntries.has(entryId);

      // Optimistic update
      setLikedEntries((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(entryId);
        } else {
          newSet.add(entryId);
        }
        return newSet;
      });

      setEntries((prev) =>
        prev.map((e) =>
          e._id === entryId
            ? { ...e, likeCount: e.likeCount + (isCurrentlyLiked ? -1 : 1) }
            : e
        )
      );

      try {
        await API.post(`/journals/${entryId}/like`, { userId: user._id });
      } catch (error) {
        // Revert on error
        setLikedEntries((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(entryId);
          } else {
            newSet.delete(entryId);
          }
          return newSet;
        });
        console.error("Error liking entry:", error);
      }
    },
    [likedEntries, user]
  );

  // Handle save
  const handleSave = useCallback(
    async (entryId) => {
      if (!user) return;

      const isCurrentlySaved = savedEntries.has(entryId);

      setSavedEntries((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) {
          newSet.delete(entryId);
        } else {
          newSet.add(entryId);
        }
        return newSet;
      });

      try {
        await API.post(`/journals/${entryId}/save`, { userId: user._id });
      } catch (error) {
        // Revert on error
        setSavedEntries((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlySaved) {
            newSet.add(entryId);
          } else {
            newSet.delete(entryId);
          }
          return newSet;
        });
        console.error("Error saving entry:", error);
      }
    },
    [savedEntries, user]
  );

  // Handle tag selection
  const handleTagSelect = (newTag) => {
    window.location.href = `/tag/${newTag.toLowerCase()}?contentType=${contentType}`;
  };

  // Load more entries
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchEntries(page + 1, true);
    }
  }, [hasMore, loadingMore, page, fetchEntries]);

  // Initial load
  useEffect(() => {
    fetchEntries(1, false);
  }, [tag, contentType, fetchEntries]);

  // Dynamic SEO content
  const seo = {
    title: `${
      contentType === "stories" ? "Stories" : "Journals"
    } Tagged "${tag}" | Starlit Journals`,
    description: `Discover ${
      contentType === "stories"
        ? "creative stories"
        : "personal journal entries"
    } tagged with "${tag}". Find meaningful content from our community of writers.`,
    keywords: `${tag.toLowerCase()}, ${contentType}, creative writing, ${
      contentType === "stories"
        ? "short stories, fiction"
        : "personal journal, daily writing"
    }, starlit journals`,
    canonicalUrl: `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  };

  if (loading && !loadingMore) {
    return <LoadingState seo={seo} modals={modals} />;
  }

  if (error) {
    return (
      <ErrorState
        seo={seo}
        modals={modals}
        error={error}
        onRetry={() => {
          setError(null);
          fetchEntries(1, false);
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seo.canonicalUrl} />
      </Helmet>

      <Navbar name="New Entry" link="/journaling-alt" />

      <div className="min-h-screen ">
        <TagHeroSection
          tag={tag}
          totalCount={totalCount}
          contentType={contentType}
        />
        <RelatedTags
          currentTag={tag}
          contentType={contentType}
          onTagSelect={handleTagSelect}
        />

        <div className="max-w-7xl mx-auto py-12">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No {contentType} found
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We couldn't find any {contentType} tagged with "{tag}".
                  <br />
                  Try exploring other tags or check back later for new content.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore More
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-500">
                    Showing {entries.length} of {totalCount} results
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {entries.map((entry, index) => (
                  <div
                    key={entry._id}
                    className="transform hover:scale-105 transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <JournalCard
                      journal={entry}
                      onLike={handleLike}
                      onSave={handleSave}
                      isLiked={likedEntries.has(entry._id)}
                      isSaved={savedEntries.has(entry._id)}
                    />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-16">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {loadingMore ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Loading more amazing content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Load More Stories
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {modals}
    </>
  );
};

export default TagEntries;
