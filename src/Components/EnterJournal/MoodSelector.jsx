"use client";

const MoodSelector = ({ selectedMood, setSelectedMood }) => {
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

      <div className="grid grid-cols-2 sm:grid-cols-8 gap-4 mb-3">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            className={`p-2 flex flex-col items-center justify-center transition-all ${
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
            <span className="text-2xl mb-2">{mood.emoji}</span>
            <span className="">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
