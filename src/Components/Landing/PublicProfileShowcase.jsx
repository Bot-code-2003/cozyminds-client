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
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 text-gray-900 dark:text-white tracking-tight">
          Your Creative Profile
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Showcase your unique identity and stories with a personalized profile.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Card */}
        <div className="order-2 lg:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="mb-6">
                <img
                  src={avatar}
                  alt={`${sampleName}'s avatar`}
                  className="w-24 h-24 rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-sm"
                />
              </div>

              {/* Profile Info */}
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {sampleName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3 max-w-xs leading-relaxed">
                {user.bio}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {user.followerCount.toLocaleString()} followers
              </p>

              {/* Follow Button */}
              <button
                onClick={handleFollow}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              {/* Interactive Controls */}
              <div className="mt-8 w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Try a Sample Name
                  </label>
                  <input
                    type="text"
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    placeholder="Enter a name"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avatar Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
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
        </div>

        {/* Features */}
        <div className="order-1 lg:order-2 space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
            >
              <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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