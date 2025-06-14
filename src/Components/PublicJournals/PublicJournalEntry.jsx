"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { Heart, Share2, Clock, BarChart2, Tag, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails"
import Navbar from "../Dashboard/Navbar"
import LandingNavbar from "../Landing/Navbar"
import { useDarkMode } from "../../context/ThemeContext"

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Mood styling configurations
const moodStyles = {
  Happy: {
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    emoji: "😄",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20",
  },
  Neutral: {
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
    emoji: "😐",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
  },
  Sad: {
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    emoji: "😔",
    gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20",
  },
  Angry: {
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
    emoji: "😡",
    gradient: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
  },
  Anxious: {
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
    emoji: "😰",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
  },
  Tired: {
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
    emoji: "🥱",
    gradient: "from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20",
  },
  Reflective: {
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-200 dark:border-teal-800",
    emoji: "🤔",
    gradient: "from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20",
  },
  Excited: {
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800",
    emoji: "🥳",
    gradient: "from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20",
  },
  default: {
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800",
    emoji: "😶",
    gradient: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
  },
}

const PublicJournalEntry = () => {
  const { slug } = useParams()
  const location = useLocation()
  const [journal, setJournal] = useState(location.state?.journal || null)
  const [loading, setLoading] = useState(!journal)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem("user"))
    setIsLoggedIn(!!userData)
    setUser(userData)
  }, [])

  useEffect(() => {
    const fetchJournal = async () => {
      if (!journal) {
        try {
          setLoading(true)
          const response = await API.get(`/journals/singlepublic/${slug}`)
          setJournal(response.data)

          // Check if user has liked this journal
          const user = JSON.parse(sessionStorage.getItem("user"))
          if (user) {
            setIsLiked(response.data.likes.includes(user._id))
          }
        } catch (error) {
          console.error("Error fetching journal:", error)
          setError("Failed to fetch journal. Please try again.")
        } finally {
          setLoading(false)
        }
      } else {
        // If journal is passed via props, still check if user has liked it
        const user = JSON.parse(sessionStorage.getItem("user"))
        if (user) {
          setIsLiked(journal.likes.includes(user._id))
        }
      }
    }

    fetchJournal()
  }, [slug, journal])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleLike = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"))
      if (!user) {
        // Handle not logged in state - could redirect to login
        return
      }

      const response = await API.post(`/journals/${journal._id}/like`, {
        userId: user._id,
      })

      setJournal((prev) => ({
        ...prev,
        likes: response.data.isLiked ? [...prev.likes, user._id] : prev.likes.filter((id) => id !== user._id),
        likeCount: response.data.likeCount,
      }))
      setIsLiked(response.data.isLiked)
    } catch (error) {
      console.error("Error liking journal:", error)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  // Process content to handle full-width images
  const processContent = (content) => {
    if (!content) return "No content available."

    try {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content

      const images = tempDiv.querySelectorAll("img.full-width-image")

      images.forEach((img) => {
        // Skip if already wrapped
        if (img.parentElement.classList.contains("full-width-image-container")) return

        const container = document.createElement("div")
        container.className = "full-width-image-container"
        container.style.cssText = `
          position: relative;
          display: block;
          width: 100%;
          margin: 32px 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(156, 163, 175, 0.2);
        `

        // Apply original-safe image styling
        img.style.cssText = `
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          margin: 0 auto;
        `

        img.parentNode.insertBefore(container, img)
        container.appendChild(img)
      })

      return tempDiv.innerHTML
    } catch (error) {
      console.error("Error processing content:", error)
      return content
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loading journal...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Error Loading Journal</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Journal Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This journal entry doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get mood styling with fallback
  const moodStyle = journal.mood ? moodStyles[journal.mood] || moodStyles.default : moodStyles.default

  // Get theme details with error handling
  let currentTheme
  try {
    currentTheme = getThemeDetails(journal.theme)
  } catch (error) {
    console.error("Error getting theme details:", error)
    currentTheme = { icon: "📝", dateIcon: "📅" }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {isLoggedIn ? (
        <Navbar 
          name="New Entry" 
          link="/journaling-alt"
        />
      ) : (
        <LandingNavbar 
          isScrolled={true}
          darkMode={darkMode}
          setDarkMode={toggleDarkMode}
          user={user}
          openLoginModal={() => navigate('/login')}
          openSignupModal={() => navigate('/signup')}
        />
      )}
      <div
        style={{ backgroundAttachment: "fixed" }}
        className={`min-h-screen transition-colors duration-300 text-[var(--text-primary)] bg-[var(--bg-primary)] ${getCardClass(
          journal.theme,
        )} `}
      >
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          <div
            className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br ${moodStyle.gradient} opacity-20 dark:opacity-10`}
          ></div>
        </div>

        {/* Main Container */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Journal Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8">
              {/* Header Section */}
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  {journal.title || "Untitled Entry"}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Mood Badge */}
                  {journal.mood && (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${moodStyle.bgColor} ${moodStyle.textColor} ${moodStyle.borderColor} font-medium text-sm`}
                    >
                      <span className="text-base">{moodStyle.emoji}</span>
                      <span>{journal.mood}</span>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    <span>👤</span>
                    <span>{journal.authorName || "Anonymous"}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    <span>{currentTheme.dateIcon}</span>
                    <span>
                      {new Date(journal.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Word Count */}
                  {journal.wordCount && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                      <BarChart2 size={16} />
                      <span>{journal.wordCount} words</span>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between">
                  {/* Tags Section */}
                  <div className="flex flex-wrap gap-2 flex-1">
                    {journal.tags && journal.tags.length > 0 && (
                      <>
                        {journal.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <Tag size={12} />
                            <span>#{tag}</span>
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 ml-4">
                    <button
                      onClick={handleLike}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 group/like"
                    >
                      <Heart
                        className={`w-5 h-5 transition-transform duration-300 group-hover/like:scale-110 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="text-sm font-medium">{journal.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 group/share"
                    >
                      <Share2 className="w-5 h-5 transition-transform duration-300 group-hover/share:scale-110" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
                <div className="prose prose-gray dark:prose-invert max-w-none prose-lg">
                  <div
                    className="journal-content-display"
                    dangerouslySetInnerHTML={{
                      __html: processContent(journal.content),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Text Content Styles */}
        <style jsx global>{`
          .journal-content-display {
            line-height: 1.8;
            color: rgb(17, 24, 39);
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .dark .journal-content-display {
            color: rgb(243, 244, 246);
          }

          .journal-content-display p {
            margin: 1.25rem 0;
            color: inherit;
          }

          .journal-content-display h1,
          .journal-content-display h2,
          .journal-content-display h3 {
            font-weight: 700;
            margin: 2rem 0 1rem 0;
            color: inherit;
            word-wrap: break-word;
          }

          .journal-content-display h1 {
            font-size: 2rem;
            line-height: 1.2;
          }

          .journal-content-display h2 {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .journal-content-display h3 {
            font-size: 1.25rem;
            line-height: 1.4;
          }

          .journal-content-display strong {
            font-weight: 700;
            color: inherit;
          }

          .journal-content-display em {
            font-style: italic;
          }

          .journal-content-display u {
            text-decoration: underline;
          }

          .journal-content-display ul,
          .journal-content-display ol {
            margin: 1.25rem 0;
            padding-left: 1.5rem;
          }

          .journal-content-display ul {
            list-style-type: disc;
          }

          .journal-content-display ol {
            list-style-type: decimal;
          }

          .journal-content-display li {
            margin: 0.5rem 0;
            line-height: 1.7;
          }

          .journal-content-display ul ul {
            list-style-type: circle;
          }

          .journal-content-display ul ul ul {
            list-style-type: square;
          }

          .journal-content-display blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            background: rgba(59, 130, 246, 0.05);
            padding: 1.5rem;
            border-radius: 0.75rem;
            position: relative;
          }

          .journal-content-display code {
            background: rgba(156, 163, 175, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
            font-size: 0.875rem;
            border: 1px solid rgba(156, 163, 175, 0.2);
            word-break: break-all;
          }

          .journal-content-display pre {
            background: rgba(156, 163, 175, 0.1);
            padding: 1.5rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid rgba(156, 163, 175, 0.2);
          }

          .journal-content-display pre code {
            background: none;
            padding: 0;
            border: none;
            word-break: normal;
          }

          .journal-content-display a {
            color: #3b82f6;
            text-decoration: underline;
            transition: opacity 0.2s;
            word-break: break-all;
          }

          .journal-content-display a:hover {
            opacity: 0.8;
          }

          /* Full-width image handling */
          .journal-content-display .full-width-image-container {
            position: relative;
            display: block;
            width: 100%;
            margin: 24px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.2);
            background: transparent;
          }

          .journal-content-display .full-width-image-container img {
            margin: 0 !important;
            display: block !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
            padding: 0 !important;
            max-height: 400px !important;
          }

          /* Dark mode adjustments for images */
          .dark .journal-content-display .full-width-image-container {
            border-color: rgba(75, 85, 99, 0.5);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .journal-content-display .full-width-image-container {
              margin: 16px 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default PublicJournalEntry
