import { Link } from "react-router-dom";

// Mood definitions
const moods = [
  { emoji: "😄", name: "Happy", color: "#70B2C0" },
  { emoji: "😐", name: "Neutral", color: "#83C5BE" },
  { emoji: "😔", name: "Sad", color: "#7A82AB" },
  { emoji: "😡", name: "Angry", color: "#E07A5F" },
  { emoji: "😰", name: "Anxious", color: "#BC96E6" },
  { emoji: "🥱", name: "Tired", color: "#8D99AE" },
  { emoji: "🤔", name: "Reflective", color: "#81B29A" },
  { emoji: "🥳", name: "Excited", color: "#F9C74F" },
];

// Theme icon and text mapping
const themeDetails = {
  theme_forest: {
    icon: "🌲",
    dateIcon: "🍃",
    readMoreText: "Wander deeper",
  },
  theme_ocean: {
    icon: "🐠",
    dateIcon: "🫧",
    readMoreText: "Dive deeper",
  },
  theme_christmas: {
    icon: "🎄",
    dateIcon: "❄️",
    readMoreText: "Unwrap entry",
  },
  theme_halloween: {
    icon: "🎃",
    dateIcon: "👻",
    readMoreText: "Enter if you dare",
  },
  theme_pets: {
    icon: "🐶",
    dateIcon: "🐕",
    readMoreText: "Pet entry",
  },
};

const RecentJournals = ({ entries, darkMode, formatDate }) => {
  const getCardClass = (theme) => {
    if (theme === "theme_forest") {
      return "card-forest";
    } else if (theme === "theme_ocean") {
      return "card-ocean";
    } else if (theme === "theme_christmas") {
      return "card-christmas";
    } else if (theme === "theme_halloween") {
      return "card-halloween";
    } else if (theme === "theme_pets") {
      return "card-pets";
    } else if (theme === "theme_space") {
      return "card-space";
    } else {
      return "card-dark";
    }
  };

  const getThemeDetails = (theme) => {
    return (
      themeDetails[theme] || {
        icon: "📝",
        dateIcon: "📅",
        readMoreText: "Read more",
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mb-10 bg-[var(--bg-secondary)] border border-designer rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
        Recent Journals
      </h2>

      {entries.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-sm">
          No recent journal entries. Start writing to fill this space!
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const moodData = moods.find((m) => m.name === entry.mood);
            const currentTheme = getThemeDetails(entry.theme);
            const cardClass = getCardClass(entry.theme);

            return (
              <Link
                to={`/journal/${entry._id}`}
                key={entry._id}
                className={`group relative h-72 rounded-3xl overflow-hidden ${cardClass} transition-all duration-500 hover:scale-[1.02]`}
              >
                {/* Dynamic background with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900">
                  {/* Animated accent color blob */}
                  <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-[var(--highlight)]/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-[var(--highlight)]/20 blur-3xl group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Content container with grid layout */}
                <div className="relative h-full flex flex-col p-6 z-10">
                  {/* Top section with title and icon */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                        {entry.title || "Untitled Entry"}
                      </h3>
                      <p className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                        <span role="img" aria-label="date">
                          {currentTheme.dateIcon}
                        </span>
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    {entry.theme && (
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl text-2xl shadow-lg">
                        <span role="img" aria-label="theme-icon">
                          {currentTheme.icon}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content preview with custom styling */}
                  <div className="flex-grow mb-6">
                    <div className="relative">
                      <p className="text-sm text-white/80 line-clamp-3 leading-relaxed">
                        {entry.content || "No content available."}
                      </p>
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                  </div>

                  {/* Bottom section with tags and CTA */}
                  <div className="mt-auto">
                    {/* Tags and mood container */}
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                      {/* Mood indicator with enhanced styling */}
                      {entry.mood && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg shadow-lg"
                          style={{
                            backgroundColor: moodData?.color || "#2e7d32",
                          }}
                        >
                          <span className="text-base">{moodData?.emoji}</span>{" "}
                          {entry.mood}
                        </span>
                      )}

                      {/* Modern tag design */}
                      {entry.tags?.length > 0 &&
                        entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-white inline-flex text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>

                    {/* Read more button with animated indicator */}
                    <div className="flex items-center justify-end">
                      <div className="group inline-flex items-center gap-1 text-white font-medium py-2 px-4 rounded-lg bg-[var(--highlight)] shadow-lg">
                        <span>{currentTheme.readMoreText}</span>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentJournals;
