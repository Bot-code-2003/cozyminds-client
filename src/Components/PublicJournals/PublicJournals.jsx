"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import AuthModals from "../Landing/AuthModals"
import { useDarkMode } from "../../context/ThemeContext"
import PublicJournalCard from "./PublicJournalCard"
import Navbar from "../Dashboard/Navbar"
import LandingNavbar from "../Landing/Navbar"

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

const PublicJournals = () => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [likedJournals, setLikedJournals] = useState(new Set())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { darkMode, setDarkMode } = useDarkMode()
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode })

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem("user"))
    setIsLoggedIn(!!userData)
    setUser(userData)
    fetchJournals(1)

    // Add scroll event listener for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch journals with pagination
  const fetchJournals = async (pageNum, append = false) => {
    try {
      setLoading(!append) // Only set loading true for initial fetch
      setLoadingMore(append) // Set loadingMore true when appending
      const response = await API.get("/journals/public", {
        params: { page: pageNum, limit: 10 }, // Consistent with backend default
      })

      const { journals, hasMore } = response.data // Destructure response
      setJournals((prev) => (append ? [...prev, ...journals] : journals))
      setHasMore(hasMore) // Use hasMore from backend

      // Get user's liked journals if logged in
      const user = JSON.parse(sessionStorage.getItem("user"))
      if (user) {
        const likedSet = new Set(
          journals.filter((journal) => journal.likes.includes(user._id)).map((journal) => journal._id),
        )
        setLikedJournals((prev) => (append ? new Set([...prev, ...likedSet]) : likedSet))
      }
    } catch (error) {
      console.error("Error fetching journals:", error)
      setError("Failed to fetch journals. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLike = async (journalId) => {
    const user = JSON.parse(sessionStorage.getItem("user"))
    if (!user) {
      openLoginModal()
      return
    }

    try {
      const response = await API.post(`/journals/${journalId}/like`, {
        userId: user._id,
      })

      setJournals((prevJournals) =>
        prevJournals.map((journal) =>
          journal._id === journalId
            ? {
                ...journal,
                likes: response.data.isLiked
                  ? [...journal.likes, user._id]
                  : journal.likes.filter((id) => id !== user._id),
                likeCount: response.data.likeCount,
              }
            : journal,
        ),
      )

      setLikedJournals((prev) => {
        const newSet = new Set(prev)
        if (response.data.isLiked) {
          newSet.add(journalId)
        } else {
          newSet.delete(journalId)
        }
        return newSet
      })
    } catch (error) {
      console.error("Error liking journal:", error)
    }
  }

  const handleShare = (journalId) => {
    const journal = journals.find((j) => j._id === journalId)
    if (journal) {
      const url = `${window.location.origin}/publicjournal/${journal.slug}`
      navigator.clipboard.writeText(url)
      // You can add a toast notification here
    }
  }

  if (loading && !loadingMore) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchJournals(1)}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoggedIn ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          isScrolled={isScrolled}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      <div className="min-h-screen max-w-6xl mx-auto bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Public Journals</h1>
          {journals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">No public journals yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 auto-rows-fr">
              {journals.map((journal) => (
                <PublicJournalCard
                  key={journal._id}
                  journal={journal}
                  onLike={handleLike}
                  onShare={handleShare}
                  isLiked={likedJournals.has(journal._id)}
                />
              ))}
            </div>
          )}
          {hasMore && !loadingMore && (
            <div className="text-center py-4">
              <button
                onClick={() => {
                  const nextPage = page + 1
                  fetchJournals(nextPage, true)
                  setPage(nextPage)
                }}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
          {loadingMore && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)] mx-auto"></div>
            </div>
          )}
          {!hasMore && journals.length > 0 && (
            <div className="text-center py-4">
              <p className="text-[var(--text-secondary)]">No more journals to load.</p>
            </div>
          )}
        </div>
        {modals}
      </div>
    </>
  )
}

export default PublicJournals
