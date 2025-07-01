"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Calendar,
  Flame,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Share2,
  MapPin,
  Award,
  TrendingUp,
} from "lucide-react";
import PublicJournalCard from "../PublicJournals/PublicJournalCard";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/Navbar";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs } from '@dicebear/collection';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 px-8 py-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-500 opacity-20" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Loading profile
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Getting user information...
        </p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 max-w-md">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>

      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Profile Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {error || "This profile doesn't exist or has been removed."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
        <Link
          to="/public-journals"
          className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium"
        >
          Browse Journals
        </Link>
      </div>
    </div>
  </div>
);

// Map of avatar styles
const avatarStyles = {
  avataaars: avataaars,
  bottts: bottts,
  funEmoji: funEmoji,
  miniavs: miniavs,
  croodles: croodles,
  micah: micah,
  pixelArt: pixelArt,
  adventurer: adventurer,
  bigEars: bigEars,
  bigSmile: bigSmile,
  lorelei: lorelei,
  openPeeps: openPeeps,
  personas: personas,
  rings: rings,
  shapes: shapes,
  thumbs: thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ProfileHeader = ({
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
    // Could add toast notification here
  }, []);

  // Banner style logic (use profileTheme)
  const getBannerStyle = () => {
    if (profile.profileTheme?.type === 'color') return { background: profile.profileTheme.value };
    if (profile.profileTheme?.type === 'gradient') return { background: profile.profileTheme.value };
    if (profile.profileTheme?.type === 'texture') return { background: `url(${profile.profileTheme.value})`, backgroundSize: 'contain', backgroundPosition: 'center' };
    // fallback
    return { background: 'linear-gradient(to right, #a18cd1 0%, #fbc2eb 100%)' };
  };

  // Avatar logic (use profileTheme.avatarStyle)
  const avatarUrl = (profile.profileTheme?.avatarStyle && profile.anonymousName)
    ? getAvatarSvg(profile.profileTheme.avatarStyle, profile.anonymousName)
    : getAvatarSvg('avataaars', profile.anonymousName);

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-apple shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover/Header Background */}
      <div className="h-32 relative" style={getBannerStyle()}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-apple transition-colors"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
          {/* Avatar */}
          <motion.div
            className="w-32 h-32 rounded-apple flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-slate-800 flex-shrink-0 bg-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </motion.div>

          {/* Name and Actions */}
          <div className="flex-1 min-w-0 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {profile.anonymousName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Community Member</span>
                  </div>
                </div>
              </div>

              {/* Subscribe Button */}
              {currentUser && profile && currentUser._id !== profile._id && canSubscribe && (
                <motion.button
                  onClick={onSubscribe}
                  disabled={subscribing}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                    isSubscribed
                      ? "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={{ scale: subscribing ? 1 : 1.02 }}
                  whileTap={{ scale: subscribing ? 1 : 0.98 }}
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

        {/* Bio */}
        {profile.bio && (
          <motion.div
            className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.subscriberCount || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.currentStreak || 0}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                days
              </span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Journals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.journalCount || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.longestStreak || 0}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                days
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const JournalsSection = ({ journals, onLike, onShare, onSave, currentUser }) => {
  if (journals.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <BookOpen className="w-16 h-16 text-gray-400" />
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            No public journals yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            This writer hasn't shared any public journals yet. Check back later
            for new stories and insights!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {journals.map((journal) => (
        <PublicJournalCard
          key={journal._id}
          journal={journal}
          onLike={() => onLike(journal._id)}
          onShare={onShare}
          isLiked={journal.likes?.includes(currentUser?._id)}
          isSaved={currentUser && journal.saved && Array.isArray(journal.saved) ? journal.saved.includes(currentUser._id) : false}
          onSave={onSave}
        />
      ))}
    </motion.div>
  );
};

const PublicProfile = () => {
  const { userId, anonymousName } = useParams();
  const [profile, setProfile] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  const getCurrentUser = () => {
    try {
      const itemStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      if (item && item.value) return item.value;
      return item;
    } catch {
      return null;
    }
  };

  const currentUser = useMemo(() => getCurrentUser(), []);

  // Determine if user is logged in
  const isLoggedIn = useMemo(() => !!currentUser, [currentUser]);

  const fetchProfile = useCallback(async () => {
    if (userId) {
      // Fetch by userId
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/profile/id/${userId}`);
        setProfile({
          ...response.data.profile,
          journalCount: response.data.journals?.length || 0,
        });
        const normalizedJournals = (response.data.journals || []).map(
          (journal) => ({
            ...journal,
            createdAt:
              journal.createdAt || journal.date || new Date().toISOString(),
          })
        );
        setJournals(normalizedJournals);
      } catch (error) {
        setError("Profile not found or failed to load");
      } finally {
        setLoading(false);
      }
    } else if (anonymousName) {
      // Fetch by anonymousName (legacy)
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/profile/${anonymousName}`);
        setProfile({
          ...response.data.profile,
          journalCount: response.data.journals?.length || 0,
        });
        const normalizedJournals = (response.data.journals || []).map(
          (journal) => ({
            ...journal,
            createdAt:
              journal.createdAt || journal.date || new Date().toISOString(),
          })
        );
        setJournals(normalizedJournals);
      } catch (error) {
        setError("Profile not found or failed to load");
      } finally {
        setLoading(false);
      }
    }
  }, [userId, anonymousName]);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!currentUser || !profile?._id || currentUser._id === profile._id)
      return;

    try {
      const response = await API.get(
        `/subscription-status/${currentUser._id}/${profile._id}`
      );
      setIsSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  }, [currentUser, profile?._id]);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Check subscription status when profile loads
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
      const response = await API.post("/subscribe", {
        subscriberId: currentUser._id,
        targetUserId: profile._id,
      });
      setIsSubscribed(response.data.subscribed);

      // Update subscriber count locally
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
    async (journalId) => {
      if (!currentUser) {
        openLoginModal();
        return;
      }

      try {
        const response = await API.post(`/journals/${journalId}/like`, {
          userId: currentUser._id,
        });

        setJournals((prevJournals) =>
          prevJournals.map((journal) =>
            journal._id === journalId
              ? {
                  ...journal,
                  likes: response.data.isLiked
                    ? [...journal.likes, currentUser._id]
                    : journal.likes.filter((id) => id !== currentUser._id),
                  likeCount: response.data.likeCount,
                }
              : journal
          )
        );
      } catch (error) {
        console.error("Error liking journal:", error);
      }
    },
    [currentUser, openLoginModal]
  );

  const handleShare = useCallback(
    (journalId) => {
      const journal = journals.find((j) => j._id === journalId);
      if (journal) {
        const url = `${window.location.origin}/publicjournal/${journal.slug}`;
        navigator.clipboard.writeText(url);
      }
    },
    [journals]
  );

  const handleSave = useCallback(async (journalId, shouldSave, setIsSaved) => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    try {
      if (shouldSave) {
        await API.post(`/users/${currentUser._id}/save-journal`, { journalId });
        setIsSaved(true);
      } else {
        await API.post(`/users/${currentUser._id}/unsave-journal`, { journalId });
        setIsSaved(false);
      }
      // Optionally update local state for instant feedback
      setJournals((prev) =>
        prev.map((j) =>
          j._id === journalId ? { ...j, isSaved: shouldSave } : j
        )
      );
    } catch (err) {
      console.error('Error saving/unsaving journal:', err);
    }
  }, [currentUser, openLoginModal]);

  const canSubscribe = useMemo(
    () => currentUser && profile && currentUser._id !== profile._id,
    [currentUser, profile]
  );

  if (loading) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={currentUser}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <LoadingState />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        {isLoggedIn ? (
          <Navbar name="New Entry" link="/journaling-alt" />
        ) : (
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={currentUser}
            openLoginModal={openLoginModal}
            openSignupModal={openSignupModal}
          />
        )}
        <ErrorState error={error} onRetry={fetchProfile} />
      </>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={currentUser}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 mt-10 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Back Navigation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/public-journals"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Journals</span>
            </Link>
          </motion.div>

          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isSubscribed={isSubscribed}
            subscribing={subscribing}
            canSubscribe={isLoggedIn}
            onSubscribe={handleSubscribe}
            currentUser={currentUser}
          />

          {/* Journals Section */}
          <div>
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Public Journals
                </h2>
                {journals.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {journals.length}{" "}
                      {journals.length === 1 ? "journal" : "journals"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <JournalsSection
              journals={journals}
              onLike={handleLike}
              onShare={handleShare}
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
