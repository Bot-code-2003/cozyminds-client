"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, X, Plus } from "lucide-react";

const TagsManager = ({ selectedTags, setSelectedTags, existingTags }) => {
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const tagInputRef = useRef(null);

  // Filter tags based on tagInput
  useEffect(() => {
    if (tagInput.trim()) {
      const matchedTags = existingTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setFilteredTags(matchedTags);
    } else {
      setFilteredTags(existingTags); // Show all tags when input is empty
    }
  }, [tagInput, existingTags]);

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

  return (
    <div className="bg-[var(--bg-primary)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-4">
      <h3 className="text-md font-medium mb-3 text-[var(--text-primary)] flex items-center">
        <Tag size={16} className="mr-1.5" />
        Add Tags
        {selectedTags.length > 0 && (
          <span className="ml-1.5 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedTags.length}
          </span>
        )}
      </h3>

      <div className="flex items-center mb-3">
        <input
          ref={tagInputRef}
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder="Add a tag..."
          className="flex-grow px-2 py-1.5 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)] text-sm rounded-l-md outline-none"
        />
        <button
          onClick={() => tagInput.trim() && addTag(tagInput)}
          className="px-2 py-1.5 bg-[var(--accent)] text-white rounded-r-md text-sm hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {selectedTags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center px-2 py-1 bg-[var(--accent)] text-white text-xs rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 hover:text-[var(--bg-primary)] transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTags.length > 0 &&
        filteredTags.some((tag) => !selectedTags.includes(tag)) && (
          <div>
            <h4 className="text-xs text-[var(--text-secondary)] mb-1.5">
              {tagInput.trim() ? "Matching:" : "Suggested:"}
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {filteredTags
                .filter((tag) => !selectedTags.includes(tag))
                .slice(0, 10) // Limit to 10 suggestions
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="px-2 py-0.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)]/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default TagsManager;
