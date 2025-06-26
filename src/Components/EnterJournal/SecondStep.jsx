"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  X,
  Plus,
  FolderPlus,
  Hash,
  Heart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const SecondStep = ({
  // Tags props
  selectedTags,
  setSelectedTags,
  existingTags,
  // Mood props
  selectedMood,
  setSelectedMood,
  // Collections props
  selectedCollections,
  setSelectedCollections,
  existingCollections,
  // Navigation props
  onBack,
  onNext,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [collectionInput, setCollectionInput] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const tagInputRef = useRef(null);

  // Filter tags based on tagInput
  useEffect(() => {
    if (tagInput.trim()) {
      const matchedTags = existingTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setFilteredTags(matchedTags);
    } else {
      setFilteredTags(existingTags);
    }
  }, [tagInput, existingTags]);

  // Tags functions
  const addTag = (tag) => {
    const uppercaseTag = tag.toUpperCase();
    if (uppercaseTag.trim() && !selectedTags.includes(uppercaseTag)) {
      setSelectedTags([...selectedTags, uppercaseTag]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tag) =>
    setSelectedTags(selectedTags.filter((t) => t !== tag));

  // Collections functions
  const addCollection = (collection) => {
    if (
      collection.trim() &&
      collection !== "All" &&
      !selectedCollections.includes(collection)
    ) {
      setSelectedCollections([...selectedCollections, collection]);
    }
    setCollectionInput("");
  };

  const handleCollectionInputKeyDown = (e) => {
    if (e.key === "Enter" && collectionInput.trim()) {
      e.preventDefault();
      addCollection(collectionInput);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCollection = (collection) => {
    if (collection === "All") return;

    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  // Mood data
  const moods = [
    { emoji: "😄", name: "Happy", color: "#3EACA8" },
    { emoji: "😐", name: "Neutral", color: "#547AA5" },
    { emoji: "😔", name: "Sad", color: "#6A67CE" },
    { emoji: "😡", name: "Angry", color: "#E07A5F" },
    { emoji: "😰", name: "Anxious", color: "#9B72CF" },
    { emoji: "🥱", name: "Tired", color: "#718EBC" },
    { emoji: "🤔", name: "Reflective", color: "#5D8A66" },
    { emoji: "🥳", name: "Excited", color: "#F2B147" },
    { emoji: "💖", name: "Grateful", color: "#FF6B9D" },
    { emoji: "😂", name: "Funny", color: "#FFD93D" },
    { emoji: "🤩", name: "Inspired", color: "#6BCF7F" },
    { emoji: "😞", name: "Disappointed", color: "#A8A8A8" },
    { emoji: "😱", name: "Scared", color: "#8B5CF6" },
    { emoji: "🧚", name: "Imaginative", color: "#F59E0B" },
  ];

  const availableTags = filteredTags.filter(
    (tag) => !selectedTags.includes(tag)
  );
  const availableCollections = existingCollections.filter(
    (c) => c !== "All" && !selectedCollections.includes(c)
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Mood Selector */}
      <div className=" rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              How are you feeling?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select your current mood
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`p-3 rounded-xl border transition-all duration-200 text-sm flex flex-col items-center justify-center min-h-[70px] ${
                selectedMood === mood.name
                  ? "border-pink-300 bg-pink-50 dark:bg-pink-900/20 ring-2 ring-pink-200 dark:ring-pink-800"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">
                {mood.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className=" rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tags
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Label your entry
              </p>
            </div>
          </div>
          {selectedTags.length > 0 && (
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
              {selectedTags.length}
            </span>
          )}
        </div>

        {/* Tag Input */}
        <div className="relative mb-4">
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type a tag and press Enter..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {tagInput.trim() && (
            <button
              onClick={() => addTag(tagInput)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Available Tags */}
        {availableTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {tagInput.trim() ? "Matching tags" : "Suggested tags"}
              </h4>
              {availableTags.length > 6 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  {showAllTags
                    ? "Show less"
                    : `+${availableTags.length - 6} more`}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllTags ? availableTags : availableTags.slice(0, 6)).map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collections Section */}
      <div className=" rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Collections
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Organize your entries
            </p>
          </div>
        </div>

        {/* Collection Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={collectionInput}
            onChange={(e) => setCollectionInput(e.target.value)}
            onKeyDown={handleCollectionInputKeyDown}
            placeholder="Create new collection..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          {collectionInput.trim() && (
            <button
              onClick={() => addCollection(collectionInput)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected Collections */}
        {selectedCollections.length > 1 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedCollections
                .filter((c) => c !== "All")
                .map((collection) => (
                  <span
                    key={collection}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg border border-green-200 dark:border-green-800"
                  >
                    {collection}
                    <button
                      onClick={() => toggleCollection(collection)}
                      className="hover:bg-green-100 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Available Collections */}
        {availableCollections.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available collections
              </h4>
              {availableCollections.length > 6 && (
                <button
                  onClick={() => setShowAllCollections(!showAllCollections)}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  {showAllCollections
                    ? "Show less"
                    : `+${availableCollections.length - 6} more`}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllCollections
                ? availableCollections
                : availableCollections.slice(0, 6)
              ).map((collection) => (
                <button
                  key={collection}
                  onClick={() => toggleCollection(collection)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondStep;