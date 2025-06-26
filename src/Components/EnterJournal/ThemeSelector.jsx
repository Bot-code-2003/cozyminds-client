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
    <div className="pb-24 mt-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Choose Your Theme
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select how your entry will appear
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Theme Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border col-span-1 border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Available Themes
            </h3>
            {selectedTheme && (
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                Selected
              </span>
            )}
          </div>

          <div className="grid gap-3 mb-6 max-h-96 overflow-y-auto">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group p-2 flex items-center justify-center rounded-xl transition-all duration-200 border-2 ${
                  selectedTheme === theme.id
                    ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200 dark:ring-purple-800"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-700"
                }`}
              >
                <span className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {theme.icon}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 text-center">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              💡 Select a theme to see how your entry will look
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl col-span-2 border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Live Preview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See how your entry will appear
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div
              className={`transition-all duration-300 ${
                selectedTheme
                  ? getCardClass(selectedTheme)
                  : ""
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

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* Theme Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Available Themes
            </h3>
            {selectedTheme && (
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                Selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group p-4 flex flex-col items-center justify-center rounded-xl transition-all duration-200 border-2 min-h-[100px] ${
                  selectedTheme === theme.id
                    ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200 dark:ring-purple-800"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-700"
                }`}
              >
                <span className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {theme.icon}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Preview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How your entry will look
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div
              className={`transition-all duration-300 ${
                selectedTheme
                  ? getCardClass(selectedTheme)
                  : ""
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

        {/* Tip */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            💡 Select a theme above to see the preview update
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;