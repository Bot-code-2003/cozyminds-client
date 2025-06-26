"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  User,
  BookOpen,
  Sparkles,
  TrendingUp,
  Calendar,
  PenTool,
  Settings,
  Library,
  Heart,
  Target,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StreakCard from "../StreakCard";

const MainSection = ({
  darkMode,
  journalEntries,
  userData,
  wordCountStats,
  formatDate,
}) => {
  const quickActions = [
    {
      to: "/journaling-alt",
      icon: <PenTool size={28} />,
      title: "New Entry",
      description: "Start your daily reflection",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800/50",
    },
    {
      to: "/public-journals",
      icon: <Heart size={28} />,
      title: "Discover",
      description: "Explore vibrant community",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      borderColor: "border-pink-200 dark:border-pink-800/50",
    },
    {
      to: "/collections",
      icon: <Library size={28} />,
      title: "Library",
      description: "Your personal archive",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800/50",
    },
    {
      to: "/cozyshop",
      icon: <Sparkles size={28} />,
      title: "Shop",
      description: "Enhance your experience",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800/50",
    },
  ];

  const stats = [
    {
      icon: <Target size={20} />,
      label: "Current Streak",
      value: userData?.currentStreak || 0,
      unit: "days",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Total Entries",
      value: journalEntries?.length || 0,
      unit: "entries",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Zap size={20} />,
      label: "Words Written",
      value: wordCountStats?.totalWords || 0,
      unit: "words",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-8 md:py-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
            Welcome back, {userData?.nickname || "Traveler"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            Ready to continue your journey?
          </p>
        </div>

        
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <AnimatePresence>
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.to}
                className={`block relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group ${action.bgColor} ${action.borderColor}`}
              >
                {/* Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* StreakCard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <StreakCard
          journalEntries={journalEntries}
          wordCountStats={wordCountStats}
        />
      </motion.div>
    </main>
  );
};

export default MainSection;
