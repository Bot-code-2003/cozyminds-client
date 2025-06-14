"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, Share2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails"

const PublicJournalCard = ({ journal, onLike, onShare, isLiked }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { emoji, name: moodName, color } = getThemeDetails(journal.mood)
  const cardClass = getCardClass(journal.theme)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onLike(journal._id)
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onShare(journal._id)
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Extract first image from content
  const getFirstImage = (content) => {
    if (!content) return null
    try {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content
      const img = tempDiv.querySelector("img")
      return img ? img.src : null
    } catch (error) {
      console.error("Error extracting image:", error)
      return null
    }
  }

  const firstImage = getFirstImage(journal.content)

  return (
    <Link
      to={`/publicjournal/${journal.slug}`}
      state={{ journal }}
      className="group relative flex rounded-3xl overflow-hidden border border-[var(--border)] transition-all duration-700 h-88 cursor-pointer block no-underline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 32px 64px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)"
          : "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Left side: Image/Theme background */}
      <div
        className={`relative w-2/5 ${firstImage ? "" : cardClass}`}
        style={
          firstImage
            ? {
                backgroundImage: `url(${firstImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
        }
      >
        {/* Overlay for better contrast */}
        {firstImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition-all duration-700" />
        )}

        {/* Animated background gradient for non-image cards */}
        {!firstImage && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at 30% 70%, ${color}25, ${color}08, transparent)`,
            }}
          />
        )}

        {/* Mood indicator with enhanced visual appeal */}
        <div className="absolute bottom-5 left-5 flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <span className="text-xl drop-shadow-sm">{emoji}</span>
          <span className="text-white font-medium text-sm drop-shadow-sm">{moodName}</span>
        </div>

        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          style={{
            background: `linear-gradient(225deg, ${color}40, transparent)`,
            clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
          }}
        />
      </div>

      {/* Right side: Content */}
      <div className="relative flex-1 bg-[var(--bg-secondary)] p-8 flex flex-col justify-between">
        {/* Header section */}
        <div className="space-y-4">
          {/* Enhanced meta info row with better visual hierarchy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: "pink" }} />
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {journal.authorName || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-full px-3 py-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(journal.date)}</span>
            </div>
          </div>

          {/* Title with enhanced hierarchy */}
          <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-500 leading-tight mb-1">
            {journal.title}
          </h3>

          {/* Subtle underline accent */}
          <div
            className="w-12 h-0.5 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-500"
            style={{ backgroundColor: color }}
          />

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {journal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-medium px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)] transition-all duration-300 ease-in-out"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content preview */}
        <div className="flex-1 py-4">
          <div className="relative">
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-5">
              <span
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    if (!journal.content) return ""
                    try {
                      const tempDiv = document.createElement("div")
                      tempDiv.innerHTML = journal.content

                      // Remove all <img> tags
                      const images = tempDiv.querySelectorAll("img")
                      images.forEach((img) => img.remove())

                      const textOnly = tempDiv.innerHTML

                      return textOnly.length > 400 ? textOnly.slice(0, 400) + "..." : textOnly
                    } catch (error) {
                      console.error("Error cleaning journal content:", error)
                      return ""
                    }
                  })(),
                }}
              />
            </div>

            {/* Enhanced fade overlay with better visual hierarchy */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/70 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Enhanced footer actions with better visual hierarchy */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/30">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-300 group/like bg-[var(--bg-primary)] rounded-full px-3 py-1.5"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 group-hover/like:scale-110 ${
                  isLiked ? "fill-[var(--accent)] text-[var(--accent)]" : ""
                }`}
              />
              <span className="text-sm font-medium">{journal.likes?.length || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-300 group/share bg-[var(--bg-primary)] rounded-full p-2"
            >
              <Share2 className="w-4 h-4 transition-transform duration-300 group-hover/share:scale-110" />
            </button>
          </div>

          {/* Enhanced read more indicator */}
          <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
            <span className="font-medium">Read more</span>
            <div
              className="w-6 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements with better visual hierarchy */}
      <div
        className="absolute top-1/2 left-2/5 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 -translate-y-1/2 -translate-x-1/2"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-15 transition-all duration-1000 delay-200"
        style={{ backgroundColor: color }}
      />
      <div className="absolute inset-0 rounded-3xl border border-[var(--accent)]/0 group-hover:border-[var(--accent)]/30 transition-colors duration-700 pointer-events-none" />

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-[var(--accent)]/0 group-hover:to-[var(--accent)]/5 transition-all duration-700 pointer-events-none" />
    </Link>
  )
}

export default PublicJournalCard
