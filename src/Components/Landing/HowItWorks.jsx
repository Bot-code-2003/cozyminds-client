"use client";

import {
  Mail as MailIcon,
  Edit3,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";

import Mail from "../../assets/inGameMail.png";
import Editor from "../../assets/editor-d.png";
import Shop from "../../assets/shop copy.png";
import Journal from "../../assets/journal-d.png";

const HowItWorks = ({ setShowLoginModal }) => {
  const { darkMode } = useDarkMode();

  const features = [
    {
      icon: <MailIcon size={28} />,
      title: "In-Site Messaging",
      description:
        "Connect with fellow journalers in a private, secure environment. Share inspiration and build meaningful connections.",
      image: Mail,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      borderColor: "border-blue-200 dark:border-blue-700/50",
      imageAlt: "In-site messaging interface",
    },
    {
      icon: <Edit3 size={28} />,
      title: "Rich Text Editor",
      description:
        "Express yourself with our powerful editor. Format text, add images, create beautiful layouts for your thoughts.",
      image: Editor,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-gradient-to-r from-purple-500 to-pink-500",
      borderColor: "border-purple-200 dark:border-purple-700/50",
      imageAlt: "Rich text editor interface",
    },
    {
      icon: <ShoppingBag size={28} />,
      title: "In-Site Shop",
      description:
        "Discover journaling supplies, premium themes, and exclusive content to enhance your writing experience.",
      image: Shop,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      borderColor: "border-emerald-200 dark:border-emerald-700/50",
      imageAlt: "In-site shop interface",
    },
    {
      icon: <BookOpen size={28} />,
      title: "Beautiful Journals",
      description:
        "Create stunning journal entries with our editor. Every page becomes a work of art that reflects your unique voice.",
      image: Journal,
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-gradient-to-r from-orange-500 to-red-500",
      borderColor: "border-orange-200 dark:border-orange-700/50",
      imageAlt: "Sample journal created with our editor",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--bg-primary)]/10 rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--accent)]/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-[var(--accent)]/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <div className="inline-block mb-6 px-6 py-3 border-2 border-[var(--border)] dark:border-[var(--border-dark)] rounded-full text-sm font-medium tracking-wider bg-gradient-to-r from-[var(--bg-primary)]/10 to-[var(--accent)]/10 dark:from-[var(--bg-primary)]/20 dark:to-[var(--accent)]/20">
          🚀 YOUR JOURNALING ADVENTURE
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          <span className="relative">
            Start Your Story, Join the Community
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[var(--bg-primary)]"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0,5 Q25,0 50,5 T100,5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </span>
        </h2>
        <p className="text-lg sm:text-xl opacity-80 max-w-3xl mx-auto font-medium leading-relaxed">
          Write, share, and explore public journals. Track your moods, earn coins, and unlock achievements as you go. Every entry is a new step in your adventure!
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 lg:grid-cols-2 relative z-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-apple border-2 ${feature.borderColor} transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl bg-[var(--card-bg)] dark:bg-[#2A2A2A]/60 backdrop-blur-md`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 p-8">
              {/* Header with icon and title */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-apple flex items-center justify-center ${feature.iconBg} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-dark)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--bg-primary)] group-hover:to-[var(--accent)] transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)] dark:text-[var(--text-dark)] opacity-90 mb-8">
                {feature.description}
              </p>

              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/20 to-transparent p-1 group-hover:shadow-3xl transition-shadow duration-500">
                <div className="relative rounded-xl overflow-hidden bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Image overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                  <Sparkles size={14} className="text-[var(--bg-primary)]" />
                  <Sparkles size={12} className="text-[var(--accent)]" />
                  <Sparkles size={16} className="text-[var(--accent)]" />
                </div>
                <div className="text-xs font-medium tracking-wider opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  0{index + 1}
                </div>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)]/5 via-[var(--accent)]/5 to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        ))}
        {/* New: Public Journals & Rewards Step */}
        <div className="group relative overflow-hidden rounded-apple border-2 border-[var(--accent)] transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl bg-[var(--card-bg)] dark:bg-[#2A2A2A]/60 backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-pink-200/20 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-apple flex items-center justify-center bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--accent)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-400 transition-all duration-300">
                  Public Journals & Rewards
                </h3>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)] dark:text-[var(--text-dark)] opacity-90 mb-8">
              Share your thoughts with the world, read inspiring entries from others, and earn coins for every public journal you post. The more you write, the more you unlock!
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20 relative z-10">
        <div className="inline-block p-10 border-2 border-[var(--border)] dark:border-[var(--border-dark)] rounded-3xl bg-gradient-to-r from-[var(--bg-primary)]/10 via-[var(--accent)]/10 to-[var(--accent)]/10 dark:from-[var(--bg-primary)]/5 dark:via-[var(--accent)]/5 dark:to-[var(--accent)]/5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart size={28} className="text-[var(--bg-primary)] animate-pulse" />
            <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--bg-primary)] dark:from-[var(--text-dark)] dark:to-[var(--bg-primary)]">
              Start Free – Get 50 Coins!
            </h3>
            <Heart
              size={28}
              className="text-[var(--accent)] animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <p className="text-lg sm:text-xl opacity-80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who've transformed their journaling experience with our powerful, gamified tools and public journal community.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[var(--text-primary)] to-[var(--bg-primary)] dark:from-[var(--text-dark)] dark:to-[var(--bg-primary)] text-[var(--text-dark)] dark:text-[var(--text-primary)] rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg shadow-xl hover:scale-105"
          >
            Start Free – Get 50 Coins!
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
