import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Heart,
  MessageSquare,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import JournalCard, { JournalCardSkeleton } from "./PublicStoryCard";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { createAvatar } from "@dicebear/core";
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
import {
  setWithExpiry,
  getWithExpiry,
  CACHE_KEYS,
  CACHE_TTL,
} from "../../utils/anonymousName";

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

const TagFilters = ({ tags, selectedTag, onTagSelect }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    if (tag) {
      navigate(`/tag/${tag.toLowerCase()}`, {
        state: { contentType: "stories", selectedTag: tag },
      });
    } else {
      navigate("/public", { state: { contentType: "stories" } });
      onTagSelect(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              !selectedTag
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200"
            }`}
          >
            All Stories
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Redesigned LatestStoryCard - Full image background with overlay content
const LatestStoryCard = ({
  story,
  likedStories,
  savedStories,
  getAvatarSvg,
}) => {
  let thumbnail = story.thumbnail;
  if (!thumbnail && story.content) {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = story.content;
      const img = tempDiv.querySelector("img");
      thumbnail = img?.src || null;
    } catch {}
  }

  const avatarStyle = story.author?.profileTheme?.avatarStyle || "avataaars";
  const avatarSeed = story.author?.anonymousName || "Anonymous";
  const avatarUrl = getAvatarSvg(avatarStyle, avatarSeed);

  return (
    <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${thumbnail || "/default-book-bg.jpg"})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Genre Badge - Top Left */}
      {story.genre && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
            {story.genre}
          </span>
        </div>
      )}

      {/* Author Info - Top Left Below Genre */}
      <div className="absolute top-16 left-4 z-10 flex items-center gap-3">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={`${story.author?.anonymousName || "Anonymous"}'s avatar`}
            className="w-10 h-10 rounded-full border-2 border-white/80 shadow-lg backdrop-blur-sm bg-white/10"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <div className="text-white">
          <div className="font-semibold text-sm drop-shadow-lg">
            {story.author?.anonymousName || "Anonymous"}
          </div>
          <div className="text-xs text-white/80 font-medium">
            {new Date(story.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Title and Content - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight drop-shadow-lg group-hover:text-blue-200 transition-colors duration-300">
          {story.title}
        </h3>

        {/* Reading Time */}
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Clock className="w-4 h-4" />
          <span className="font-medium">5 min read</span>
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">Featured</span>
        </div>
      </div>

      {/* Hover Effect Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* Link Overlay */}
      <a
        href={`/${story.author?.anonymousName || "anonymous"}/${story.slug}`}
        className="absolute inset-0 z-20"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/${
            story.author?.anonymousName || "anonymous"
          }/${story.slug}`;
        }}
        aria-label={`Read ${story.title} by ${
          story.author?.anonymousName || "Anonymous"
        }`}
      />
    </div>
  );
};

// Enhanced Featured Section Component
const FeaturedSection = ({
  stories,
  likedStories,
  savedStories,
  handleLike,
  handleSave,
  getAvatarSvg,
}) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Featured Stories
        </h3>
        <p className="text-gray-500">Check back later for amazing stories!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
      {/* Main Featured Story */}
      {stories[0] && (
        <div className="lg:col-span-2 group relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl">
          <div className="absolute inset-0">
            {stories[0].thumbnail && (
              <img
                src={stories[0].thumbnail}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                #1 TRENDING
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {stories[0].title}
              </h2>

              <p className="text-lg text-gray-200 leading-relaxed mb-6 line-clamp-3">
                {stories[0].metaDescription ||
                  (stories[0].content
                    ? stories[0].content
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 150) + "..."
                    : "Discover an amazing story...")}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarSvg(
                    stories[0].author?.profileTheme?.avatarStyle || "avataaars",
                    stories[0].author?.anonymousName || "Anonymous"
                  )}
                  alt=""
                  className="w-12 h-12 rounded-full border-3 border-white/30 shadow-lg"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {stories[0].author?.anonymousName || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />7 min read
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLike(stories[0]);
                  }}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    likedStories.has(stories[0]._id)
                      ? "bg-red-500 text-white scale-110"
                      : "bg-white/20 text-white hover:bg-red-500 hover:scale-110"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={
                      likedStories.has(stories[0]._id) ? "currentColor" : "none"
                    }
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave(stories[0]._id);
                  }}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    savedStories.has(stories[0]._id)
                      ? "bg-blue-500 text-white scale-110"
                      : "bg-white/20 text-white hover:bg-blue-500 hover:scale-110"
                  }`}
                >
                  <BookOpen
                    className="w-5 h-5"
                    fill={
                      savedStories.has(stories[0]._id) ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>
            </div>
          </div>

          <a
            href={`/${stories[0].author?.anonymousName || "anonymous"}/${
              stories[0].slug
            }`}
            className="absolute inset-0 z-20"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${
                stories[0].author?.anonymousName || "anonymous"
              }/${stories[0].slug}`;
            }}
          />
        </div>
      )}

      {/* Side Featured Stories */}
      <div className="space-y-6">
        {stories.slice(1, 3).map((story, index) => (
          <div
            key={story._id}
            className="group relative h-[235px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl"
          >
            <div className="absolute inset-0">
              {story.thumbnail && (
                <img
                  src={story.thumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 2}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                  {story.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={getAvatarSvg(
                    story.author?.profileTheme?.avatarStyle || "avataaars",
                    story.author?.anonymousName || "Anonymous"
                  )}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
                <div className="text-sm">
                  <div className="font-medium">
                    {story.author?.anonymousName || "Anonymous"}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`/${story.author?.anonymousName || "anonymous"}/${
                story.slug
              }`}
              className="absolute inset-0 z-20"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/${
                  story.author?.anonymousName || "anonymous"
                }/${story.slug}`;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <JournalCardSkeleton key={i} />
    ))}
  </div>
);

const PublicStories = () => {
  const [loadingStates, setLoadingStates] = useState({
    featured: true,
    latest: true,
    topGenres: {},
    selectedGenre: false,
  });

  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestByGenre, setLatestByGenre] = useState([]);
  const [topByGenre, setTopByGenre] = useState({});
  const [error, setError] = useState(null);
  const [likedStories, setLikedStories] = useState(new Set());
  const [savedStories, setSavedStories] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState(null);

  const popularTags = [
    "Horror",
    "Science Fiction",
    "Comedy",
    "Mystery",
    "Romance",
    "Fantasy",
    "Adventure",
    "Drama",
  ];

  const { darkMode } = useDarkMode();
  const { modals } = AuthModals({ darkMode });
  const location = useLocation();
  const navigate = useNavigate();

  const updateLoadingState = (section, isLoading, genre = null) => {
    setLoadingStates((prev) => ({
      ...prev,
      [section]: genre ? { ...prev[section], [genre]: isLoading } : isLoading,
    }));
  };

  useEffect(() => {
    const tagFromRoute = location.state?.selectedTag || null;
    if (tagFromRoute !== selectedTag) {
      setSelectedTag(tagFromRoute);
      if (tagFromRoute) {
        updateLoadingState("selectedGenre", true);
      }
    }
  }, [location.state]);

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

  const updateUserStates = (stories) => {
    const user = getCurrentUser();
    if (user) {
      setLikedStories(
        (prev) =>
          new Set([
            ...prev,
            ...stories
              .filter((s) => s.likes?.includes(user._id))
              .map((s) => s._id),
          ])
      );
      setSavedStories(
        (prev) =>
          new Set([
            ...prev,
            ...stories
              .filter((s) => user.savedEntries?.includes(s._id))
              .map((s) => s._id),
          ])
      );
    }
  };

  const fetchFeaturedStories = useCallback(async () => {
    try {
      // Check cache first
      const cachedStories = getWithExpiry(CACHE_KEYS.FEATURED_STORIES);
      if (cachedStories) {
        setFeaturedStories(cachedStories);
        updateUserStates(cachedStories);
        updateLoadingState("featured", false);
        return;
      }

      updateLoadingState("featured", true);
      const response = await API.get("/stories/top-liked");
      const stories = response.data.stories || [];

      // Cache the results
      setWithExpiry(CACHE_KEYS.FEATURED_STORIES, stories, CACHE_TTL);

      setFeaturedStories(stories);
      updateUserStates(stories);
    } catch (error) {
      console.error("Error fetching featured stories:", error);
      setError("Failed to fetch featured stories");
    } finally {
      updateLoadingState("featured", false);
    }
  }, []);

  const fetchLatestByGenre = useCallback(async () => {
    try {
      // Check cache first
      const cachedStories = getWithExpiry(CACHE_KEYS.LATEST_STORIES);
      if (cachedStories) {
        setLatestByGenre(cachedStories);
        updateUserStates(cachedStories);
        updateLoadingState("latest", false);
        return;
      }

      updateLoadingState("latest", true);
      const response = await API.get("/stories/latest-by-genre", {
        params: { genres: popularTags.join(",") },
      });
      const stories = response.data.stories || [];

      // Cache the results
      setWithExpiry(CACHE_KEYS.LATEST_STORIES, stories, CACHE_TTL);

      setLatestByGenre(stories);
      updateUserStates(stories);
    } catch (error) {
      console.error("Error fetching latest stories by genre:", error);
      setError("Failed to fetch latest stories by genre");
    } finally {
      updateLoadingState("latest", false);
    }
  }, []);

  const fetchTopByGenre = useCallback(async () => {
    // Check cache first
    const cachedTopByGenre = getWithExpiry(CACHE_KEYS.TOP_BY_GENRE);
    if (cachedTopByGenre) {
      setTopByGenre(cachedTopByGenre);
      // Update user states for all cached stories
      const allStories = Object.values(cachedTopByGenre).flat();
      updateUserStates(allStories);

      // Set all genres as not loading
      const loadingStates = {};
      popularTags.forEach((tag) => {
        loadingStates[tag] = false;
      });
      setLoadingStates((prev) => ({
        ...prev,
        topGenres: loadingStates,
      }));
      return;
    }

    // Initialize loading states for all genres
    const initialLoadingStates = {};
    popularTags.forEach((tag) => {
      initialLoadingStates[tag] = true;
    });
    setLoadingStates((prev) => ({
      ...prev,
      topGenres: initialLoadingStates,
    }));

    const genreResults = {};

    // Fetch each genre independently
    const promises = popularTags.map(async (tag) => {
      try {
        const response = await API.get(
          `/stories/top-by-genre/${encodeURIComponent(tag)}`
        );
        const stories = response.data.stories || [];
        genreResults[tag] = stories;
        updateUserStates(stories);
      } catch (error) {
        console.error(`Error fetching top stories for ${tag}:`, error);
        genreResults[tag] = [];
      } finally {
        updateLoadingState("topGenres", false, tag);
      }
    });

    // Wait for all genres to complete
    await Promise.all(promises);

    // Cache all results together
    setWithExpiry(CACHE_KEYS.TOP_BY_GENRE, genreResults, CACHE_TTL);
    setTopByGenre(genreResults);
  }, []);

  const fetchSelectedGenreStories = useCallback(
    async (tag) => {
      if (!tag) return;

      // Check if we already have this genre data (from cache or previous fetch)
      if (topByGenre[tag]) return;

      try {
        updateLoadingState("selectedGenre", true);
        const response = await API.get(
          `/stories/top-by-genre/${encodeURIComponent(tag)}`
        );
        const stories = response.data.stories || [];

        setTopByGenre((prev) => {
          const updated = { ...prev, [tag]: stories };
          // Update cache with new data
          setWithExpiry(CACHE_KEYS.TOP_BY_GENRE, updated, CACHE_TTL);
          return updated;
        });

        updateUserStates(stories);
      } catch (error) {
        console.error(`Error fetching stories for ${tag}:`, error);
        setError(`Failed to fetch stories for ${tag}`);
      } finally {
        updateLoadingState("selectedGenre", false);
      }
    },
    [topByGenre]
  );

  const handleLike = useCallback(
    async (story) => {
      const user = getCurrentUser();
      if (!user) return;
      const storyId = story._id;
      const isCurrentlyLiked = likedStories.has(storyId);

      setLikedStories((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(storyId);
        } else {
          newSet.add(storyId);
        }
        return newSet;
      });

      const updateStory = (stories) =>
        stories.map((s) =>
          s._id === storyId
            ? { ...s, likeCount: s.likeCount + (isCurrentlyLiked ? -1 : 1) }
            : s
        );

      setFeaturedStories(updateStory);
      setLatestByGenre(updateStory);
      setTopByGenre((prev) => {
        const newData = {};
        for (const tag in prev) {
          newData[tag] = updateStory(prev[tag]);
        }
        return newData;
      });

      try {
        await API.post(`/journals/${storyId}/like`, { userId: user._id });
      } catch (error) {
        setLikedStories((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(storyId);
          } else {
            newSet.delete(storyId);
          }
          return newSet;
        });
        console.error("Error liking story:", error);
      }
    },
    [likedStories]
  );

  const handleSave = useCallback(
    async (storyId) => {
      const user = getCurrentUser();
      if (!user) return;
      const isCurrentlySaved = savedStories.has(storyId);

      setSavedStories((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) {
          newSet.delete(storyId);
        } else {
          newSet.add(storyId);
        }
        return newSet;
      });

      try {
        await API.post(`/journals/${storyId}/save`, { userId: user._id });
      } catch (error) {
        setSavedStories((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlySaved) {
            newSet.add(storyId);
          } else {
            newSet.delete(storyId);
          }
          return newSet;
        });
        console.error("Error saving story:", error);
      }
    },
    [savedStories]
  );

  // Initialize data fetching
  useEffect(() => {
    fetchFeaturedStories();
    fetchLatestByGenre();
    fetchTopByGenre();
  }, [fetchFeaturedStories, fetchLatestByGenre, fetchTopByGenre]);

  // Fetch selected genre data when tag changes
  useEffect(() => {
    if (selectedTag) {
      fetchSelectedGenreStories(selectedTag);
    }
  }, [selectedTag, fetchSelectedGenreStories]);

  if (
    error &&
    Object.values(loadingStates).every((state) =>
      typeof state === "boolean"
        ? !state
        : Object.values(state).every((s) => !s)
    )
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchFeaturedStories();
              fetchLatestByGenre();
              fetchTopByGenre();
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Try Again
          </button>
        </div>
        {modals}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <TagFilters
        tags={popularTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Stories Section - Completely Redesigned */}
        {!selectedTag && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Featured Stories
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Handpicked masterpieces from our community
                  </p>
                </div>
              </div>
            </div>

            {loadingStates.featured ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-3xl" />
                <div className="space-y-6">
                  <div className="h-[235px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
                  <div className="h-[235px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
                </div>
              </div>
            ) : (
              <FeaturedSection
                stories={featuredStories}
                likedStories={likedStories}
                savedStories={savedStories}
                handleLike={handleLike}
                handleSave={handleSave}
                getAvatarSvg={getAvatarSvg}
              />
            )}
          </section>
        )}

        {/* Latest Stories Section - Enhanced Design */}
        {!selectedTag && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Latest Stories
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Fresh content from talented writers
                  </p>
                </div>
              </div>
            </div>

            {loadingStates.latest ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : latestByGenre.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestByGenre.map((story) => (
                  <LatestStoryCard
                    key={story._id}
                    story={story}
                    likedStories={likedStories}
                    savedStories={savedStories}
                    getAvatarSvg={getAvatarSvg}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No latest stories found
                </h3>
                <p className="text-gray-500">
                  Check back later for fresh content!
                </p>
              </div>
            )}
          </section>
        )}

        {/* Selected Tag Section */}
        {selectedTag ? (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Top Stories in {selectedTag}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Most loved stories in this genre
                  </p>
                </div>
              </div>
            </div>

            {loadingStates.selectedGenre ||
            loadingStates.topGenres[selectedTag] ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <JournalCardSkeleton key={i} />
                ))}
              </div>
            ) : topByGenre[selectedTag]?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topByGenre[selectedTag].map((story) => (
                  <JournalCard
                    key={story._id}
                    journal={story}
                    onLike={handleLike}
                    onSave={handleSave}
                    isLiked={likedStories.has(story._id)}
                    isSaved={savedStories.has(story._id)}
                    hideStats={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No stories found for {selectedTag}
                </h3>
                <p className="text-gray-500">
                  Be the first to write a story in this genre!
                </p>
              </div>
            )}
          </section>
        ) : (
          // Top Stories by Genre Sections - Enhanced
          popularTags.map((tag) => (
            <section key={tag} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {tag.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Top Stories in {tag}
                    </h2>
                    <p className="text-gray-600">
                      Most popular {tag.toLowerCase()} stories
                    </p>
                  </div>
                </div>
              </div>

              {loadingStates.topGenres[tag] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <JournalCardSkeleton key={i} />
                  ))}
                </div>
              ) : topByGenre[tag]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topByGenre[tag].map((story) => (
                    <JournalCard
                      key={story._id}
                      journal={story}
                      onLike={handleLike}
                      onSave={handleSave}
                      isLiked={likedStories.has(story._id)}
                      isSaved={savedStories.has(story._id)}
                      hideStats={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-1">
                    No stories found for {tag}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Be the first to share a {tag.toLowerCase()} story!
                  </p>
                </div>
              )}
            </section>
          ))
        )}
      </div>
      {modals}
    </div>
  );
};

export default PublicStories;
