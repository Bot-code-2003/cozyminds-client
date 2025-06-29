"use client";

import { useState, useMemo } from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { Calendar, Info, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const GitHubStyleCalendar = ({ journalEntries = [] }) => {
  const { darkMode } = useDarkMode();
  const [selectedDate, setSelectedDate] = useState(null);

  // Mood categories and their colors (grouped from SecondStep.jsx)
  const moodCategories = {
    happy: {
      name: "Happy",
      moods: ["Happy", "Excited", "Grateful"],
      color: "#4CAF50", // Fresh green — optimistic, calm, growth
      intensity: [1, 2, 3, 4]
    },
    creative: {
      name: "Creative",
      moods: ["Inspired", "Imaginative", "Funny"],
      color: "#FF9800", // Bright orange — bold, energizing, inspiring
      intensity: [1, 2, 3, 4]
    },
    thoughtful: {
      name: "Thoughtful",
      moods: ["Neutral", "Reflective", "Tired"],
      color: "#607D8B", // Blue-grey — serene, balanced, introspective
      intensity: [1, 2, 3, 4]
    },
    overwhelmed: {
      name: "Overwhelmed",
      moods: ["Anxious", "Disappointed", "Scared"],
      color: "#E91E63", // Pinkish-red — emotional, signals stress without harsh red
      intensity: [1, 2, 3, 4]
    },
    upset: {
      name: "Upset",
      moods: ["Sad", "Angry"],
      color: "#9C27B0", // Deep purple — sadness, seriousness, strong but distinct
      intensity: [1, 2, 3, 4]
    }
  };
  
  

  // Create a fast lookup map for moods (O(1) lookup instead of O(n))
  const moodLookup = useMemo(() => {
    const lookup = new Map();
    Object.entries(moodCategories).forEach(([categoryKey, category]) => {
      category.moods.forEach(mood => {
        lookup.set(mood, { categoryKey, ...category });
      });
    });
    return lookup;
  }, []);

  // Generate calendar data for the current year only - OPTIMIZED VERSION
  const calendarData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Create a Map for O(1) lookup instead of object
    const entriesByDate = new Map();
    
    // Only process entries from current year - much faster!
    journalEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === currentYear) {
        const dateString = entryDate.toDateString();
        if (!entriesByDate.has(dateString)) {
          entriesByDate.set(dateString, []);
        }
        entriesByDate.get(dateString).push(entry);
      }
    });

    // Generate all 365 days at once
    const data = [];
    const startDate = new Date(currentYear, 0, 1);
    
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toDateString();
      
      const dayEntries = entriesByDate.get(dateString) || [];
      let moodData = null;
      
      if (dayEntries.length > 0) {
        const firstEntry = dayEntries[0];
        const mood = firstEntry.mood;
        
        if (mood) {
          // O(1) lookup instead of O(n) loop!
          const moodInfo = moodLookup.get(mood);
          if (moodInfo) {
            moodData = {
              mood,
              category: moodInfo.categoryKey,
              color: moodInfo.color,
              entries: dayEntries.length
            };
          }
        }
      }
      
      data.push({
        date: new Date(currentDate),
        dateString,
        moodData,
        entries: dayEntries.length
      });
    }
    
    return data;
  }, [journalEntries, moodLookup]);

  // Group data by weeks for display
  const weeks = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    
    calendarData.forEach((day, index) => {
      currentWeek.push(day);
      
      // Start new week on Sundays (day 0) or at the end
      if (day.date.getDay() === 0 || index === calendarData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  }, [calendarData]);

  // Get color intensity for a mood
  const getColorIntensity = (moodData) => {
    if (!moodData) return darkMode ? "#374151" : "#e5e7eb"; // No entries
    
    // Just return the base color - no intensity variations
    return moodData.color;
  };

  // Get tooltip content
  const getTooltipContent = (day) => {
    if (!day.moodData) {
      return `${day.date.toLocaleDateString()}: No entries`;
    }
    
    return `${day.date.toLocaleDateString()}: ${day.moodData.mood} (${day.entries} ${day.entries === 1 ? 'entry' : 'entries'})`;
  };

  // Get current year
  const currentYear = new Date().getFullYear();

  // Calculate total entries this year
  const totalEntriesThisYear = journalEntries.filter(entry => 
    new Date(entry.date).getFullYear() === currentYear
  ).length;

  return (
    <div className="max-w-6xl mx-auto bg-[var(--bg-secondary)] rounded-xl p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mood Calendar {currentYear}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalEntriesThisYear} entries this year
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          <Link
            to="/detailed-calendar"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            <ExternalLink size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View All Years</span>
            <span className="sm:hidden">All Years</span>
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-1 min-w-max pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const color = getColorIntensity(day.moodData);
                return (
                  <div
                    key={dayIndex}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 ${
                      selectedDate === day.dateString ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      backgroundColor: color,
                      transition: 'background-color 0.3s ease, transform 0.2s ease'
                    }}
                    onClick={() => setSelectedDate(day.dateString)}
                    title={getTooltipContent(day)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Mood Categories:</span>
        </div>
        {Object.entries(moodCategories).map(([key, category]) => (
          <div key={key} className="flex items-center gap-2 relative group">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm transition-colors duration-300"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs sm:text-xs cursor-pointer">
              {category.name}
            </span>
            {/* Custom Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 hidden group-hover:flex px-3 py-2 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              Moods: {category.moods.join(", ")}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {calendarData.find(day => day.dateString === selectedDate)?.moodData ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mood: {calendarData.find(day => day.dateString === selectedDate)?.moodData.mood}
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No journal entries on this date
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubStyleCalendar;