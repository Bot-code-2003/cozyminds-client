"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, Clock, Heart, Sparkles, ChevronDown } from "lucide-react";

const FilterSection = ({
  feedType,
  handleFeedTypeChange,
  isLoggedIn,
  toggleFollowingOnly,
  showFollowingOnly,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    {
      key: "recent",
      label: "Latest",
      icon: Clock,
      description: "Most recent posts",
    },
    {
      key: "oldest",
      label: "Oldest",
      icon: Clock,
      description: "Oldest posts first",
    },
    {
      key: "most-liked",
      label: "Popular",
      icon: Heart,
      description: "Most liked posts",
    },
  ];

  const selectedOption = filterOptions.find(option => option.key === feedType);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (showFollowingOnly) {
    return null; // Don't show filters when viewing following feed
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Sort Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-sm overflow-hidden">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => handleFeedTypeChange(option.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    feedType === option.key
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-r border-[var(--accent)]/20"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-r border-[var(--border)]"
                  } ${option.key === "most-liked" ? "border-r-0" : ""}`}
                  title={option.description}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {feedType === option.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Dropdown */}
          <div className="sm:hidden relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              {selectedOption && (
                <>
                  <selectedOption.icon className="w-4 h-4" />
                  <span>{selectedOption.label}</span>
                </>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => {
                        handleFeedTypeChange(option.key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        feedType === option.key
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex flex-col items-start">
                        <span>{option.label}</span>
                        {/* <span className="text-xs text-[var(--text-secondary)]">{option.description}</span> */}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Following Toggle */}
        {isLoggedIn && (
          <button
            onClick={toggleFollowingOnly}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>My Feed</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
