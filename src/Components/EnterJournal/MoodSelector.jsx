"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

const MoodSelector = ({ selectedMood, setSelectedMood, onNext, onBack }) => {
  const moods = [
    { emoji: "😄", name: "Happy", color: "#FFD166" },
    { emoji: "😐", name: "Neutral", color: "#A1D6DB" },
    { emoji: "😔", name: "Sad", color: "#3A95B2" },
    { emoji: "😡", name: "Angry", color: "#EF476F" },
    { emoji: "😰", name: "Anxious", color: "#9B59B6" },
    { emoji: "🥱", name: "Tired", color: "#6B7280" },
    { emoji: "🤔", name: "Reflective", color: "#2ECC71" },
    { emoji: "🥳", name: "Excited", color: "#F4A261" },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        How are you feeling today?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              selectedMood === mood.name
                ? "ring-2 ring-[var(--accent)] transform scale-105"
                : "hover:bg-[var(--bg-primary)] hover:shadow-md"
            }`}
            style={{
              background:
                selectedMood === mood.name
                  ? `${mood.color}20` // 20% opacity version of the color
                  : "var(--bg-secondary)",
            }}
          >
            <span className="text-4xl mb-2">{mood.emoji}</span>
            <span className="font-medium">{mood.name}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mb-6 p-4 rounded-lg bg-[var(--bg-primary)] text-center">
          <p className="text-lg">
            You're feeling{" "}
            <span className="font-semibold">{selectedMood.toLowerCase()}</span>{" "}
            {moods.find((m) => m.name === selectedMood)?.emoji}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-[var(--border)] bg-[var(--bg-primary)] rounded-md flex items-center text-sm hover:bg-[var(--bg-primary)]/80 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedMood}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-md flex items-center text-sm hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default MoodSelector;
