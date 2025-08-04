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

// Static SEO metadata mapping
const seoMetadata = {
  romance: {
    title: "Romance Stories | Starlit Journals",
    description:
      "Explore heartfelt romance stories filled with love and passion. Discover captivating narratives from our community of writers.",
    keywords:
      "romance, love stories, fiction, creative writing, starlit journals",
    image: "https://starlitjournals.com/banners/romance.png",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  comedy: {
    title: "Comedy Stories | Starlit Journals",
    description:
      "Laugh out loud with hilarious comedy stories. Find funny and entertaining tales from our creative writers.",
    keywords: "comedy, humor, funny stories, fiction, starlit journals",
    image: "https://starlitjournals.com/banners/comedy.png",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  fantasy: {
    title: "Fantasy Stories | Starlit Journals",
    description:
      "Dive into magical worlds with fantasy stories. Explore epic adventures and mystical tales from our community.",
    keywords:
      "fantasy, epic stories, fiction, creative writing, starlit journals",
    image: "https://starlitjournals.com/banners/fantasy.jpg",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  mystery: {
    title: "Mystery Stories | Starlit Journals",
    description:
      "Unravel thrilling mysteries with our collection of suspenseful stories. Join the adventure with our writers.",
    keywords: "mystery, suspense, thriller, fiction, starlit journals",
    image: "https://starlitjournals.com/banners/mystery.png",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  "science fiction": {
    title: "Science Fiction Stories | Starlit Journals",
    description:
      "Journey to futuristic worlds with science fiction stories. Discover innovative and imaginative tales.",
    keywords:
      "science fiction, sci-fi, futuristic stories, fiction, starlit journals",
    image: "https://starlitjournals.com/banners/science fiction.jpg",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  horror: {
    title: "Horror Stories | Starlit Journals",
    description:
      "Experience spine-chilling horror stories. Dive into terrifying tales crafted by our talented writers.",
    keywords: "horror, scary stories, thriller, fiction, starlit journals",
    image: "https://starlitjournals.com/banners/horror.jpg",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  drama: {
    title: "Drama Stories | Starlit Journals",
    description:
      "Immerse yourself in emotional drama stories. Explore deep and meaningful narratives from our community.",
    keywords:
      "drama, emotional stories, fiction, creative writing, starlit journals",
    image: "https://starlitjournals.com/banners/drama.png",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  adventure: {
    title: "Adventure Stories | Starlit Journals",
    description:
      "Embark on thrilling adventures with our collection of action-packed stories. Join the journey today.",
    keywords:
      "adventure, action stories, fiction, creative writing, starlit journals",
    image: "https://starlitjournals.com/banners/adventure.jpg",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  personal: {
    title: "Personal Journals | Starlit Journals",
    description:
      "Read intimate personal journal entries. Connect with authentic experiences and reflections from our writers.",
    keywords: "personal, journal, reflection, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  reflection: {
    title: "Reflection Journals | Starlit Journals",
    description:
      "Explore thoughtful reflections in our journal entries. Dive into meaningful insights and personal growth stories.",
    keywords:
      "reflection, journal, personal growth, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  life: {
    title: "Life Journals | Starlit Journals",
    description:
      "Discover real-life experiences through our journal entries. Connect with stories of everyday moments and lessons.",
    keywords: "life, journal, experiences, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  growth: {
    title: "Growth Journals | Starlit Journals",
    description:
      "Follow journeys of personal growth in our journal entries. Be inspired by stories of transformation and learning.",
    keywords:
      "growth, personal development, journal, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  thoughts: {
    title: "Thoughts Journals | Starlit Journals",
    description:
      "Dive into the inner thoughts of our writers. Explore reflective and introspective journal entries.",
    keywords:
      "thoughts, journal, introspection, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  experience: {
    title: "Experience Journals | Starlit Journals",
    description:
      "Read about unique experiences in our journal entries. Connect with stories that capture life's moments.",
    keywords:
      "experience, journal, personal stories, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  daily: {
    title: "Daily Journals | Starlit Journals",
    description:
      "Explore daily journal entries from our community. Find inspiration in routine reflections and stories.",
    keywords: "daily, journal, routine, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  mindfulness: {
    title: "Mindfulness Journals | Starlit Journals",
    description:
      "Discover mindfulness journal entries. Reflect on moments of calm and clarity from our writers.",
    keywords:
      "mindfulness, journal, reflection, daily writing, starlit journals",
    image: "https://starlitjournals.com/banners/default.jpg", // Replace with actual image
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
  default: {
    title: "Explore Stories and Journals | Starlit Journals",
    description:
      "Discover a variety of stories and journal entries from our creative community. Explore now!",
    keywords:
      "stories, journals, creative writing, fiction, personal writing, starlit journals",
    image: "https://starlitjournals.com/banners/fantasy.jpg",
    canonicalUrl: (tag) =>
      `https://starlitjournals.com/tag/${tag.toLowerCase()}`,
  },
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
    <div className="bg-black p-2 rounded-b-2xl max-w-7xl mx-auto backdrop-blur-sm border-b border-white/20 py-4 relative z-10">
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
      <div className="">
        <img
          src={bannerImage}
          alt={`${tag} banner`}
          className="w-full h-full object-cover"
        />
      </div>
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
      <meta property="og:image" content={seo.image} />
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
      <meta property="og:image" content={seo.image} />
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

  // Get static SEO metadata
  const seo = useMemo(() => {
    const tagKey = tag.toLowerCase();
    const metadata = seoMetadata[tagKey] || seoMetadata.default;
    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      image: metadata.image,
      canonicalUrl: metadata.canonicalUrl(tag),
    };
  }, [tag]);

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
    <div className="p-4">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seo.canonicalUrl} />
      </Helmet>

      <Navbar name="New Entry" link="/journaling-alt" />

      <div className="min-h-screen">
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
    </div>
  );
};

export default TagEntries;
