"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const JournalCard = ({
  entry,
  moods,
  formatDate,
  getThemeDetails,
  getCardClass,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublic, setIsPublic] = useState(entry.isPublic);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
  const moodData = moods.find((m) => m.name === entry.mood);
  const currentTheme = getThemeDetails(entry.theme);
  const cardClass = getCardClass(entry.theme);

  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

  // Extract first image from content
  const getFirstImage = (content) => {
    if (!content) return null;
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const img = tempDiv.querySelector("img");
      return img ? img.src : null;
    } catch (error) {
      console.error("Error extracting image:", error);
      return null;
    }
  };

  const firstImage = getFirstImage(entry.content);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/journal/${entry._id}`);
      setIsModalOpen(false);
      // refresh window
      window.location.reload();
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      alert("Failed to delete journal entry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublic = async (e) => {
    e.preventDefault();
    setIsUpdatingPublic(true);
    try {
      await API.patch(`/journal/${entry._id}`, { isPublic: !isPublic });
      setIsPublic((prev) => !prev);
    } catch (err) {
      alert('Failed to update visibility.');
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <Link
        to={`/journal/${entry._id}`}
        className="group relative block rounded-apple overflow-hidden border border-[var(--border)] transition-all duration-500 max-h-[500px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Top portion: Background image or theme background */}
        <div
          className={`relative w-full h-48 ${firstImage ? "" : cardClass}`}
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
          {/* Overlay for better text readability when there's an image */}
          {firstImage && (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          )}

          {/* Animated background gradient for non-image cards */}
          {!firstImage && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${
                  moodData?.color || "var(--accent)"
                }15, ${moodData?.color || "var(--accent)"}05)`,
              }}
            />
          )}
        </div>

        {/* Bottom portion: Main content */}
        <div className="relative p-6 bg-[var(--bg-secondary)] flex flex-col min-h-[300px]">
          {/* Header with date and mood */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
              <span className="text-sm">{currentTheme?.dateIcon || "📅"}</span>
              <span className="px-2 py-1 bg-[var(--bg-primary)] rounded-full">
                {formatDate(entry.date)}
              </span>
            </div>

            {entry.mood && (
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: moodData?.color || "#6366f1",
                  boxShadow: `0 4px 14px 0 ${moodData?.color || "#6366f1"}40`,
                }}
              >
                <span className="text-sm">{moodData?.emoji}</span>
                <span>{entry.mood}</span>
              </div>
            )}
          </div>

          {/* Title with enhanced styling */}
          <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent)] line-clamp-1 transition-colors duration-300 relative">
            {entry.title || "Untitled Entry"}
            <div className="absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </h3>

          {/* Tags with improved design */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 transform group-hover:scale-105 transition-transform duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 2 && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]">
                  +{entry.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Content preview with enhanced styling */}
          <div className="flex-1 overflow-hidden pb-12">
            <div className="relative h-full">
              <div
                className="absolute left-0 top-0 w-1 h-full rounded-full opacity-60"
                style={{ backgroundColor: moodData?.color || "var(--accent)" }}
              />
              <div className="pl-4 h-full overflow-hidden">
                <div
                  className="text-sm text-[var(--text-secondary)] journal-card-content"
                  dangerouslySetInnerHTML={{
                    __html: entry.content || "No content available.",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced read more section with delete button - Absolute positioned */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6 pt-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
            <div className="text-xs text-[var(--text-secondary)]">
              {entry.wordCount ? `${entry.wordCount} words` : ""}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[var(--accent)] font-medium text-sm group-hover:gap-2 transition-all duration-300">
                <span>{currentTheme?.readMoreText || "Read more"}</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--text-secondary)] hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  setIsModalOpen(true);
                }}
                aria-label="Delete journal entry"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-700">
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: moodData?.color || "var(--accent)" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5 transform -translate-x-12 translate-y-12 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-700">
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: moodData?.color || "var(--accent)" }}
          />
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={handleTogglePublic}
            disabled={isUpdatingPublic}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]
              ${isPublic ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}
              ${isUpdatingPublic ? 'cursor-not-allowed' : ''}
            `}
          >
            {isUpdatingPublic ? '...' : (isPublic ? 'Public' : 'Private')}
          </button>
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.3 } },
              exit: { opacity: 0, transition: { duration: 0.2 } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-xl border border-[var(--border)] max-w-sm w-full"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Are you sure you want to delete this journal entry? This action
                is <span className="text-red-500 font-medium">permanent</span>{" "}
                and cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]/80 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1,
                        }}
                      >
                        ⟳
                      </motion.span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content styling */}
      <style jsx global>{`
        .journal-card-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1.5;
          max-height: 6rem;
        }

        .journal-card-content * {
          display: inline;
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }

        .journal-card-content h1,
        .journal-card-content h2,
        .journal-card-content h3,
        .journal-card-content h4,
        .journal-card-content h5,
        .journal-card-content h6,
        .journal-card-content p,
        .journal-card-content ul,
        .journal-card-content ol,
        .journal-card-content li,
        .journal-card-content blockquote {
          display: inline;
        }

        .journal-card-content br {
          display: none;
        }

        .journal-card-content strong {
          font-weight: bold;
        }

        .journal-card-content em {
          font-style: italic;
        }

        .journal-card-content img,
        .journal-card-content figure {
          display: none;
        }
      `}</style>
    </>
  );
};

export default JournalCard;
