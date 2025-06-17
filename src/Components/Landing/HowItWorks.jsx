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

import Mail from "../../assets/mailing-d.png";
import Editor from "../../assets/editor-d.png";
import Shop from "../../assets/shop-d.png";
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
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#5999a8]/10 rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <div className="inline-block mb-6 px-6 py-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-full text-sm font-medium tracking-wider bg-gradient-to-r from-[#5999a8]/10 to-purple-500/10 dark:from-[#5999a8]/20 dark:to-purple-500/20">
          ✨ POWERFUL FEATURES
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          <span className="relative">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5999a8] to-purple-500">
              Create
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#5999a8]"
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
          From rich text editing to community features, discover the tools that
          make journaling a joy
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 lg:grid-cols-2 relative z-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-apple border-2 ${feature.borderColor} transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl bg-white/60 dark:bg-[#2A2A2A]/60 backdrop-blur-md`}
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
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F8F1E9] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5999a8] group-hover:to-purple-500 transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg leading-relaxed text-[#1A1A1A] dark:text-[#F8F1E9] opacity-90 mb-8">
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
                  <Sparkles size={14} className="text-[#5999a8]" />
                  <Sparkles size={12} className="text-purple-500" />
                  <Sparkles size={16} className="text-emerald-500" />
                </div>
                <div className="text-xs font-medium tracking-wider opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  0{index + 1}
                </div>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5999a8]/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20 relative z-10">
        <div className="inline-block p-10 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-3xl bg-gradient-to-r from-[#5999a8]/10 via-purple-500/10 to-emerald-500/10 dark:from-[#5999a8]/5 dark:via-purple-500/5 dark:to-emerald-500/5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart size={28} className="text-[#5999a8] animate-pulse" />
            <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1A1A1A] to-[#5999a8] dark:from-[#F8F1E9] dark:to-[#5999a8]">
              Ready to Start Creating?
            </h3>
            <Heart
              size={28}
              className="text-purple-500 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <p className="text-lg sm:text-xl opacity-80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who've transformed their journaling
            experience with our powerful tools
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#1A1A1A] to-[#5999a8] dark:from-[#F8F1E9] dark:to-[#5999a8] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg shadow-xl hover:scale-105"
          >
            <Sparkles
              size={24}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            Begin Your Creative Journey
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
