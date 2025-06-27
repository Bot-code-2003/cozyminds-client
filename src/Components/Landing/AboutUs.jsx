"use client";

import { useEffect } from "react";
import {
  Star,
  Heart,
  Mail,
  Sparkles,
  Shield,
  Users,
  Moon,
  Sun,
  ArrowRight,
  BookOpen,
  Zap,
  Gift,
  Edit3,
  BarChart3,
  Layers,
  Palette,
  Anchor,
  ShoppingBag,
} from "lucide-react";
import AuthModals from "./AuthModals";
import { useState } from "react";

import { useDarkMode } from "../../context/ThemeContext";
import Navbar from "./Navbar";

const AboutUs = () => {
  // Get auth modal controls
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Edit3 size={24} />,
      title: "Rich Text Editor",
      description:
        "Write and format your thoughts with a distraction-free, easy-to-use editor. Supports text formatting, images, and beautiful layouts.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Beautiful Journals",
      description:
        "Design and personalize your journal entries with customizable templates, themes, and cover images.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Mood Analytics",
      description:
        "Track and understand your emotions with clear, insightful mood graphs and statistics for self-reflection.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Mail size={24} />,
      title: "In-Site Mail & Messaging",
      description:
        "Receive messages, rewards, and story chapters directly in your in-site mailbox. Connect with the community in a safe, private way.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Gift size={24} />,
      title: "Achievements & Daily Rewards",
      description:
        "Earn coins, unlock themes, and celebrate your journaling streaks and milestones with fun achievements.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Layers size={24} />,
      title: "Collections & Entry Management",
      description:
        "Organize your entries into collections, filter or delete them easily, and keep your journal tidy.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Palette size={24} />,
      title: "Custom Themes",
      description:
        "Personalize your journal with a variety of beautiful, unlockable themes and fun packs.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Anchor size={24} />,
      title: "Daily Story Chapters",
      description:
        "Purchase a story and receive a new chapter each day in your mailbox, crafted to inspire your journaling journey.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Users size={24} />,
      title: "Public Journals & Community",
      description:
        "Explore, like, and comment on public journal entries. Discover trending topics, top writers, and connect with a vibrant community.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <ShoppingBag size={24} />,
      title: "In-Site Shop",
      description:
        "Discover journaling supplies, premium themes, and exclusive content to enhance your writing experience.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
    },
    {
      icon: <Zap size={24} />,
      title: "AI Journal Companion",
      description:
        "Thoughtful analysis of your entries with kind suggestions and stories.",
      accent: "bg-[var(--accent)] dark:bg-[var(--accent-dark)]/20",
      iconBg: "bg-[var(--accent-text)]",
      upcoming: true,
    },
  ];

  const audience = [
    {
      icon: <Users size={24} />,
      title: "Students",
      description: "A safe space to vent or celebrate your academic journey",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
    {
      icon: <Heart size={24} />,
      title: "Young Users",
      description: "Learning emotional expression in a supportive environment",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
    {
      icon: <Star size={24} />,
      title: "Adults",
      description: "Looking to rekindle the joy of writing and self-reflection",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
  ];

  const promises = [
    {
      icon: <Shield size={24} />,
      title: "We do not sell your data",
      description: "Your privacy is sacred",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
    {
      icon: <Heart size={24} />,
      title: "No ads",
      description: "Just calm, kind, and cozy vibes",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Always evolving",
      description: "We're listening to your stories",
      color: "text-[var(--text-primary)] dark:text-[var(--text-primary-dark)]",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
      {/* SEO Meta Tags */}
      <head>
        <title>About Starlit Journals - Magical Journaling for Everyone</title>
        <meta
          name="description"
          content="Discover Starlit Journals - a cozy, gamified journaling platform that makes writing feel magical, rewarding, and deeply personal. Join our community of dreamers and introspective minds."
        />
        <meta
          name="keywords"
          content="about starlit journals, journaling platform, emotional expression, self-discovery, gamified journaling, magical writing"
        />
        <meta name="author" content="Starlit Journals Team" />
        <meta
          property="og:title"
          content="About Starlit Journals - Magical Journaling Platform"
        />
        <meta
          property="og:description"
          content="A cozy, gamified journaling platform that encourages emotional expression and self-discovery under a sky of stars."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://starlitjournals.com/about" />
      </head>
      <Navbar
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />
      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black dark:border-white"
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-black dark:border-white"
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mt-20 mx-auto p-6 sm:p-8">
        {/* Header with Dark Mode Toggle */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
            OUR STORY
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="relative">
              🌙 About <span className="text-[#5999a8]">Starlit Journals</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-2 text-[#5999a8]"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q25,0 50,5 T100,5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Vision Statement */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-8 mb-16 bg-gradient-to-r from-[#5999a8]/10 to-purple-500/10 dark:from-[#5999a8]/5 dark:to-purple-500/5 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-white/50 dark:bg-[#2A2A2A]/50">
              <Star size={32} className="text-[#5999a8]" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Our Vision
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-medium opacity-90">
            "At Starlit Journals, we believe that everyone deserves a quiet
            space to reflect, express, and grow — under a sky of stars, guided
            by imagination."
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              What We Do
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl leading-relaxed opacity-90">
                <strong>Starlit Journals</strong> is a cozy, gamified journaling
                platform that encourages emotional expression and
                self-discovery.
              </p>
              <p className="text-lg leading-relaxed opacity-80">
                Designed for students, dreamers, and introspective minds, our
                platform makes writing feel magical, rewarding, and deeply
                personal.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              ✨ Our Features
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Discover what makes Starlit Journals uniquely magical and deeply
              personal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-[var(--card-bg)] ${feature.accent} relative`}
              >
                {feature.upcoming && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-md">
                    UPCOMING
                  </div>
                )}
                {feature.optional && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-md">
                    OPTIONAL
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg} text-white`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why We Built This */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-apple p-8 mb-16 bg-[#5999a8]/5 dark:bg-[#5999a8]/10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-apple mb-6">
              <Heart size={32} className="text-[#5999a8]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Why We Built This
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl md:text-2xl leading-relaxed text-center mb-6 font-medium opacity-90 italic">
              "As a solo developer and journaling enthusiast, I wanted to build
              a digital space that feels personal, magical, and helpful —
              something more human than a plain diary, and more cozy than a
              regular app."
            </blockquote>
            <div className="text-center">
              <span className="text-lg font-semibold opacity-70">
                — Founder's note
              </span>
            </div>
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Who It's For
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Starlit Journals welcomes everyone seeking a magical space for
              self-expression
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {audience.map((item, index) => (
              <div
                key={index}
                className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-apple p-8 text-center hover:shadow-xl transition-all duration-300 bg-[var(--card-bg)]"
              >
                <div className={`mb-6 ${item.color}`}>
                  <div className="inline-block p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-apple">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="opacity-80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Promise */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Our Promise
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Your trust and privacy are the foundation of everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promises.map((promise, index) => (
              <div
                key={index}
                className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 bg-[var(--card-bg)]"
              >
                <div className={`mb-4 ${promise.color}`}>
                  <div className="inline-block p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl">
                    {promise.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{promise.title}</h3>
                <p className="opacity-80 leading-relaxed">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-8 bg-gradient-to-r from-[#5999a8]/10 to-purple-500/10 dark:from-[#5999a8]/5 dark:to-purple-500/5 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl">
              <Star size={32} className="text-[#5999a8]" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            "Join our cozy corner of the internet. Let the stars guide your
            story."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openSignupModal}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all duration-300 rounded-md font-semibold text-lg group"
            >
              Start Your Starlit Journey
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 rounded-md font-semibold text-lg"
            >
              Already a Member? Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {modals}
    </div>
  );
};

export default AboutUs;
