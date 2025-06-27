"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, ArrowRight, Star } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
} from "@dicebear/collection";

const avatarStyles = {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed, size: 128 }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PublicProfileShowcase = ({ 
  user = { 
    anonymousName: "CloudWhisperer", 
    bio: "A dreamer who writes stories inspired by the sky.", 
    followerCount: 245, 
    topJournals: ["Starry Nights", "Cloudy Dreams"] 
  } 
}) => {
  const [sampleName, setSampleName] = useState(user.anonymousName);
  const [selectedStyle, setSelectedStyle] = useState("avataaars");
  const [isFollowing, setIsFollowing] = useState(false);

  const avatar = getAvatarSvg(selectedStyle, sampleName);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const features = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Unique Avatar",
      description: "Create a distinctive avatar with 16 styles, tailored to your anonymous name.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Your Journals",
      description: "Share your best stories and inspire the community.",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Build a Following",
      description: "Grow your audience as others follow your creative journey.",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28  font-sans">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[var(--text-primary)] tracking-tight font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          Your Creative Profile
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          Showcase your unique identity and stories with a personalized profile.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-16 items-start relative">
        {/* Profile Card */}
        <div className="order-2 lg:order-1">
          <div className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border)] p-12 font-sans flex flex-col items-center text-center relative z-10" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            {/* Avatar */}
            <div className="mb-8">
              <img
                src={avatar}
                alt={`${sampleName}'s avatar`}
                className="w-28 h-28 rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-md"
              />
            </div>
            {/* Profile Info */}
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              {sampleName}
            </h3>
            <p className="text-[var(--text-secondary)] mb-3 max-w-xs leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              {user.bio}
            </p>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              {user.followerCount.toLocaleString()} followers
            </p> */}
            {/* Follow Button */}
            {/* <button
              onClick={handleFollow}
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-sans shadow-md ${
                isFollowing
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 hover:bg-indigo-700 dark:hover:bg-indigo-300"
              }`}
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              {isFollowing ? "Following" : "Follow"}
            </button> */}
            {/* Interactive Controls */}
            <div className="w-full space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  Try a Sample Name
                </label>
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  placeholder="Enter a name"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 font-sans"
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  Avatar Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 font-sans"
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                >
                  {Object.keys(avatarStyles).map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Divider for large screens */}
        <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-gray-300/0 via-gray-300/60 to-gray-300/0 dark:from-gray-700/0 dark:via-gray-700/60 dark:to-gray-700/0 z-0" />
        {/* Features Timeline/List */}
        <div className="order-1 lg:order-2 space-y-7 relative z-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-5 p-7 bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-2xl transition-all duration-500 ease-in-out font-sans"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <div className="p-4 bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-xl text-[var(--accent)] dark:text-[var(--accent)] flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-lg font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicProfileShowcase;