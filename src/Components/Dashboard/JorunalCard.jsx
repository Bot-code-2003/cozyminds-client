import { useState } from "react";
import { Link } from "react-router-dom";

// JournalCard component for consistent journal entry display
const JournalCard = ({
  entry,
  moods,
  formatDate,
  getThemeDetails,
  getCardClass,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const moodData = moods.find((m) => m.name === entry.mood);
  const currentTheme = getThemeDetails(entry.theme);
  const cardClass = getCardClass(entry.theme);

  return (
    <Link
      to={`/journal/${entry._id}`}
      className={`rounded-xl border dark:border-white border-black p-5 transition-all duration-300 ${cardClass} relative overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          : "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Background pattern for visual interest */}
      {/* <div className="absolute top-0 right-0 w-24 h-24 opacity-5 transform translate-x-8 -translate-y-8">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div> */}

      {/* Theme icon indicator with improved positioning */}
      {/* {entry.theme && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--highlight)] opacity-80 flex items-center justify-center">
          <span role="img" aria-label="theme-icon" className="text-lg">
            {currentTheme.icon}
          </span>
        </div>
      )} */}

      {/* Date ribbon */}
      <div className="text-xs font-medium flex items-center gap-1 mb-4  px-3 py-1 rounded-full w-fit">
        <span role="img" aria-label="date" className="text-xs mr-1">
          {currentTheme.dateIcon}
        </span>
        {formatDate(entry.date)}
      </div>

      {/* Title with animated underline */}
      <h3 className="text-xl font-bold mb-3 truncate relative group-hover:text-[var(--accent)] transition-colors duration-200">
        {entry.title || "Untitled Entry"}
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-current opacity-60 group-hover:w-full transition-all duration-300"></span>
      </h3>

      {/* Mood and tags in horizontal layout */}
      <div className="flex flex-wrap gap-2 mb-4">
        {entry.mood && (
          <span
            className="inline-flex items-center text-xs font-medium text-white px-3 py-1 rounded-full shadow-sm"
            style={{
              backgroundColor: moodData?.color || "#2e7d32",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span className="mr-1">{moodData?.emoji}</span> {entry.mood}
          </span>
        )}

        {/* Tags with improved styling */}
        {entry.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-[var(--highlight)] text-white dark:text-black border border-current/10"
          >
            #{tag}
          </span>
        ))}

        {entry.tags?.length > 2 && (
          <span className="text-xs px-2 py-1">
            +{entry.tags.length - 2} more
          </span>
        )}
      </div>

      {/* Content Preview with themed border and better formatting */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 w-1 h-full bg-current opacity-30 rounded"></div>
        <p className="text-sm line-clamp-3 pl-3 italic">
          {entry.content || "No content available."}
        </p>
      </div>

      {/* Read more button with animated arrow */}
      <div className="mt-4 flex items-center justify-end text-[var(--accent)] font-medium text-sm">
        <span>{currentTheme.readMoreText || "Read more"}</span>
        <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </div>
    </Link>
  );
};

export default JournalCard;
