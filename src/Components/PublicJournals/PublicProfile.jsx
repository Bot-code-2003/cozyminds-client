"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Share2,
  MapPin,
} from "lucide-react";
import JournalCard from "./PublicStoryCard"; // Adjusted import path
import Navbar from "../Dashboard/Navbar";
import AuthModals from "../Landing/AuthModals";
import { motion } from "framer-motion";
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

// Fallback placeholder image
const FALLBACK_THUMBNAIL = "https://via.placeholder.com/150?text=No+Image";

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 bg-white px-8 py-12 rounded-2xl shadow-xl border border-gray-200">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-600/20" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Loading profile
        </h3>
        <p className="text-sm text-gray-500">Getting user information...</p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold mb-3 text-gray-900">
        Profile Not Found
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {error || "This profile doesn't exist or has been removed."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
        <Link
          to="/public-journals"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Browse Journals
        </Link>
      </div>
    </div>
  </div>
);

const ProfileHeader = memo(
  ({
    profile,
    isSubscribed,
    subscribing,
    canSubscribe,
    onSubscribe,
    currentUser,
  }) => {
    const joinDate = useMemo(() => {
      if (!profile?.createdAt) return "";
      return new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }, [profile?.createdAt]);

    const handleShare = useCallback(() => {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }, []);

    const getBannerStyle = useCallback(() => {
      if (profile.profileTheme?.type === "color")
        return { background: profile.profileTheme.value };
      if (profile.profileTheme?.type === "gradient")
        return { background: profile.profileTheme.value };
      if (profile.profileTheme?.type === "texture")
        return {
          background: `url(${profile.profileTheme.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      return {
        background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
      };
    }, [profile.profileTheme]);

    const avatarUrl = profile.anonymousName
      ? getAvatarSvg(
          profile.profileTheme?.avatarStyle || "avataaars",
          profile.anonymousName
        )
      : getAvatarSvg("avataaars", "default");

    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-32 sm:h-40 relative" style={getBannerStyle()}>
          <div className="absolute inset-0 bg-black/10" />
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Share profile"
            aria-label="Share profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20 relative z-10">
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-md border-4 border-white bg-gray-100"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src={avatarUrl}
                alt={`Avatar of ${profile.anonymousName}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {profile.anonymousName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <span>Joined {joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>Community Member</span>
                    </div>
                  </div>
                </div>

                {canSubscribe && (
                  <motion.button
                    onClick={onSubscribe}
                    disabled={subscribing}
                    className={`px-4 py-2 rounded-xl font-medium transition-all shadow-sm hover:shadow-md ${
                      isSubscribed
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                    whileHover={{ scale: subscribing ? 1 : 1.05 }}
                    whileTap={{ scale: subscribing ? 1 : 0.95 }}
                    aria-label={isSubscribed ? "Unfollow" : "Follow"}
                  >
                    {subscribing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : isSubscribed ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <motion.div
              className="mt-4 p-4 bg-gray-50 rounded-xl text-gray-700 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p>{profile.bio}</p>
            </motion.div>
          )}

          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Journals</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {profile.journalCount || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Followers</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {profile.subscriberCount || 0}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

ProfileHeader.displayName = "ProfileHeader";

const JournalsSection = memo(({ journals, onLike, onSave, currentUser }) => {
  if (journals.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            No public journals yet
          </h3>
          <p className="text-gray-500 text-sm">
            This writer hasn't shared any public journals yet. Check back later
            for new stories and insights!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-1  gap-4 sm:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {journals.map((journal) => (
        <JournalCard
          key={journal._id}
          journal={journal}
          onLike={onLike}
          onSave={onSave}
          isLiked={journal.likes?.includes(currentUser?._id) || false}
          isSaved={currentUser?.savedEntries?.includes(journal._id) || false}
        />
      ))}
    </motion.div>
  );
});

JournalsSection.displayName = "JournalsSection";

const PublicProfile = () => {
  const { anonymousName } = useParams();
  const [profile, setProfile] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { modals, openLoginModal } = AuthModals({});

  const getCurrentUser = useCallback(() => {
    try {
      const itemStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      return item?.value || item;
    } catch {
      return null;
    }
  }, []);

  const currentUser = useMemo(() => getCurrentUser(), [getCurrentUser]);
  const canSubscribe = useMemo(
    () => currentUser && profile && currentUser._id !== profile._id,
    [currentUser, profile]
  );

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get(`/profile/${anonymousName}`, {
        timeout: 5000,
      });
      console.log("API Response:", response.data); // Debug log
      const profileData = response.data.profile;
      const journalsData = (response.data.journals || []).map((journal) => ({
        ...journal,
        createdAt:
          journal.createdAt || journal.date || new Date().toISOString(),
        thumbnail: journal.thumbnail || null,
        content: journal.content || "",
        author: journal.userId
          ? {
              userId: journal.userId._id,
              anonymousName: journal.userId.anonymousName,
              profileTheme: journal.userId.profileTheme,
            }
          : null,
      }));
      setProfile({
        ...profileData,
        journalCount: journalsData.length,
        subscriberCount: profileData.subscriberCount || 0,
      });
      setJournals(journalsData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Profile not found or failed to load");
    } finally {
      setLoading(false);
    }
  }, [anonymousName]);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!currentUser || !profile?._id || currentUser._id === profile._id)
      return;
    try {
      const response = await API.get(
        `/subscription-status/${currentUser._id}/${profile._id}`,
        {
          timeout: 5000,
        }
      );
      setIsSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  }, [currentUser, profile?._id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const handleSubscribe = useCallback(async () => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    if (!profile) return;
    try {
      setSubscribing(true);
      const response = await API.post(
        "/subscribe",
        {
          subscriberId: currentUser._id,
          targetUserId: profile._id,
        },
        { timeout: 5000 }
      );
      setIsSubscribed(response.data.subscribed);
      setProfile((prev) => ({
        ...prev,
        subscriberCount:
          prev.subscriberCount + (response.data.subscribed ? 1 : -1),
      }));
    } catch (error) {
      console.error("Error handling subscription:", error);
    } finally {
      setSubscribing(false);
    }
  }, [currentUser, profile, openLoginModal]);

  const handleLike = useCallback(
    async (journal) => {
      if (!currentUser) {
        openLoginModal();
        return;
      }
      try {
        const response = await API.post(`/journals/${journal._id}/like`, {
          userId: currentUser._id,
        });
        setJournals((prevJournals) =>
          prevJournals.map((j) =>
            j._id === journal._id
              ? {
                  ...j,
                  likes: response.data.isLiked
                    ? [...(j.likes || []), currentUser._id]
                    : (j.likes || []).filter((id) => id !== currentUser._id),
                  likeCount: response.data.likeCount,
                }
              : j
          )
        );
      } catch (error) {
        console.error("Error liking journal:", error);
      }
    },
    [currentUser, openLoginModal]
  );

  const handleSave = useCallback(
    async (journalId, shouldSave) => {
      if (!currentUser) {
        openLoginModal();
        return;
      }
      try {
        await API.post(
          shouldSave
            ? `/users/${currentUser._id}/save-journal`
            : `/users/${currentUser._id}/unsave-journal`,
          { journalId },
          { timeout: 5000 }
        );
        setJournals((prev) =>
          prev.map((j) =>
            j._id === journalId
              ? {
                  ...j,
                  savedEntries: shouldSave
                    ? [...(j.savedEntries || []), currentUser._id]
                    : (j.savedEntries || []).filter(
                        (id) => id !== currentUser._id
                      ),
                }
              : j
          )
        );
      } catch (error) {
        console.error("Error saving/unsaving journal:", error);
      }
    },
    [currentUser, openLoginModal]
  );

  if (loading) {
    return (
      <>
        {currentUser ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <Navbar user={currentUser} openLoginModal={openLoginModal} />
        )}
        <LoadingState />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        {currentUser ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <Navbar user={currentUser} openLoginModal={openLoginModal} />
        )}
        <ErrorState error={error} onRetry={fetchProfile} />
      </>
    );
  }

  return (
    <>
      {currentUser ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <Navbar user={currentUser} openLoginModal={openLoginModal} />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileHeader
            profile={profile}
            isSubscribed={isSubscribed}
            subscribing={subscribing}
            canSubscribe={canSubscribe}
            onSubscribe={handleSubscribe}
            currentUser={currentUser}
          />
          <div className="max-w-3xl mx-auto my-8">
            <div className=" flex items-center justify-center gap-4 mt-10 mx-4">
              <div className="flex-1 h-px bg-gray-300" />
              <h2 className="text-center text-xl  uppercase text-gray-600 whitespace-nowrap">
                Public Journals
              </h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <JournalsSection
              journals={journals}
              onLike={handleLike}
              onSave={handleSave}
              currentUser={currentUser}
            />
          </div>
        </div>
        {modals}
      </div>
    </>
  );
};

export default PublicProfile;
