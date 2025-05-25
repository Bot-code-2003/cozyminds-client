import { Link } from "react-router-dom";
import { getCardClass, getThemeDetails } from "./ThemeDetails.js";
import { useState } from "react";
import JournalCard from "./JorunalCard.jsx";

// Mood definitions with improved color palette
const moods = [
  { emoji: "😄", name: "Happy", color: "#3EACA8" },
  { emoji: "😐", name: "Neutral", color: "#547AA5" },
  { emoji: "😔", name: "Sad", color: "#6A67CE" },
  { emoji: "😡", name: "Angry", color: "#E07A5F" },
  { emoji: "😰", name: "Anxious", color: "#9B72CF" },
  { emoji: "🥱", name: "Tired", color: "#718EBC" },
  { emoji: "🤔", name: "Reflective", color: "#5D8A66" },
  { emoji: "🥳", name: "Excited", color: "#F2B147" },
];

const RecentJournals = ({ entries, darkMode, formatDate }) => {
  // Empty state illustration component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-[var(--highlight)] opacity-70">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">No journal entries yet</h3>
      <p className="text-[var(--text-secondary)] max-w-sm">
        Start writing your thoughts and reflections to see them appear here.
      </p>
      <Link
        to="/new"
        className="mt-6 bg-[var(--accent)] hover:bg-opacity-90 transition-all text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center"
      >
        <span className="mr-2">+</span> Create first entry
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Recent Journals
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">
            {entries.length > 0
              ? `You have ${entries.length} journal ${
                  entries.length === 1 ? "entry" : "entries"
                }`
              : "Start your journaling journey today"}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              moods={moods}
              formatDate={formatDate}
              getThemeDetails={getThemeDetails}
              getCardClass={getCardClass}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJournals;
