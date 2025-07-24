import React, { useState, useEffect, useCallback } from "react";
import { Clock, Heart, MessageSquare, BookOpen } from "lucide-react";
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
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedTag
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
    <div
      className="relative bg-cover bg-center rounded-none border-0 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        backgroundImage: `url(${thumbnail || "/default-book-bg.jpg"})`,
        aspectRatio: "4/5",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-20"></div>
      <div className="relative z-10 h-full flex flex-col justify-end p-4">
        <div className="bg-white bg-opacity-90 p-3 rounded-t-lg">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-tight">
            {story.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full" />
            <span className="text-sm text-gray-600">
              {story.author?.anonymousName || "Anonymous"}
            </span>
          </div>
          <div className="mt-2">
            <span className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded">
              {story.genre}
            </span>
          </div>
        </div>
      </div>
      <a
        href={`/${story.author?.anonymousName || "anonymous"}/${story.slug}`}
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
};

const PublicStories = () => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestByGenre, setLatestByGenre] = useState([]);
  const [topByGenre, setTopByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedStories, setLikedStories] = useState(new Set());
  const [savedStories, setSavedStories] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState(null);

  const popularTags = [
    "Fantasy",
    "Horror",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Adventure",
    "Drama",
    "Comedy",
  ];

  const { darkMode } = useDarkMode();
  const { modals } = AuthModals({ darkMode });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tagFromRoute = location.state?.selectedTag || null;
    if (tagFromRoute !== selectedTag) {
      setSelectedTag(tagFromRoute);
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

  const fetchFeaturedStories = useCallback(async () => {
    try {
      const response = await API.get("/stories/top-liked");
      const stories = response.data.stories || [];
      setFeaturedStories(stories);
      const user = getCurrentUser();
      if (user) {
        setLikedStories(
          new Set(
            stories.filter((s) => s.likes?.includes(user._id)).map((s) => s._id)
          )
        );
        setSavedStories(
          new Set(
            stories
              .filter((s) => user.savedEntries?.includes(s._id))
              .map((s) => s._id)
          )
        );
      }
    } catch (error) {
      console.error("Error fetching featured stories:", error);
    }
  }, []);

  const fetchLatestByGenre = useCallback(async () => {
    try {
      const response = await API.get("/stories/latest-by-genre", {
        params: { genres: popularTags.join(",") },
      });
      const stories = response.data.stories || [];
      setLatestByGenre(stories);
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
    } catch (error) {
      console.error("Error fetching latest stories by genre:", error);
      setError("Failed to fetch latest stories by genre");
    }
  }, []);

  const fetchTopByGenre = useCallback(async () => {
    try {
      const genreData = {};
      for (const tag of popularTags) {
        const response = await API.get(
          `/stories/top-by-genre/${encodeURIComponent(tag)}`
        );
        genreData[tag] = response.data.stories || [];
      }
      setTopByGenre(genreData);
      const user = getCurrentUser();
      if (user) {
        const allStories = Object.values(genreData).flat();
        setLikedStories(
          (prev) =>
            new Set([
              ...prev,
              ...allStories
                .filter((s) => s.likes?.includes(user._id))
                .map((s) => s._id),
            ])
        );
        setSavedStories(
          (prev) =>
            new Set([
              ...prev,
              ...allStories
                .filter((s) => user.savedEntries?.includes(s._id))
                .map((s) => s._id),
            ])
        );
      }
    } catch (error) {
      console.error("Error fetching top stories by genre:", error);
      setError("Failed to fetch top stories by genre");
    }
  }, []);

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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFeaturedStories(),
      fetchLatestByGenre(),
      fetchTopByGenre(),
    ]).finally(() => setLoading(false));
  }, [fetchFeaturedStories, fetchLatestByGenre, fetchTopByGenre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TagFilters
          tags={popularTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              Promise.all([
                fetchFeaturedStories(),
                fetchLatestByGenre(),
                fetchTopByGenre(),
              ]);
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
    <div className="min-h-screen bg-gray-50">
      <TagFilters
        tags={popularTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedTag && featuredStories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Stories
              </h2>
            </div>
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
                      group rounded-lg relative overflow-hidden bg-gray-900 border border-gray-800 hover:shadow-lg transition-all duration-300
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
                          className={`font-bold leading-tight mb-2 line-clamp-3 text-white ${
                            isLarge ? "text-2xl" : "text-lg"
                          }`}
                        >
                          {story.title}
                        </h3>
                        {isLarge && (
                          <p className="text-sm leading-relaxed line-clamp-3 mb-4 text-white/80">
                            {story.metaDescription ||
                              (story.content
                                ? story.content
                                    .replace(/<[^>]*>/g, "")
                                    .substring(0, 120) + "..."
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
          </section>
        )}

        {!selectedTag && (
          <section className=" mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">
                Latest by Genre
              </h2>
            </div>
            {latestByGenre.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No stories found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestByGenre.map((story) => (
                  <LatestStoryCard
                    key={story._id}
                    story={story}
                    likedStories={likedStories}
                    savedStories={savedStories}
                    // handleLike={handleLike}
                    // handleSave={handleSave}
                    getAvatarSvg={getAvatarSvg}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {selectedTag ? (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">
                Top Stories in {selectedTag}
              </h2>
            </div>
            {topByGenre[selectedTag]?.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  No stories found for {selectedTag}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topByGenre[selectedTag]?.map((story) => (
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
            )}
          </section>
        ) : (
          popularTags.map((tag) => (
            <section key={tag} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-5 h-5 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Top Stories in {tag}
                </h2>
              </div>
              {topByGenre[tag]?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No stories found for {tag}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topByGenre[tag]?.map((story) => (
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
