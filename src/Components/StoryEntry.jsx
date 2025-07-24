"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";
import DashboardNavbar from "./Dashboard/Navbar";
import AuthModals from "./Landing/AuthModals";
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
import JournalCard from "./PublicJournals/PublicStoryCard";
import RecommendationCard from "./PublicJournals/RecommendationCard";
import Comments from "./PublicJournals/Comments";
import "./styles/JournalContent.css";
import { Helmet } from "react-helmet";
import { usePublicStories } from "../context/PublicStoriesContext";

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

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem("user");
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

const StoryEntry = () => {
  const { anonymousName, slug } = useParams();
  const { fetchSingleStory, stories, loading, error, handleLike } =
    usePublicStories();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);
  const currentUser = getCurrentUser();
  const [authorProfile, setAuthorProfile] = useState(null);
  const { modals, openLoginModal, openSignupModal } = AuthModals({});

  const author =
    entry && entry.userId && typeof entry.userId === "object"
      ? entry.userId
      : null;

  useEffect(() => {
    const loadStory = async () => {
      try {
        const story = await fetchSingleStory(anonymousName, slug);
        setEntry(story);
        const wordCount =
          story.content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
        setReadingTime(Math.ceil(wordCount / 200));
      } catch (err) {
        setEntry(null);
      }
    };

    loadStory();
  }, [anonymousName, slug, fetchSingleStory]);

  useEffect(() => {
    setRecommendations([]);
  }, [anonymousName, slug]);

  useEffect(() => {
    if (entry && entry.isPublic && entry._id) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/recommendations?entryId=${entry._id}`
        )
        .then((res) => setRecommendations(res.data.journals || []))
        .catch(() => setRecommendations([]));
    }
  }, [entry]);

  useEffect(() => {
    if (entry) {
      setLikeCount(entry.likeCount || 0);
      if (currentUser && entry.likes && Array.isArray(entry.likes)) {
        setIsLiked(entry.likes.includes(currentUser._id));
      } else {
        setIsLiked(false);
      }
    }
  }, [entry, currentUser]);

  useEffect(() => {
    if (!author || !currentUser || author._id === currentUser._id) return;
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/subscription-status/${
          currentUser._id
        }/${author._id}`
      )
      .then((res) => {
        setIsSubscribed(res.data.isSubscribed || res.data.subscribed);
      })
      .catch(() => setIsSubscribed(false));
  }, [author, currentUser]);

  useEffect(() => {
    if (entry && entry.userId && typeof entry.userId === "object") {
      axios
        .get(`${import.meta.env.VITE_API_URL}/user/${entry.userId._id}`)
        .then((res) => setAuthorProfile(res.data.user))
        .catch(() => setAuthorProfile(null));
    }
  }, [entry]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsActionBarVisible(scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async () => {
    if (!currentUser) {
      alert("Please log in to follow users.");
      return;
    }
    if (!author) return;
    try {
      setSubscribing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/subscribe`,
        {
          subscriberId: currentUser._id,
          targetUserId: author._id,
        }
      );
      setTimeout(() => {
        setIsSubscribed(response.data.subscribed);
        setSubscribing(false);
      }, 1000);
    } catch (error) {
      setSubscribing(false);
      alert("Error following user.");
    }
  };

  const handleStoryLike = async () => {
    if (!currentUser) {
      alert("Please log in to appreciate this story.");
      return;
    }
    setLikeLoading(true);
    try {
      const res = await handleLike(entry);
      setTimeout(() => {
        setLikeCount(res.likeCount);
        setIsLiked(res.isLiked);
        setLikeLoading(false);
      }, 800);
    } catch (err) {
      setLikeLoading(false);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: entry.title || "Untitled Entry",
      text:
        entry.metaDescription || "Check out this story on Starlit Journals!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      alert("Failed to share. Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCommentClick = () => {
    const commentsSection = document.querySelector("#comments");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSave = () => {
    alert("Save functionality will be implemented soon!");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const processContent = (content) => {
    if (!content) return "No content available.";
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        img.style.cssText = `
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2.5rem auto;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        `;
      });
      return tempDiv.innerHTML;
    } catch (error) {
      return content;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-gray-600 font-medium">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Story Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error || "This story doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{entry.title || "Untitled Entry"} | Starlit Journals</title>
        {entry.metaDescription && (
          <meta name="description" content={entry.metaDescription} />
        )}
      </Helmet>

      <DashboardNavbar />
      {modals}

      <div className="min-h-screen bg-white">
        {/* Modern Header */}
        <header className="relative">
          <button
            onClick={handleBack}
            className="fixed top-20 left-6 z-50 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border border-gray-200/50 transition-all duration-200 hover:scale-105"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          {entry.thumbnail ? (
            <div className="relative h-[80vh] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={entry.thumbnail}
                  alt="blurred background"
                  className="w-full h-full object-cover object-center blur-xl scale-110 opacity-50"
                />
              </div>
              <img
                src={entry.thumbnail}
                alt="main thumbnail"
                className="absolute inset-0 mx-auto h-full object-cover object-top z-10"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-end z-30">
                <div className="max-w-4xl mx-auto w-full px-6 pb-16">
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-sm font-medium text-white/90 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                    {entry.title || "Untitled Entry"}
                  </h1>
                  {entry.metaDescription && (
                    <p className="text-lg text-white/85 leading-relaxed max-w-3xl mb-8">
                      {entry.metaDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(entry.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-sm">{readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
              <div className="max-w-4xl mx-auto px-6">
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                  {entry.title || "Untitled Entry"}
                </h1>
                {entry.metaDescription && (
                  <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mb-10">
                    {entry.metaDescription}
                  </p>
                )}
                <div className="flex items-center gap-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDate(entry.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="text-sm">{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {authorProfile && (
                    <>
                      <Link
                        to={`/${authorProfile.anonymousName}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={getAvatarSvg(
                            authorProfile.profileTheme?.avatarStyle ||
                              "avataaars",
                            authorProfile.anonymousName || "Anonymous"
                          )}
                          alt="Author"
                          className="w-14 h-14 rounded-full ring-2 ring-gray-100 hover:ring-gray-200 transition-all"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/${authorProfile.anonymousName}`}
                          className="block"
                        >
                          <h2 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                            {authorProfile.anonymousName || "Anonymous"}
                          </h2>
                        </Link>
                        {authorProfile?.bio && (
                          <p className="text-sm text-gray-600 mt-1 max-w-md line-clamp-2">
                            {authorProfile.bio}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {authorProfile &&
                  currentUser &&
                  authorProfile._id !== currentUser._id && (
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                        isSubscribed
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                      } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {subscribing && (
                        <Loader2
                          size={16}
                          className="inline-block mr-2 animate-spin"
                        />
                      )}
                      {isSubscribed ? "Following" : "Follow"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </header>

        <div className="action-bar-wrapper">
          <main className="max-w-3xl mx-auto px-6 py-16">
            <article
              className="journal-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: processContent(entry.content),
              }}
            />
          </main>

          {entry?.isPublic && (
            <div
              className={`action-bar-container ${
                isActionBarVisible ? "visible" : "invisible"
              } transition-all duration-300 mb-14 `}
            >
              <div className="action-bar flex items-center justify-center px-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-300 max-w-sm mx-auto">
                <button
                  className={`p-2 rounded-full transition-all duration-200 hover:bg-gray-100 ${
                    isLiked ? "text-red-500" : "text-gray-600"
                  } ${likeLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={handleStoryLike}
                  disabled={likeLoading}
                  title={`${isLiked ? "Unlike" : "Like"} (${likeCount})`}
                >
                  <Heart size={20} className={isLiked ? "fill-current" : ""} />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-1" />
                <button
                  className="p-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  onClick={handleCommentClick}
                  title="Comments"
                >
                  <MessageCircle size={20} />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-1" />
                <button
                  className="p-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  onClick={handleSave}
                  title="Save"
                >
                  <Bookmark size={20} />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-1" />
                <button
                  className="p-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  onClick={handleShare}
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {entry?.isPublic && (
          <section id="comments" className="max-w-3xl mx-auto px-6 ">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Comments</h2>
            <Comments journalId={entry._id} />
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pb-16">
            <h2 className="text-xl uppercase text-center mb-12 text-gray-600">
              More to Read
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 9).map((recommendation) => (
                <RecommendationCard
                  key={recommendation._id}
                  journal={recommendation}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default StoryEntry;
