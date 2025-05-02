"use client";

import { useState } from "react";
import { ArrowLeft, Check, Save } from "lucide-react";
import { getThemeDetails, getCardClass } from "../Dashboard/ThemeDetails";
import JournalEntry from "./JournalEntryPreview";

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  availableThemes,
  onBack,
  onSave,
  isSaving,
  isSaved,
  entryData,
}) => {
  // Default preview content if no entryData is provided
  const defaultPreviewContent = {
    title: "My Journal Entry",
    content:
      "This is a preview of how your journal entry will look with the selected theme. The styling changes based on your theme choice.",
    tags: ["Sample", "Preview"],
    mood: "Reflective",
    date: new Date().toISOString(),
    wordCount: 42,
    theme: selectedTheme,
  };

  // Use entryData if provided, otherwise use default preview content
  const previewData = {
    ...defaultPreviewContent,
    ...entryData,
    theme: selectedTheme, // Always use the currently selected theme for preview
  };

  return (
    <div className="bg-[var(--bg-secondary)] border-[var(--border)] shadow-[var(--shadow)] p-2 sm:p-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)] text-center">
        Choose Your Journal Theme
      </h2>

      {/* Main grid layout for side-by-side display */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
        {/* Left side: Theme selection */}
        <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow-md border border-[var(--border)]">
          <h3 className="text-lg font-medium mb-4 text-[var(--text-primary)]">
            Available Themes
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setSelectedTheme(null)}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                !selectedTheme
                  ? "ring-2 ring-[var(--accent)] bg-[var(--accent)]/10 transform scale-102"
                  : "hover:bg-[var(--bg-primary)]/80 hover:shadow-md border border-[var(--border)]"
              }`}
            >
              <span className="text-2xl mb-1">📝</span>
              <span className="font-medium text-sm">None</span>
            </button>

            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedTheme === theme.id
                    ? "ring-2 ring-[var(--accent)] bg-[var(--accent)]/10 transform scale-105"
                    : "hover:bg-[var(--bg-primary)]/80 hover:shadow-md border border-[var(--border)]"
                }`}
              >
                <span className="text-2xl mb-1">{theme.icon}</span>
                <span className="font-medium text-sm">{theme.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 italic text-sm text-[var(--text-secondary)]">
            Select a theme to see how your journal entry will look
          </div>
        </div>

        {/* Right side: Preview */}
        <div className="flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div
              className={`w-full h-full overflow-hidden shadow-lg rounded-lg transition-all duration-300 ${
                selectedTheme ? getCardClass(selectedTheme) : ""
              }`}
            >
              <JournalEntry
                isPreview={true}
                previewData={previewData}
                hideBackButton={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-[var(--border)] bg-[var(--bg-primary)] rounded-lg flex items-center text-sm hover:bg-[var(--bg-primary)]/80 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg flex items-center text-sm hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaved ? (
            <Check size={16} className="mr-2" />
          ) : isSaving ? (
            <span className="mr-2 animate-spin">⏳</span>
          ) : (
            <Save size={16} className="mr-2" />
          )}
          {isSaved ? "Saved" : isSaving ? "Saving..." : "Save Journal"}
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
