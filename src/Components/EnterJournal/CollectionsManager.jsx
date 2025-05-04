"use client";

import { useState } from "react";
import { FolderPlus, X, Plus } from "lucide-react";

const CollectionsManager = ({
  selectedCollections,
  setSelectedCollections,
  existingCollections,
}) => {
  const [collectionInput, setCollectionInput] = useState("");

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

  const toggleCollection = (collection) => {
    if (collection === "All") return; // Can't remove "All"

    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-4">
      <h3 className="text-md font-medium mb-3 text-[var(--text-primary)] flex items-center">
        <FolderPlus size={16} className="mr-1.5" />
        Collections
        {selectedCollections.length > 1 && (
          <span className="ml-1.5 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedCollections.length - 1}
          </span>
        )}
      </h3>

      <div className="flex items-center mb-3">
        <input
          type="text"
          value={collectionInput}
          onChange={(e) => setCollectionInput(e.target.value)}
          onKeyDown={handleCollectionInputKeyDown}
          placeholder="Add new collection..."
          className="flex-grow px-2 py-1.5 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)] text-sm rounded-l-md outline-none"
        />
        <button
          onClick={() =>
            collectionInput.trim() && addCollection(collectionInput)
          }
          className="px-2 py-1.5 bg-[var(--accent)] text-white rounded-r-md text-sm hover:bg-[var(--accent)]/90 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {selectedCollections.length > 1 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {selectedCollections
              .filter((c) => c !== "All")
              .map((collection) => (
                <div
                  key={collection}
                  className="flex items-center px-2 py-1 bg-[var(--accent)] text-white text-xs rounded-full"
                >
                  {collection}
                  <button
                    onClick={() => toggleCollection(collection)}
                    className="ml-1.5 hover:text-[var(--bg-primary)] transition-colors"
                    aria-label={`Remove ${collection} collection`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {existingCollections.filter(
        (c) => c !== "All" && !selectedCollections.includes(c)
      ).length > 0 && (
        <div>
          <h4 className="text-xs text-[var(--text-secondary)] mb-1.5">
            Available:
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {existingCollections
              .filter((c) => c !== "All" && !selectedCollections.includes(c))
              .map((collection) => (
                <button
                  key={collection}
                  onClick={() => toggleCollection(collection)}
                  className="px-2 py-0.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)]/80 transition-colors"
                >
                  {collection}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsManager;
