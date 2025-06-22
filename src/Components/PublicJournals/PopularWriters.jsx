import { useState, useEffect, useMemo, useCallback } from "react";
import { Users, Crown, BookOpen, Heart, UserPlus, UserCheck } from "lucide-react";
import axios from "axios";
import { useDarkMode } from "../../context/ThemeContext";
import AuthModals from "../Landing/AuthModals";
import { Link } from "react-router-dom";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const PopularWriters = ({ onWriterClick, isLoggedIn }) => {
  const [popularWriters, setPopularWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followedWriters, setFollowedWriters] = useState(new Set());
  const [updatingFollow, setUpdatingFollow] = useState(new Set());

  const { darkMode } = useDarkMode();
  const { modals, openLoginModal } = AuthModals({ darkMode });

  const user = useMemo(() => {
    if (!isLoggedIn) return null;
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.subscribedTo) {
      setFollowedWriters(new Set(user.subscribedTo));
    }

    const fetchPopularWriters = async () => {
      try {
        setLoading(true);
        const response = await API.get("/popular-writers?limit=6");
        setPopularWriters(response.data.popularWriters || []);
      } catch (err) {
        setError("Failed to load writers");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularWriters();
  }, [user]);

  const handleFollow = useCallback(async (e, targetUserId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openLoginModal();
      return;
    }

    const isCurrentlyFollowed = followedWriters.has(targetUserId);
    setUpdatingFollow(prev => new Set(prev).add(targetUserId));

    // Optimistic update
    setFollowedWriters(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyFollowed) {
        newSet.delete(targetUserId);
      } else {
        newSet.add(targetUserId);
      }
      return newSet;
    });

    try {
      const endpoint = isCurrentlyFollowed ? '/subscriptions/unsubscribe' : '/subscriptions/subscribe';
      await API.post(endpoint, { userId: user._id, targetUserId });

      // Update session storage for persistence across the app
      const updatedUser = {
        ...user,
        subscribedTo: Array.from(followedWriters)
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err) {
      // Revert on error
      setFollowedWriters(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyFollowed) {
          newSet.add(targetUserId);
        } else {
          newSet.delete(targetUserId);
        }
        return newSet;
      });
    } finally {
      setUpdatingFollow(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  }, [user, openLoginModal, followedWriters]);

  if (loading) return <div>Loading writers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="space-y-2">
        {popularWriters.map((writer) => {
          const isFollowed = followedWriters.has(writer.userId);
          const isUpdating = updatingFollow.has(writer.userId);
          const isSelf = user?.anonymousName === writer.anonymousName;

          return (
            <div
              key={writer.userId}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200 group"
            >
              <Link 
                to={`/profile/${writer.anonymousName}`} 
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-lg flex-shrink-0">
                  {writer.anonymousName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[var(--accent)]">
                    {writer.anonymousName || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {writer.totalLikes} likes
                  </p>
                </div>
              </Link>

              {isLoggedIn && !isSelf && (
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