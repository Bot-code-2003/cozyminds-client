"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Users, Bell, Loader2, UserPlus } from 'lucide-react'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

const SubscriptionSidebar = ({ currentUser }) => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoize currentUser ID to prevent unnecessary re-renders
  const currentUserId = useMemo(() => currentUser?._id, [currentUser?._id])

  const fetchSubscriptions = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const response = await API.get(`/subscriptions/${currentUserId}`)
      setSubscriptions(response.data.subscriptions || [])
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      setError("Failed to load subscriptions")
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const markNotificationsAsChecked = useCallback(async () => {
    if (!currentUserId) return

    try {
      await API.post(`/notifications/mark-checked/${currentUserId}`)
      setSubscriptions(prev => 
        prev.map(sub => ({ 
          ...sub, 
          hasNewContent: false, 
          newJournalsCount: 0 
        }))
      )
    } catch (error) {
      console.error("Error marking notifications as checked:", error)
    }
  }, [currentUserId])

  const hasNotifications = useMemo(() => 
    subscriptions.some(sub => sub.hasNewContent), 
    [subscriptions]
  )

  if (!currentUser) {
    return (
      <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Subscriptions
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Sign in to follow your favorite writers and get notified of new posts
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Subscriptions
          </h3>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Subscriptions
        </h3>
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Subscriptions
        </h3>
        {hasNotifications && (
          <button 
            onClick={markNotificationsAsChecked}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No subscriptions yet. Start following writers to see their latest posts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {subscriptions.map((subscription) => (
            <Link
              key={subscription._id}
              to={`/profile/${subscription.anonymousName}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              {/* Avatar with notification indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {subscription.anonymousName?.charAt(0).toUpperCase() || "A"}
                </div>
                {subscription.hasNewContent && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {subscription.anonymousName}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{subscription.subscriberCount || 0}</span>
                  </div>
                  {subscription.hasNewContent && (
                    <div className="flex items-center gap-1 text-red-500">
                      <Bell className="w-3 h-3" />
                      <span className="font-medium">
                        {subscription.newJournalsCount} new
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SubscriptionSidebar
