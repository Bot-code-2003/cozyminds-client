"use client";

import { useState } from "react";
import { Lock, Globe, Info } from "lucide-react";

const PrivacySelection = ({ onSelect, initialValue = "private" }) => {
  const [selectedPrivacy, setSelectedPrivacy] = useState(initialValue);

  const handleSelect = (privacy) => {
    setSelectedPrivacy(privacy);
    onSelect(privacy);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Choose Journal Privacy
        </h2>
        <p className="text-[var(--text-secondary)]">
          Decide who can read your journal entry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Private Option */}
        <button
          onClick={() => handleSelect("private")}
          className={`p-6 rounded-apple border-2 transition-all duration-200 ${
            selectedPrivacy === "private"
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border)] hover:border-[var(--accent)]/50"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`p-3 rounded-apple ${
                selectedPrivacy === "private"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              }`}
            >
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Private</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Only you can read this journal
              </p>
            </div>
          </div>
        </button>

        {/* Public Option */}
        <button
          onClick={() => handleSelect("public")}
          className={`p-6 rounded-apple border-2 transition-all duration-200 ${
            selectedPrivacy === "public"
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border)] hover:border-[var(--accent)]/50"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`p-3 rounded-apple ${
                selectedPrivacy === "public"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              }`}
            >
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Public</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-apple border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-[var(--accent)] mt-0.5" />
          <div className="text-sm text-[var(--text-secondary)]">
            <p>
              {selectedPrivacy === "private" ? (
                <>
                  Your journal will be private and only visible to you. You can
                  change this setting later.
                </>
              ) : (
                <>
                  Your journal will be public and visible to everyone. It will be
                  published under your anonymous name. You can change this setting
                  later.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySelection; 