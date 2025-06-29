"use client";

import { useMemo } from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { Flame, Calendar, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

const JournalingStreak = ({ journalEntries = [] }) => {
  const { darkMode } = useDarkMode();

  // Calculate streak data - OPTIMIZED VERSION
  const streakData = useMemo(() => {
    if (!journalEntries || journalEntries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        lastEntryDate: null,
        consecutiveDays: 0
      };
    }

    // Get unique dates with entries (much simpler!)
    const uniqueDates = new Set();
    journalEntries.forEach(entry => {
      const date = new Date(entry.date).toDateString();
      uniqueDates.add(date);
    });

    // Convert to sorted array of dates
    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a));
    
    // Calculate current streak (consecutive days from today backwards)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (uniqueDates.has(dateString)) {
        currentStreak++;
      } else {
        break; // Stop as soon as we find a gap
      }
    }

    // Calculate longest streak (much simpler algorithm)
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;
      
      if (nextDate) {
        const dayDiff = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak + 1);
          tempStreak = 0;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalEntries: journalEntries.length,
      lastEntryDate: sortedDates.length > 0 ? new Date(sortedDates[0]) : null,
      consecutiveDays: sortedDates.length
    };
  }, [journalEntries]);

  const stats = [
    {
      icon: <Flame size={24} />,
      value: streakData.currentStreak,
      label: "Current Streak",
      description: "Days in a row",
      color: "#ff6b6b",
      gradient: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
      isHighlight: true,
    },
    {
      icon: <Target size={24} />,
      value: streakData.longestStreak,
      label: "Longest Streak",
      description: "Personal best",
      color: "#4ecdc4",
      gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    },
    {
      icon: <Calendar size={24} />,
      value: streakData.consecutiveDays,
      label: "Active Days",
      description: "Days with entries",
      color: "#45b7d1",
      gradient: "linear-gradient(135deg, #45b7d1, #96c93d)",
    },
    {
      icon: <Zap size={24} />,
      value: streakData.totalEntries,
      label: "Total Entries",
      description: "Journal entries",
      color: "#f9ca24",
      gradient: "linear-gradient(135deg, #f9ca24, #f0932b)",
    },
  ];

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your journaling journey today!";
    } else if (streakData.currentStreak === 1) {
      return "Great start! Keep it going tomorrow.";
    } else if (streakData.currentStreak < 7) {
      return `Amazing! You're on a ${streakData.currentStreak}-day streak!`;
    } else if (streakData.currentStreak < 30) {
      return `Incredible! ${streakData.currentStreak} days of consistent journaling!`;
    } else {
      return `Legendary! ${streakData.currentStreak} days and counting!`;
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Journaling Streak
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getStreakMessage()}
            </p>
          </div>
        </div>
        
        {streakData.lastEntryDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} />
            <span>
              Last entry: {streakData.lastEntryDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex flex-col items-center p-4 rounded-lg ${
              stat.isHighlight
                ? "bg-[var(--accent)]/10 border-[var(--accent)]/30"
                : "bg-[var(--bg-primary)] border-[var(--border)]"
            } border`}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3"
              style={{ background: stat.gradient }}
            >
              {stat.icon}
            </div>
            <p
              className={`text-2xl font-bold mb-1 ${
                stat.isHighlight
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {stat.value}
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)] text-center">
              {stat.label}
            </p>
            <p className="text-xs text-[var(--text-secondary)] text-center">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Streak Motivation */}
      {streakData.currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800/40 rounded-full flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Keep the flame alive!
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-300">
                Write today to maintain your {streakData.currentStreak}-day streak
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JournalingStreak; 