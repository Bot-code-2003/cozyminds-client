"use client";

import { useState, useMemo } from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { useJournals } from "../../context/JournalContext";
import { Calendar, Info, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const DetailedCalendar = () => {
  const { darkMode } = useDarkMode();
  const { journalEntries } = useJournals();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mood categories and their colors (grouped from SecondStep.jsx)
  const moodCategories = {
    happy: {
      name: "Happy",
      moods: ["Happy", "Excited", "Grateful"],
      color: "#2ecc71", // Bright green
      intensity: [1, 2, 3, 4]
    },
    creative: {
      name: "Creative",
      moods: ["Inspired", "Imaginative", "Funny"],
      color: "#f39c12", // Warm amber
      intensity: [1, 2, 3, 4]
    },
    thoughtful: {
      name: "Thoughtful",
      moods: ["Neutral", "Reflective", "Tired"],
      color: "#3498db", // Calm blue
      intensity: [1, 2, 3, 4]
    },
    overwhelmed: {
      name: "Overwhelmed",
      moods: ["Anxious", "Disappointed", "Scared"],
      color: "#e67e22", // Orange
      intensity: [1, 2, 3, 4]
    },
    upset: {
      name: "Upset",
      moods: ["Sad", "Angry"],
      color: "#e74c3c", // Red
      intensity: [1, 2, 3, 4]
    }
  };

  // Get all available years from journal entries
  const availableYears = useMemo(() => {
    const years = new Set();
    journalEntries.forEach(entry => {
      years.add(new Date(entry.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [journalEntries]);

  // Generate calendar data for the selected year
  const calendarData = useMemo(() => {
    const data = [];
    
    // Start from January 1st of selected year
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Group entries by date
    const entriesByDate = {};
    journalEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === selectedYear) {
        const date = entryDate.toDateString();
        if (!entriesByDate[date]) {
          entriesByDate[date] = [];
        }
        entriesByDate[date].push(entry);
      }
    });

    // Generate calendar grid for the entire year
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toDateString();
      const dayEntries = entriesByDate[dateString] || [];
      let moodData = null;
      
      if (dayEntries.length > 0) {
        // Get the first mood from the first entry of the day
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
        entries: dayEntries.length,
        dayOfYear: Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  }, [journalEntries, selectedYear]);

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

  // Calculate total entries for selected year
  const totalEntriesThisYear = journalEntries.filter(entry => 
    new Date(entry.date).getFullYear() === selectedYear
  ).length;

  // Navigate to previous/next year
  const goToPreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  const goToNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 text-[var(--text-primary)] bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-[var(--border)]"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                    Detailed Mood Calendar
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Explore your emotional journey across all years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Year Navigation */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousYear}
                disabled={availableYears.indexOf(selectedYear) >= availableYears.length - 1}
                className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {selectedYear}
              </h2>
              <button
                onClick={goToNextYear}
                disabled={availableYears.indexOf(selectedYear) <= 0}
                className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-[var(--text-secondary)]">
                {totalEntriesThisYear} entries in {selectedYear}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Info size={14} className="sm:w-4 sm:h-4" />
                <span>Mood Categories</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
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
            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>Mood Categories:</span>
              </div>
              {Object.entries(moodCategories).map(([key, category]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm transition-colors duration-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs sm:text-xs">{category.name}</span>
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
        </div>
      </div>
    </div>
  );
};

export default DetailedCalendar; 