"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import axios from "axios"

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000" })

const PublicJournalsContext = createContext()

export function PublicJournalsProvider({ children }) {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [likedJournals, setLikedJournals] = useState(new Set())
  const [savedJournals, setSavedJournals] = useState(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [feedType, setFeedType] = useState("-createdAt")
  const [hasInitialFetch, setHasInitialFetch] = useState(false)
  const [singleJournalLoading, setSingleJournalLoading] = useState(false)
  const [singleJournalError, setSingleJournalError] = useState(null)
  const [showFollowingOnly, setShowFollowingOnly] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)

  const getCurrentUser = () => {
    try {
      const itemStr = localStorage.getItem("user")
      if (!itemStr) return null
      const item = JSON.parse(itemStr)
      if (item && item.value) return item.value
      return item
    } catch {
      return null
    }
  }

  const fetchJournalsByTag = useCallback(
    async (tag, pageNum = 1, append = false) => {
      try {
        setLoading(!append)
        setLoadingMore(append)
        setError(null)
        setSelectedTag(tag)

        const params = {
          page: pageNum,
          limit: 20,
          sort: feedType,
        }

        // Add category filter if current category is set
        if (currentCategory) {
          params.category = currentCategory
        }

        console.log('Fetching journals by tag:', tag, 'with params:', params)

        const response = await API.get(`/journals/by-tag/${encodeURIComponent(tag)}`, { params })
        const { journals: newJournals, hasMore: moreAvailable } = response.data

        console.log('Fetched journals by tag:', newJournals.length, 'journals')

        setJournals((prev) => (append ? [...prev, ...newJournals] : newJournals))
        setHasMore(moreAvailable)
        setPage(pageNum)

        const userData = getCurrentUser()
        if (userData) {
          const likedSet = new Set(
            newJournals.filter((journal) => journal.likes?.includes(userData._id)).map((journal) => journal._id),
          )
          setLikedJournals((prev) => (append ? new Set([...prev, ...likedSet]) : likedSet))

          const savedSet = new Set(
            newJournals.filter((journal) => userData.savedEntries?.includes(journal._id)).map((journal) => journal._id),
          )
          setSavedJournals((prev) => (append ? new Set([...prev, ...savedSet]) : savedSet))
        }
      } catch (error) {
        console.error("Error fetching journals by tag:", error)
        setError("Failed to fetch journals for this tag. Please try again.")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [feedType, currentCategory],
  )

  const fetchJournals = useCallback(
    async (pageNum = 1, currentFeedType = feedType, append = false, category = null) => {
      try {
        console.log('fetchJournals called with:', { pageNum, currentFeedType, append, category })
        
        // Reset selected tag when fetching all journals
        if (pageNum === 1 && !append) {
          setSelectedTag(null)
        }

        // Update current category if provided
        if (category !== null && category !== currentCategory) {
          setCurrentCategory(category)
          setHasInitialFetch(false)
        }

        setLoading(!append)
        setLoadingMore(append)
        setError(null)

        const userData = getCurrentUser()
        const params = {
          page: pageNum,
          limit: 20,
          sort: currentFeedType,
        }

        // Add category filter if specified
        if (category) {
          params.category = category
        } else if (currentCategory) {
          params.category = currentCategory
        }

        console.log('API call params:', params)

        let response
        if (showFollowingOnly && userData) {
          response = await API.get(`/feed/${userData._id}`, { params })
        } else {
          response = await API.get("/journals/public", { params })
        }

        console.log('API response:', response.data)

        const { journals: newJournals, hasMore: moreAvailable } = response.data

        console.log('Fetched journals:', newJournals.length, 'journals')

        setJournals((prev) => (append ? [...prev, ...newJournals] : newJournals))
        setHasMore(moreAvailable)
        setPage(pageNum)
        setHasInitialFetch(true)
        setFeedType(currentFeedType)

        if (userData) {
          const likedSet = new Set(
            newJournals.filter((journal) => journal.likes?.includes(userData._id)).map((journal) => journal._id),
          )
          setLikedJournals((prev) => (append ? new Set([...prev, ...likedSet]) : likedSet))

          const savedSet = new Set(
            newJournals.filter((journal) => userData.savedEntries?.includes(journal._id)).map((journal) => journal._id),
          )
          setSavedJournals((prev) => (append ? new Set([...prev, ...savedSet]) : savedSet))
        }
      } catch (error) {
        console.error("Error fetching journals:", error)
        setError("Failed to fetch journals. Please try again.")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [feedType, showFollowingOnly, currentCategory],
  )

  const fetchSavedJournals = useCallback(async (userId, pageNum = 1, append = false) => {
    try {
      setLoading(!append)
      setLoadingMore(append)
      setError(null)

      const response = await API.get(`/journals/saved/${userId}`, {
        params: { page: pageNum, limit: 20 },
      })
      const { journals: newJournals, hasMore: moreAvailable } = response.data

      setJournals((prev) => (append ? [...prev, ...newJournals] : newJournals))
      setHasMore(moreAvailable)
      setPage(pageNum)

      const savedSet = new Set(newJournals.map((j) => j._id))
      setSavedJournals((prev) => (append ? new Set([...prev, ...savedSet]) : savedSet))
    } catch (error) {
      console.error("Error fetching saved journals:", error)
      setError("Failed to fetch saved journals. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const fetchSingleJournalBySlug = useCallback(
    async (slug) => {
      const existingJournal = journals.find((journal) => journal.slug === slug)
      if (existingJournal) {
        return existingJournal
      }

      try {
        setSingleJournalLoading(true)
        setSingleJournalError(null)
        const response = await API.get(`/journals/singlepublic/${slug}`)
        const fetchedJournal = response.data

        setJournals((prevJournals) => {
          if (!prevJournals.some((j) => j.slug === fetchedJournal.slug)) {
            return [...prevJournals, fetchedJournal]
          }
          return prevJournals
        })

        return fetchedJournal
      } catch (error) {
        console.error("Error fetching single public journal:", error)
        setSingleJournalError(error.response?.data?.message || "Failed to fetch single journal.")
        throw error
      } finally {
        setSingleJournalLoading(false)
      }
    },
    [journals],
  )

  const handleSave = useCallback(
    async (journalId) => {
      const userData = getCurrentUser()
      if (!userData) return

      const user = userData
      const currentIsSaved = savedJournals.has(journalId)

      // Optimistic update
      setSavedJournals((prev) => {
        const newSet = new Set(prev)
        if (currentIsSaved) {
          newSet.delete(journalId)
        } else {
          newSet.add(journalId)
        }
        return newSet
      })

      try {
        await API.post(`/journals/${journalId}/save`, { userId: user._id })
      } catch (error) {
        // Revert optimistic update
        setSavedJournals((prev) => {
          const newSet = new Set(prev)
          if (currentIsSaved) {
            newSet.add(journalId)
          } else {
            newSet.delete(journalId)
          }
          return newSet
        })
        console.error("Error saving journal:", error)
      }
    },
    [savedJournals],
  )

  const handleLike = useCallback(
    async (journal) => {
      const userData = getCurrentUser()
      if (!userData) {
        return
      }

      const user = userData
      const journalId = journal._id
      const currentIsLiked = likedJournals.has(journalId)
      let updatedJournal = null

      // Optimistic update
      setLikedJournals((prev) => {
        const newSet = new Set(prev)
        if (currentIsLiked) {
          newSet.delete(journalId)
        } else {
          newSet.add(journalId)
        }
        return newSet
      })

      setJournals((prevJournals) => {
        const newJournals = prevJournals.map((j) => {
          if (j._id === journalId) {
            updatedJournal = {
              ...j,
              likeCount: j.likeCount + (currentIsLiked ? -1 : 1),
              likes: currentIsLiked ? (j.likes || []).filter((id) => id !== user._id) : [...(j.likes || []), user._id],
            }
            return updatedJournal
          }
          return j
        })
        return newJournals
      })

      try {
        await API.post(`/journals/${journalId}/like`, { userId: user._id })
        return updatedJournal
      } catch (error) {
        // Revert optimistic update on error
        setLikedJournals((prev) => {
          const newSet = new Set(prev)
          if (currentIsLiked) {
            newSet.add(journalId)
          } else {
            newSet.delete(journalId)
          }
          return newSet
        })

        setJournals((prevJournals) =>
          prevJournals.map((j) =>
            j._id === journalId ? { ...j, likeCount: journal.likeCount, likes: journal.likes } : j,
          ),
        )
        console.error("Error liking journal:", error)
        throw error
      }
    },
    [likedJournals],
  )

  const handleFeedTypeChange = useCallback(
    (newFeedType) => {
      if (newFeedType !== feedType) {
        setFeedType(newFeedType)
        fetchJournals(1, newFeedType, false, currentCategory)
      }
    },
    [feedType, fetchJournals, currentCategory],
  )

  const toggleFollowingOnly = useCallback(() => {
    const newShowFollowingOnly = !showFollowingOnly
    setShowFollowingOnly(newShowFollowingOnly)
    fetchJournals(1, feedType, false, currentCategory)
  }, [showFollowingOnly, feedType, fetchJournals, currentCategory])

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      if (selectedTag) {
        fetchJournalsByTag(selectedTag, page + 1, true)
      } else {
        fetchJournals(page + 1, feedType, true, currentCategory)
      }
    }
  }, [page, hasMore, loadingMore, feedType, fetchJournals, selectedTag, fetchJournalsByTag, currentCategory])

  const handleTagSelect = useCallback(
    (tag) => {
      fetchJournalsByTag(tag, 1, false)
      window.scrollTo(0, 0)
    },
    [fetchJournalsByTag],
  )

  // Reset state when category changes
  const resetForNewCategory = useCallback((newCategory) => {
    console.log('Resetting for new category:', newCategory)
    setJournals([])
    setPage(1)
    setHasMore(true)
    setSelectedTag(null)
    setCurrentCategory(newCategory)
    setHasInitialFetch(false)
  }, [])

  const value = {
    journals,
    loading,
    loadingMore,
    error,
    likedJournals,
    savedJournals,
    hasMore,
    feedType,
    showFollowingOnly,
    currentCategory,
    fetchJournals,
    fetchSavedJournals,
    handleLike,
    handleSave,
    handleFeedTypeChange,
    toggleFollowingOnly,
    loadMore,
    fetchSingleJournalBySlug,
    singleJournalLoading,
    singleJournalError,
    selectedTag,
    handleTagSelect,
    setFeedType,
    setShowFollowingOnly,
    fetchJournalsByTag,
    resetForNewCategory,
  }

  return <PublicJournalsContext.Provider value={value}>{children}</PublicJournalsContext.Provider>
}

export function usePublicJournals() {
  const context = useContext(PublicJournalsContext)
  if (context === undefined) {
    throw new Error("usePublicJournals must be used within a PublicJournalsProvider")
  }
  return context
}