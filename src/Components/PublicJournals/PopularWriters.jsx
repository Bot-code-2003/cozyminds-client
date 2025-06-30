import { useState, useMemo, useCallback, useEffect } from "react";
import { Users, Crown, BookOpen, Heart, UserPlus, UserCheck, Info, TrendingUp, Clock, Star } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useDarkMode } from "../../context/ThemeContext";
import AuthModals from "../Landing/AuthModals";
import { Link } from "react-router-dom";
import axios from "axios";
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs } from '@dicebear/collection';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const avatarStyles = {
  avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs,
};

const getDeterministicAvatarStyle = (seed) => {
  const styles = Object.keys(avatarStyles);
  if (!seed) return styles[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return styles[Math.abs(hash) % styles.length];
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avatarStyles['avataaars'];
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PopularWriters = ({ onWriterClick, isLoggedIn }) => {
  const { popularWriters, loading, error, refreshSidebar } = useSidebar();
  const [followedWriters, setFollowedWriters] = useState(new Set());
  const [updatingFollow, setUpdatingFollow] = useState(new Set());
  const [writerFollowStatus, setWriterFollowStatus] = useState({});

  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  const user = useMemo(() => {
    if (!isLoggedIn) return null;
    try {
      const itemStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      if (item && item.value) return item.value;
      return item;
    } catch {
      return null;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.subscribedTo) {
      setFollowedWriters(new Set(user.subscribedTo));
    }
  }, [user]);

  useEffect(() => {
    if (!user || !popularWriters.length) return;
    const fetchStatuses = async () => {
      const statusMap = {};
      await Promise.all(popularWriters.map(async (writer) => {
        if (writer.userId === user._id) return; // skip self
        try {
          const res = await API.get(`/subscription-status/${user._id}/${writer.userId}`);
          statusMap[writer.userId] = res.data.isSubscribed;
        } catch {
          statusMap[writer.userId] = false;
        }
      }));
      setWriterFollowStatus(statusMap);
    };
    fetchStatuses();
  }, [user, popularWriters]);

  const handleFollow = useCallback(async (e, targetUserId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openLoginModal();
      return;
    }

    setUpdatingFollow(prev => new Set(prev).add(targetUserId));

    try {
      const response = await API.post('/subscribe', {
        subscriberId: user._id,
        targetUserId
      });
      const isNowSubscribed = response.data.subscribed;
      setWriterFollowStatus(prev => ({ ...prev, [targetUserId]: isNowSubscribed }));
      refreshSidebar(); // Refresh sidebar data
    } catch (err) {
      // Optionally show error
    } finally {
      setUpdatingFollow(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  }, [user, openLoginModal, refreshSidebar]);

  if (loading) return <div>Loading writers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="space-y-2">
        {popularWriters.map((writer) => {
          const isFollowed = writerFollowStatus[writer.userId] || false;
          const isUpdating = updatingFollow.has(writer.userId);
          const canSubscribe = user && writer.userId && String(user._id) !== String(writer.userId);

          return (
            <div
              key={writer.userId}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200 group"
            >
              <Link
                to={`/profile/id/${writer.userId}`}
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={getAvatarSvg(
                      writer.profileTheme?.avatarStyle || getDeterministicAvatarStyle(writer.anonymousName),
                      writer.anonymousName
                    )}
                    alt={writer.anonymousName}
                    className="w-10 h-10 rounded-full"
                    draggable="false"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[var(--accent)]">
                    {writer.anonymousName || "Anonymous"}
                  </p>
                  {writer.bio && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">
                      {writer.bio}
                    </p>
                  )}
                  {writer.popularityScore && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[var(--accent)] font-medium">
                        Score: {Math.round(writer.popularityScore)}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {writer.journalCount} posts
                      </span>
                      {writer.recentPosts > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          • {writer.recentPosts} recent
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>

              {isLoggedIn && canSubscribe && (
                <button
                  onClick={(e) => handleFollow(e, writer.userId)}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 flex-shrink-0 disabled:opacity-50 ${
                    isFollowed
                      ? "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300"
                      : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                  }`}
                >
                  {isFollowed ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {modals}
    </>
  );
};

export default PopularWriters; 