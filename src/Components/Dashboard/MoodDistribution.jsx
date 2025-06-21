"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart2, Calendar, Grid, BarChart3 } from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const MoodDistribution = ({ journalEntries }) => {
  const { darkMode } = useDarkMode();
  const [currentMonthEntries, setCurrentMonthEntries] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid", "horizontal", "pie"
  const [animationKey, setAnimationKey] = useState(0);

  // Mood options
  const moods = [
    { emoji: "😄", name: "Happy", color: "#3EACA8" },
    { emoji: "😐", name: "Neutral", color: "#547AA5" },
    { emoji: "😔", name: "Sad", color: "#6A67CE" },
    { emoji: "😡", name: "Angry", color: "#E07A5F" },
    { emoji: "😰", name: "Anxious", color: "#9B72CF" },
    { emoji: "🥱", name: "Tired", color: "#718EBC" },
    { emoji: "🤔", name: "Reflective", color: "#5D8A66" },
    { emoji: "🥳", name: "Excited", color: "#F2B147" },
    { emoji: "💖", name: "Grateful", color: "#FF6B9D" },
    { emoji: "😂", name: "Funny", color: "#FFD93D" },
    { emoji: "🤩", name: "Inspired", color: "#6BCF7F" },
    { emoji: "😞", name: "Disappointed", color: "#A8A8A8" },
    { emoji: "😱", name: "Scared", color: "#8B5CF6" },
    { emoji: "🧚", name: "Imaginative", color: "#F59E0B" },
  ];

  // Filter entries for current month
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = journalEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    setCurrentMonthEntries(filtered);
    setAnimationKey((prev) => prev + 1);
  }, [journalEntries]);

  // Get mood counts
  const getMoodCounts = () => {
    const counts = {};
    moods.forEach((mood) => (counts[mood.name] = 0));
    currentMonthEntries.forEach((entry) => {
      if (entry.mood) counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  };

  // Prepare chart data (only non-zero moods)
  const getMoodChartData = () => {
    const moodCounts = getMoodCounts();
    return moods
      .map((mood) => ({
        name: mood.name,
        emoji: mood.emoji,
        count: moodCounts[mood.name] || 0,
        color: mood.color,
      }))
      .filter(mood => mood.count > 0)
      .sort((a, b) => b.count - a.count);
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleString("default", { month: "long" });
  };

  const totalEntries = currentMonthEntries.length;
  const chartData = getMoodChartData();
  const dominantMood = chartData.length > 0 ? chartData[0] : { count: 0 };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {chartData.map((mood, index) => (
        <div
          key={mood.name}
          className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: `fadeInUp 0.6s ease-out forwards`,
          }}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {mood.name}
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: mood.color }}
            >
              {mood.count}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: mood.color,
                  width: `${(mood.count / Math.max(...chartData.map(m => m.count))) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Horizontal Bar Chart (compact)
  const HorizontalChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.2)" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 14, fill: "#6B7280" }}
            width={80}
            tickFormatter={(name) => {
              const mood = moods.find((m) => m.name === name);
              return mood ? `${mood.emoji} ${name}` : name;
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{data.emoji}</span>
                      <span className="font-medium">
                        {data.name}: {data.count} {data.count === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Pie Chart View
  const PieChartView = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
            label={({ name, emoji, count, percent }) => 
              `${emoji} ${(percent * 100).toFixed(1)}%`
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{data.emoji}</span>
                      <span className="font-medium">
                        {data.name}: {data.count} {data.count === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getCurrentMonthName()} Mood Distribution
              </h2>
              {totalEntries > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
                  {dominantMood.count > 0 && (
                    <>
                      {" "}
                      • Mostly {dominantMood.emoji}{" "}
                      {dominantMood.name.toLowerCase()}
                    </>
                  )}
                </p>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("horizontal")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "horizontal"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title="Bar Chart"
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("pie")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "pie"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title="Pie Chart"
              >
                <BarChart2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="min-h-[350px] w-full mb-6">
          {totalEntries > 0 ? (
            <>
              {viewMode === "grid" && <GridView />}
              {viewMode === "horizontal" && <HorizontalChart />}
              {viewMode === "pie" && <PieChartView />}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Calendar
                size={40}
                className="text-gray-400 opacity-50 mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No mood data for {getCurrentMonthName()}
              </p>
              <Link
                to="/journaling-alt"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <span>Start Journaling</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {totalEntries > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {chartData.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Different Moods
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {dominantMood.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Most Frequent
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round((dominantMood.count / totalEntries) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Top Mood %
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {totalEntries}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Entries
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDistribution;