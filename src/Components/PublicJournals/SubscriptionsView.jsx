"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Calendar,
  Flame,
  BookOpen,
  Loader2,
  AlertCircle,
  Bell,
  UserPlus,
  Check,
  BellOff,
} from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const SubscriptionsView = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await API.get(`/subscriptions/${currentUser._id}`);
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const markNotificationsAsChecked = useCallback(async () => {
    if (!currentUser) return;

    try {
      await API.post(`/notifications/mark-checked/${currentUser._id}`);
      setSubscriptions((prev) =>
        prev.map((sub) => ({
          ...sub,
          hasNewContent: false,
          newJournalsCount: 0,
        }))
      );
    } catch (error) {
      console.error("Error marking notifications as checked:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const hasNotifications = subscriptions.some((sub) => sub.hasNewContent);

  const handleBack = () => {
    navigate('/public-journals');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading your subscriptions...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-apple shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="px-6 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-600 font-medium mb-4 transition-colors"
          >
            ← Back to Journals
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Following
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Writers you follow • {subscriptions.length}{" "}
                {subscriptions.length === 1 ? "subscription" : "subscriptions"}
              </p>
            </div>

            {hasNotifications && (
              <button
                onClick={markNotificationsAsChecked}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-apple flex items-center justify-center mx-auto mb-6">
              <UserPlus size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No subscriptions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start following writers to see their profiles here and get
              notified when they publish new journals.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-apple hover:bg-blue-600 transition-colors font-medium"
            >
              Discover Writers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <Link
                key={subscription._id}
                to={`/profile/${subscription.anonymousName}`}
                className="group bg-white dark:bg-slate-800 rounded-apple p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
              >
                {/* Notification indicator */}
                {subscription.hasNewContent && (
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 font-medium">
                      {subscription.newJournalsCount} new{" "}
                      {subscription.newJournalsCount === 1 ? "post" : "posts"}
                    </span>
                  </div>
                )}

                {/* Avatar and basic info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-apple flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                      {subscription.anonymousName?.charAt(0).toUpperCase() ||
                        "A"}
                    </div>
                    {subscription.hasNewContent && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-apple flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-white rounded-apple" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {subscription.anonymousName}
                    </h3>
                    {subscription.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {subscription.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="w-3 h-3" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {subscription.subscriberCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                      <Flame className="w-3 h-3" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {subscription.currentStreak || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Streak
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                      <BookOpen className="w-3 h-3" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {subscription.totalJournals || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Posts
                    </p>
                  </div>
                </div>

                {/* Join date */}
                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Joined{" "}
                    {new Date(subscription.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                      }
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsView;
