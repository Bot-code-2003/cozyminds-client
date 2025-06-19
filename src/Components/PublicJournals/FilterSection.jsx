"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, Clock, Heart, ChevronDown } from "lucide-react";

const FilterSection = ({
  feedType,
  handleFeedTypeChange,
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

  return (
    <div className="flex items-center">
      {/* Desktop Filter Buttons */}
      <div className="hidden sm:flex bg-gray-50 dark:bg-slate-700 rounded-lg p-1">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.key}
              onClick={() => handleFeedTypeChange(option.key)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                feedType === option.key
                  ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              title={option.description}
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="sm:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px]"
        >
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {selectedOption && (
            <span className="text-sm">{selectedOption.label}</span>
          )}
          <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[200px]">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => {
                    handleFeedTypeChange(option.key);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200 ${
                    feedType === option.key
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</span>
                  </div>
                  {feedType === option.key && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;