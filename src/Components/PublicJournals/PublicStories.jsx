import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Clock,
  Heart,
  MessageSquare,
  BookOpen,
  Star,
  Crown,
  Sparkles,
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

const AuthorPickCard = ({ story, getAvatarSvg, index }) => {
  // Extract a thumbnail (fallback to image inside content or default image)
  const thumbnail =
    story.thumbnail ||
    (story.content &&
      (() => {
        try {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = story.content;
          return tempDiv.querySelector("img")?.src || "/default-book-bg.jpg";
        } catch {
          return "/default-book-bg.jpg";
        }
      })());

  // Generate avatar
  const avatarStyle = story.author?.profileTheme?.avatarStyle || "avataaars";
  const avatarSeed = story.author?.anonymousName || "Anonymous";
  const avatarUrl = getAvatarSvg(avatarStyle, avatarSeed);

  // Formatted date
  const date = new Date(story.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="relative rounded-2xl hover:scale-[1.02] overflow-hidden group cursor-pointer bg-gray-100 h-full shadow-md hover:shadow-xl transition-all duration-300"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        backgroundColor: "#00000055",
      }}
    >
      {/* Overlay for darkening */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Badge */}
      <div className="absolute top-3 right-3 z-10 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <Crown className="w-3 h-3" />
        <span>Author's Pick</span>
      </div>

      {/* Card Content */}
      <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between text-white">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt={`${story.author?.anonymousName || "Anonymous"}'s avatar`}
            className="w-8 h-8 rounded-full border-2 border-white/50 shadow-sm"
          />
          <div className="text-sm leading-tight">
            <div className="font-semibold">
              {story.author?.anonymousName || "Anonymous"}
            </div>
            <div className="text-xs text-white/80">{date}</div>
          </div>
        </div>

        {/* Title and Stats */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-amber-100 transition-colors duration-300">
            {story.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5 min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{story.likeCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* Link Overlay */}
      <a
        href={`/${story.author?.anonymousName || "anonymous"}/${story.slug}`}
        className="absolute inset-0 z-20"
        aria-label={`Read ${story.title}`}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/${
            story.author?.anonymousName || "anonymous"
          }/${story.slug}`;
        }}
      />
    </div>
  );
};

// Tag Filter Component
const TagFilters = memo(({ tags, selectedTag, onTagSelect }) => {
  const navigate = useNavigate();

  const handleTagClick = useCallback(
    (tag) => {
      if (tag) {
        navigate(`/tag/${tag.toLowerCase()}`, {
          state: { contentType: "stories" },
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
    <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
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

const LoadingSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <JournalCardSkeleton key={i} />
    ))}
  </div>
);

const PublicStories = () => {
  // Loading states for different sections
  const [loadingStates, setLoadingStates] = useState({
    authorPicks: true,
    featured: true,
    latest: true,
    topGenres: {},
    selectedGenre: false,
  });

  const [authorPickStories, setAuthorPickStories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestByGenre, setLatestByGenre] = useState([]);
  const [topByGenre, setTopByGenre] = useState({});
  const [error, setError] = useState(null);
  const [likedStories, setLikedStories] = useState(new Set());
  const [savedStories, setSavedStories] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState(null);

  const popularTags = [
    "Horror",
    "Romance",
    "Science Fiction",
    "Comedy",
    "Mystery",
    "Adventure",
    "Fantasy",
    "Drama",
  ];

  const { darkMode } = useDarkMode();
  const { modals } = AuthModals({ darkMode });
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to update loading states
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

  const fetchAuthorPickStories = useCallback(async () => {
    const cacheKey = "authorPickStories";
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("📦 Loaded authorPickStories from localStorage");
      setAuthorPickStories(parsed);
      updateUserStates(parsed);
      updateLoadingState("authorPicks", false);
      return;
    }

    try {
      console.log("🌐 Fetching authorPickStories from API...");
      updateLoadingState("authorPicks", true);
      const response = await API.get("/stories/author-picks");
      const stories = response.data.stories || [];
      setAuthorPickStories(stories);
      localStorage.setItem(cacheKey, JSON.stringify(stories));
      updateUserStates(stories);
    } catch (error) {
      console.error("❌ Error fetching author pick stories:", error);
      setError("Failed to fetch author pick stories");
    } finally {
      updateLoadingState("authorPicks", false);
    }
  }, []);

  const fetchFeaturedStories = useCallback(async () => {
    const cacheKey = "featuredStories";
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("📦 Loaded featuredStories from localStorage");
      setFeaturedStories(parsed);
      updateUserStates(parsed);
      updateLoadingState("featured", false);
      return;
    }

    try {
      console.log("🌐 Fetching featuredStories from API...");
      updateLoadingState("featured", true);
      const response = await API.get("/stories/top-liked");
      const stories = response.data.stories || [];
      setFeaturedStories(stories);
      localStorage.setItem(cacheKey, JSON.stringify(stories));
      updateUserStates(stories);
    } catch (error) {
      console.error("❌ Error fetching featured stories:", error);
      setError("Failed to fetch featured stories");
    } finally {
      updateLoadingState("featured", false);
    }
  }, []);

  const fetchLatestByGenre = useCallback(async () => {
    const cacheKey = "latestByGenre";
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("📦 Loaded latestByGenre from localStorage");
      setLatestByGenre(parsed);
      updateUserStates(parsed);
      updateLoadingState("latest", false);
      return;
    }

    try {
      console.log("🌐 Fetching latestByGenre from API...");
      updateLoadingState("latest", true);
      const response = await API.get("/stories/latest-by-genre", {
        params: { genres: popularTags.join(",") },
      });
      const stories = response.data.stories || [];
      setLatestByGenre(stories);
      localStorage.setItem(cacheKey, JSON.stringify(stories));
      updateUserStates(stories);
    } catch (error) {
      console.error("❌ Error fetching latest stories by genre:", error);
      setError("Failed to fetch latest stories by genre");
    } finally {
      updateLoadingState("latest", false);
    }
  }, []);

  const fetchTopByGenre = useCallback(() => {
    const initialLoadingStates = {};
    popularTags.forEach((tag) => {
      initialLoadingStates[tag] = true;
    });
    setLoadingStates((prev) => ({
      ...prev,
      topGenres: initialLoadingStates,
    }));

    popularTags.forEach(async (tag) => {
      const cacheKey = `topByGenre_${tag}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const stories = JSON.parse(cached);
        console.log(`📦 Loaded topByGenre(${tag}) from localStorage`);
        setTopByGenre((prev) => ({ ...prev, [tag]: stories }));
        updateUserStates(stories);
        updateLoadingState("topGenres", false, tag);
        return;
      }

      try {
        console.log(`🌐 Fetching topByGenre(${tag}) from API...`);
        const response = await API.get(
          `/stories/top-by-genre/${encodeURIComponent(tag)}`
        );
        const stories = response.data.stories || [];
        setTopByGenre((prev) => ({ ...prev, [tag]: stories }));
        localStorage.setItem(cacheKey, JSON.stringify(stories));
        updateUserStates(stories);
      } catch (error) {
        console.error(`❌ Error fetching top stories for ${tag}:`, error);
      } finally {
        updateLoadingState("topGenres", false, tag);
      }
    });
  }, []);

  const fetchSelectedGenreStories = useCallback(
    async (tag) => {
      if (!tag || topByGenre[tag]) return;

      try {
        updateLoadingState("selectedGenre", true);
        const response = await API.get(
          `/stories/top-by-genre/${encodeURIComponent(tag)}`
        );
        const stories = response.data.stories || [];

        setTopByGenre((prev) => ({
          ...prev,
          [tag]: stories,
        }));

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

      setAuthorPickStories(updateStory);
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
    fetchAuthorPickStories();
    fetchFeaturedStories();
    fetchLatestByGenre();
    fetchTopByGenre();
  }, [
    fetchAuthorPickStories,
    fetchFeaturedStories,
    fetchLatestByGenre,
    fetchTopByGenre,
  ]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAuthorPickStories();
              fetchFeaturedStories();
              fetchLatestByGenre();
              fetchTopByGenre();
            }}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
        {modals}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TagFilters
        tags={popularTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedTag && (
          <section className="mb-20">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold ">
                Author's Picks
              </h2>
            </div>

            {/* 3-column custom grid */}
            {loadingStates.authorPicks ? (
              <div className="grid grid-cols-3 gap-6 h-[600px]">
                <div className="flex flex-col gap-6">
                  <div className="bg-gray-200 animate-pulse rounded-xl h-[290px]" />
                  <div className="bg-gray-200 animate-pulse rounded-xl h-[290px]" />
                </div>

                <div className="bg-gray-200 animate-pulse rounded-xl h-full" />

                <div className="flex flex-col gap-6">
                  <div className="bg-gray-200 animate-pulse rounded-xl h-[290px]" />
                  <div className="bg-gray-200 animate-pulse rounded-xl h-[290px]" />
                </div>
              </div>
            ) : authorPickStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-6 h-[600px]">
                {/* Left Column: Story 0 & 1 */}
                <div className="flex flex-col gap-6">
                  {authorPickStories[0] && (
                    <AuthorPickCard
                      story={authorPickStories[0]}
                      likedStories={likedStories}
                      savedStories={savedStories}
                      getAvatarSvg={getAvatarSvg}
                      index={0}
                      className="h-[290px]"
                    />
                  )}
                  {authorPickStories[1] && (
                    <AuthorPickCard
                      story={authorPickStories[1]}
                      likedStories={likedStories}
                      savedStories={savedStories}
                      getAvatarSvg={getAvatarSvg}
                      index={1}
                      className="h-[290px]"
                    />
                  )}
                </div>

                {/* Center Column: Story 2 spans both rows */}
                <div>
                  {authorPickStories[2] && (
                    <AuthorPickCard
                      story={authorPickStories[2]}
                      likedStories={likedStories}
                      savedStories={savedStories}
                      getAvatarSvg={getAvatarSvg}
                      index={2}
                      className="h-full"
                    />
                  )}
                </div>

                {/* Right Column: Story 3 & 4 */}
                <div className="flex flex-col gap-6">
                  {authorPickStories[3] && (
                    <AuthorPickCard
                      story={authorPickStories[3]}
                      likedStories={likedStories}
                      savedStories={savedStories}
                      getAvatarSvg={getAvatarSvg}
                      index={3}
                      className="h-[290px]"
                    />
                  )}
                  {authorPickStories[4] && (
                    <AuthorPickCard
                      story={authorPickStories[4]}
                      likedStories={likedStories}
                      savedStories={savedStories}
                      getAvatarSvg={getAvatarSvg}
                      index={4}
                      className="h-[290px]"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No author's picks available.</p>
              </div>
            )}
          </section>
        )}

        {/* Featured Stories Section */}
        {!selectedTag && (
          <section className="mb-16">
            <div className="flex items-center gap-4 my-8">
              <h2 className="text-2xl md:text-3xl text-left font-semibold text-gray-900 whitespace-nowrap">
                Featured Stories
              </h2>
            </div>

            {loadingStates.featured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[600px]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-lg h-48 lg:h-full"
                  />
                ))}
              </div>
            ) : featuredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[600px]">
                {featuredStories.map((story, index) => {
                  const isLarge = index === 0;
                  const isMedium = index === 1;
                  let thumbnail = story.thumbnail;
                  if (!thumbnail && story.content) {
                    try {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = story.content;
                      const img = tempDiv.querySelector("img");
                      thumbnail = img?.src || null;
                    } catch {}
                  }
                  const avatarStyle =
                    story.author?.profileTheme?.avatarStyle || "avataaars";
                  const avatarSeed = story.author?.anonymousName || "Anonymous";
                  const avatarUrl = getAvatarSvg(avatarStyle, avatarSeed);

                  return (
                    <div
                      key={story._id}
                      className={`
                        group rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 hover:shadow-lg transition-all duration-300
                        ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
                        ${isMedium ? "lg:col-span-2" : ""}
                      `}
                    >
                      {thumbnail && (
                        <div className="absolute inset-0">
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 transition-opacity duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      )}
                      <div
                        className={`relative z-10 p-6 h-full flex flex-col justify-between text-white ${
                          isLarge ? "p-8" : "p-6"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={avatarUrl}
                              alt=""
                              className="w-6 h-6 rounded-full border border-white/20"
                            />
                            <span className="text-sm font-medium text-white/90">
                              {story.author?.anonymousName || "Anonymous"}
                            </span>
                          </div>
                          <h3
                            className={`font-semibold leading-tight mb-2 line-clamp-3 text-white ${
                              isLarge ? "text-2xl md:text-3xl" : "text-lg"
                            }`}
                          >
                            {story.title}
                          </h3>
                          {isLarge && (
                            <p className="text-sm leading-relaxed line-clamp-1 mb-4 text-white/80">
                              {story.metaDescription ||
                                (story.content
                                  ? story.content
                                      .replace(/<[^>]*>/g, "")
                                      .substring(0, 180) + "..."
                                  : "No preview available")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-end">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLike(story);
                              }}
                              className={`p-2 rounded-full transition-colors ${
                                likedStories.has(story._id)
                                  ? "bg-red-500 text-white"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                            >
                              <Heart
                                className="w-4 h-4"
                                fill={
                                  likedStories.has(story._id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave(story._id);
                              }}
                              className={`p-2 rounded-full transition-colors ${
                                savedStories.has(story._id)
                                  ? "bg-blue-500 text-white"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                            >
                              <BookOpen
                                className="w-4 h-4"
                                fill={
                                  savedStories.has(story._id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
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
                  );
                })}
                {featuredStories.length < 3 && (
                  <div className="hidden lg:block bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">More stories coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No featured stories available.</p>
              </div>
            )}
          </section>
        )}

        {/* Latest Stories Section */}
        {!selectedTag && (
          <section className="mb-12">
            <div className="flex items-center gap-4 my-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                Latest Stories
              </h2>
            </div>

            {loadingStates.latest ? (
              <LoadingSkeleton />
            ) : latestByGenre.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
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
              <div className="text-center py-10">
                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No latest stories found.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Selected Tag Section */}
        {selectedTag ? (
          <section>
            <div className="flex max-w-3xl mx-auto items-center gap-4 my-8">
              <h2 className="text-2xl md:text-3xl bold text-gray-900 whitespace-nowrap">
                Top Stories in {selectedTag}
              </h2>
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  No stories found for {selectedTag}.
                </p>
              </div>
            )}
          </section>
        ) : (
          // Top Stories by Genre Sections
          popularTags.map((tag) => (
            <section key={tag} className="mb-16">
              <div className="flex items-center gap-4 my-8">
                <h2 className="text-2xl md:text-3xl text-left font-semibold text-gray-900 whitespace-nowrap">
                  Top Stories in {tag}
                </h2>
              </div>

              {loadingStates.topGenres[tag] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <JournalCardSkeleton key={i} />
                  ))}
                </div>
              ) : topByGenre[tag]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topByGenre[tag].map((story) => (
                    <JournalCard
                      key={story._id}
                      journal={story}
                      onLike={handleLike}
                      onSave={handleSave}
                      isLiked={likedStories.has(story._id)}
                      isSaved={savedStories.has(story._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No stories found for {tag}.</p>
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
