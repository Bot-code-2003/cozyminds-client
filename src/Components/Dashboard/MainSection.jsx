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
      bgColor: "#e0c3fc", // Soft lavender
      hoverColor: "#d1b3f5",
    },
    {
      to: "/profile-settings",
      icon: <User size={24} />,
      title: "Profile",
      description: "Personalize your space",
      bgColor: "#ffd4a3", // Warm peach
      hoverColor: "#ffcc8a",
    },
    {
      to: "/collections",
      icon: <BookOpen size={24} />,
      title: "Library",
      description: "Revisit your stories",
      bgColor: "#a8e6cf", // Mint green
      hoverColor: "#96ddc2",
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
                className="block relative p-8 rounded-apple shadow-apple border border-gray-100/50 overflow-hidden group transition-all duration-300 hover:shadow-apple-hover"
                style={{
                  backgroundColor: action.bgColor,
                }}
              >
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: action.hoverColor }}
                />

                {/* Content */}
                <div className="relative flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-white drop-shadow-sm">
                    {action.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors tracking-tight">
                      {action.title}
                    </h3>
                    <p className="text-base text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors">
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
