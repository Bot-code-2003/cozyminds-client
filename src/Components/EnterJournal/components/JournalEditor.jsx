"use client";

import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const JournalEditor = ({
  journalTitle,
  setJournalTitle,
  journalText,
  setJournalText,
  wordCount,
  onNext,
}) => {
  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  // Focus title on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className="bg-[var(--bg-secondary)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        Write Your Journal
      </h2>

      <input
        ref={titleRef}
        type="text"
        value={journalTitle}
        onChange={(e) => setJournalTitle(e.target.value)}
        placeholder="Entry Title"
        className="w-full border-none outline-none text-2xl font-semibold mb-3 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
      />

      <textarea
        ref={textareaRef}
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full min-h-[450px] resize-none border-[var(--border)] rounded-md outline-none p-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm"
      />

      <div className="flex justify-between items-center mt-3 text-sm text-[var(--text-secondary)]">
        <span>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-md flex items-center text-sm hover:bg-[var(--accent)]/90 transition-colors"
        >
          Next
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default JournalEditor;
