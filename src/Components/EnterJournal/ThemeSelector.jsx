"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Save, Palette, Eye } from "lucide-react";
import { getThemeDetails, getCardClass } from "../Dashboard/ThemeDetails";
import JournalEntry from "./JournalEntryPreview";

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  availableThemes,
  onBack,
  onNext,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto space-y-10">
      {/* Main grid layout for side-by-side display */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left side: Theme selection */}
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-apple">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
                  Available Themes
                </h3>
                <p className="text-base text-[var(--text-secondary)] mt-1">
                  Pick your visual style
                </p>
              </div>
            </div>
            {selectedTheme && (
              <span className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-full tracking-wide">
                Selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group p-4 flex flex-col items-center justify-center rounded-apple transition-all duration-300 border-2 ${
                  selectedTheme === theme.id
                    ? "ring-2 ring-offset-2 ring-purple-500  transform scale-105 shadow-lg border-purple-500"
                    : "hover:bg-[var(--bg-primary)] hover:shadow-md hover:scale-105 border-[var(--border)] hover:border-purple-300"
                }`}
              >
                <span className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {theme.icon}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 italic">
              💡 Select a theme to see how your entry will look
            </p>
          </div>
        </div>

        {/* Right side: Preview */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Live Preview
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                See how your entry will appear
              </p>
            </div>
          </div>

          <div className="flex-grow">
            <div
              className={`w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                selectedTheme
                  ? getCardClass(selectedTheme)
                  : "border border-[var(--border)]"
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

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
