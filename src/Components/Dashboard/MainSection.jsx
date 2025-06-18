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
      icon: <Plus size={24} />,
      title: "New Entry",
      description: "Start writing today",
      className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
    },
    {
      to: "/profile-settings",
      icon: <User size={24} />,
      title: "Profile",
      description: "Personalize your space",
      className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    },
    {
      to: "/collections",
      icon: <BookOpen size={24} />,
      title: "Library",
      description: "Revisit your stories",
      className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-12 md:py-16">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center relative"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={120} className="text-[var(--accent)]" />
          </motion.div>
        </div>
        <div className="relative">
          <h1 className="text-4xl md:text-display font-serif font-bold mb-4 bg-gradient-to-r from-[var(--accent)] to-[var(--text-primary)] bg-clip-text text-transparent leading-tight tracking-tight">
            Welcome, {userData?.nickname || "Traveler"}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-light">
            Continue your journey of self-discovery
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <AnimatePresence>
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.to}
                className={`block relative p-8 rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl ${action.className}`}
              >
                {/* Content */}
                <div className="relative flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-semibold mb-2 transition-colors tracking-tight">
                      {action.title}
                    </h3>
                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* StreakCard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
