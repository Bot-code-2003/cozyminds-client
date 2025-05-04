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
    <div className="bg-[var(--bg-secondary)] border-[var(--border)] shadow-[var(--shadow)] p-5">
      <input
        ref={titleRef}
        type="text"
        value={journalTitle}
        onChange={(e) => setJournalTitle(e.target.value)}
        placeholder="Entry Title"
        className="w-full border-none outline-none text-2xl p-3 font-semibold mb-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
      />

      <textarea
        ref={textareaRef}
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full min-h-[300px] resize-none border-[var(--border)] rounded-md outline-none p-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm"
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
