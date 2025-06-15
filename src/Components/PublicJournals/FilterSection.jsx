"use client";

import { Filter, Clock, Heart, Sparkles } from "lucide-react";

const FilterSection = ({
  feedType,
  handleFeedTypeChange,
  isLoggedIn,
  toggleFollowingOnly,
  showFollowingOnly,
}) => {
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

  if (showFollowingOnly) {
    return null; // Don't show filters when viewing following feed
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Sort Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>

          <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => handleFeedTypeChange(option.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    feedType === option.key
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r border-blue-200 dark:border-blue-700"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 border-r border-gray-200 dark:border-slate-700"
                  } ${option.key === "most-liked" ? "border-r-0" : ""}`}
                  title={option.description}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {feedType === option.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Following Toggle */}
        {isLoggedIn && (
          <button
            onClick={toggleFollowingOnly}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
