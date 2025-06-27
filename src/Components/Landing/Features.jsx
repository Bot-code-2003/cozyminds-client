"use client";
import { useState, useEffect } from "react";
import {
  Mail,
  Edit3,
  BookOpen,
  BarChart3,
  Gift,
  ArrowRight,
  Layers,
  Palette,
  Book,
  Anchor,
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import MailImg from "../../assets/inGameMail.png";
import EditorImg from "../../assets/journaleditor.png";
import MoodGraphPreview from "../../assets/mooding.png";
import RewardImg from "../../assets/reward.png";
import CollectionsPreview from "../../assets/collections.png";
import ThemeSelectStepPreview from "../../assets/preview.png";
import EntriesPreview from "../../assets/entries.png";
import Shop from "../../assets/shop copy.png";
import StoryMailPreview from "../../assets/andy_the_sailor.png";
import StoryMailPreview2 from "../../assets/story-d.png";

const Features = ({ setShowLoginModal, setShowSignupModal }) => {
  const { darkMode } = useDarkMode();

  const mainFeatures = [
    {
      icon: <Edit3 size={28} className="text-[var(--accent)]" />,
      title: "Rich Text Editor",
      description: "Write and format your thoughts with an easy-to-use, distraction-free editor.",
      image: EditorImg,
    },
    {
      icon: <BookOpen size={28} className="text-[var(--accent)]" />,
      title: "Beautiful Journals",
      description: "Design journal entries with customizable templates and themes.",
      image: Shop,
    },
    {
      icon: <BarChart3 size={28} className="text-[var(--accent)]" />,
      title: "Mood Analytics",
      description: "Track and understand your emotions with clear, insightful graphs.",
      image: MoodGraphPreview,
    },
    {
      icon: <Mail size={28} className="text-[var(--accent)]" />,
      title: "In-Site Mail",
      description: "Receive messages and rewards directly to the in site mail.",
      image: MailImg,
    },
  ];

  const additionalFeatures = [
    {
      icon: <Gift size={22} className="text-[var(--accent-light)]" />,
      title: "Achievements",
      description: "Earn rewards for your journaling milestones.",
      image: RewardImg,
    },
    {
      icon: <Layers size={22} className="text-[var(--accent-light)]" />,
      title: "Collections",
      description: "Organize entries into collections you create.",
      image: CollectionsPreview,
    },
    {
      icon: <Palette size={22} className="text-[var(--accent-light)]" />,
      title: "Custom Themes",
      description: "Personalize your journal with beautiful themes.",
      image: ThemeSelectStepPreview,
    },
    {
      icon: <Book size={22} className="text-[var(--accent-light)]" />,
      title: "Entry Management",
      description: "View, filter, or delete your journal entries easily.",
      image: EntriesPreview,
    },
  ];

  // Signature story images
  const storyImages = [StoryMailPreview, StoryMailPreview2];

  return (
    <section className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16 sm:pb-10 sm:pt-24 font-sans">
      {/* Header */}
      <header className="text-center mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--text-primary)] leading-tight tracking-tight font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          Everything you need to journal beautifully
        </h2>
        <p className="text-xl sm:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          Discover powerful tools designed to make your journaling experience effortless and inspiring.
        </p>
      </header>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {mainFeatures.map((feature, idx) => (
          <div key={idx} className="flex flex-col bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border)] p-8 md:p-10 gap-4 hover:shadow-2xl hover:border-[var(--accent)] transition-all duration-500 ease-in-out">
            <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
              <div className="mb-4 md:mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.title}</h3>
              <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.description}</p>
            </div>
            <div className="w-full flex-shrink-0 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card-bg)]">
              <img
                src={feature.image}
                alt={`${feature.title} preview`}
                className="w-full h-60 object-cover object-top transition-all duration-700 ease-in-out hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent dark:via-[var(--accent)] mb-24" />

      {/* Additional Features Grid */}
      <div className="mb-24">
        <header className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)] tracking-tight font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            More powerful features
          </h3>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-light font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Additional tools to enhance your journaling experience.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {additionalFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-2xl shadow border border-[var(--border)] p-6 gap-6 hover:shadow-xl hover:border-[var(--accent)] transition-all duration-500 ease-in-out">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="mb-2">{feature.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-[var(--text-primary)] mb-1 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.title}</h4>
                <p className="text-base text-[var(--text-secondary)] font-light font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent dark:via-[var(--accent)] mb-24" />

      {/* Signature Feature: Daily Story Chapters */}
      <div className="mb-24">
        <header className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)] tracking-tight font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Our Signature Story Experience
          </h3>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-light font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Immerse yourself in a unique storytelling journey delivered to your in-site mailbox.
          </p>
        </header>
        <div className="bg-gradient-to-br from-[var(--accent-light)]/80 dark:from-[var(--accent)]/40 to-white dark:to-gray-900 border-2 border-[var(--accent-light)] dark:border-[var(--accent)] rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out p-0 sm:p-0">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--accent-light)] dark:bg-[var(--accent)] flex items-center justify-center text-[var(--accent)] dark:text-[var(--accent-light)] flex-shrink-0">
                  <Anchor size={28} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  Daily Story Chapters
                </h3>
              </div>
              <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed mb-8 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                Purchase a captivating story and receive a new chapter each day in your in-site mailbox, crafted by engaging characters to inspire your journaling journey.
              </p>
              <button
                onClick={() => setShowSignupModal && setShowSignupModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:bg-[var(--accent-hover)] transition-all duration-500 ease-in-out font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] font-sans"
                aria-label="Claim your first free story chapter"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                Claim Your First Free Chapter
                <ArrowRight size={22} className="transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
              </button>
            </div>

            {/* Image with Rotation */}
            <div className="lg:col-span-3 p-6 sm:p-8 order-1 lg:order-2">
              <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] relative">
                {storyImages.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg?height=400&width=600"}
                    alt={`Daily Story Chapters preview ${index + 1}`}
                    className={`w-full h-full object-contain sm:object-cover absolute top-0 left-0 transition-all duration-700 ease-in-out ${
                      index === 0 ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
