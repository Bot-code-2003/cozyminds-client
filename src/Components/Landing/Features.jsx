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
import MailImg from "../../assets/mailing-d.png";
import EditorImg from "../../assets/editor-d.png";
import MoodGraphPreview from "../../assets/mooding.png";
import RewardImg from "../../assets/reward.png";
import CollectionsPreview from "../../assets/collections.png";
import ThemeSelectStepPreview from "../../assets/preview.png";
import EntriesPreview from "../../assets/entries.png";
import Shop from "../../assets/shop-d.png";
import StoryMailPreview from "../../assets/andy_the_sailor.png";
import StoryMailPreview2 from "../../assets/story-d.png";

const Features = ({ setShowLoginModal, setShowSignupModal }) => {
  const { darkMode } = useDarkMode();
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const storyImages = [StoryMailPreview, StoryMailPreview2]; //

  const mainFeatures = [
    {
      icon: <Edit3 size={20} />,
      title: "Rich Text Editor",
      description:
        "Express yourself with a powerful, intuitive editor featuring clean formatting and seamless content organization.",
      image: EditorImg,
    },
    {
      icon: <BookOpen size={20} />,
      title: "Beautiful Journals",
      description:
        "Create stunning journal entries with customizable templates and layouts that reflect your personal style.",
      image: Shop,
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Mood Analytics",
      description:
        "Track your emotional patterns with comprehensive mood analysis and insights for better wellbeing.",
      image: MoodGraphPreview,
    },
    {
      icon: <Mail size={20} />,
      title: "In Site Mails",
      description:
        "Get rewards, encouragement messages and much more from charming in-world personalities.",
      image: MailImg,
    },
  ];

  const additionalFeatures = [
    {
      icon: <Gift size={24} />,
      title: "Achievement System",
      description:
        "Stay motivated with rewards that celebrate your journaling milestones and consistency.",
      image: RewardImg,
    },
    {
      icon: <Layers size={24} />,
      title: "Smart Collections",
      description:
        "Organize entries with intelligent tagging and powerful search capabilities.",
      image: CollectionsPreview,
    },
    {
      icon: <Palette size={24} />,
      title: "Custom Themes",
      description:
        "Personalize your experience with beautiful themes and customization options.",
      image: ThemeSelectStepPreview,
    },
    {
      icon: <Book size={24} />,
      title: "Entry Management",
      description:
        "Browse and manage your entries with powerful filtering and organization tools.",
      image: EntriesPreview,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % storyImages.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16 sm:pb-10 sm:pt-24">
      {/* Header */}
      <header className="text-center mb-16 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[var(--text-primary)] leading-tight tracking-tight">
          Everything you need to journal beautifully
        </h2>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Discover powerful tools designed to make your journaling experience
          effortless and inspiring.
        </p>
      </header>

      {/* Main Features */}
      <div className="mb-24 sm:mb-32">
        {/* Feature Navigation */}
        <nav
          className="mb-12 sm:mb-16"
          role="tablist"
          aria-label="Feature navigation"
        >
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {mainFeatures.map((feature, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeFeature === index}
                aria-controls={`feature-panel-${index}`}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] ${
                  activeFeature === index
                    ? "bg-[var(--accent)] text-white shadow-xl transform scale-105"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:scale-102"
                }`}
              >
                <span className="flex-shrink-0">{feature.icon}</span>
                <span className="hidden xs:inline sm:inline whitespace-nowrap">
                  {feature.title}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Active Feature Display */}
        <div
          className="bg-[var(--card-bg)] dark:bg-[var(--bg-secondary)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden transition-all duration-500 ease-in-out"
          role="tabpanel"
          id={`feature-panel-${activeFeature}`}
          aria-labelledby={`feature-tab-${activeFeature}`}
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0 transition-colors duration-300">
                  {mainFeatures[activeFeature].icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                  {mainFeatures[activeFeature].title}
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg sm:text-xl">
                {mainFeatures[activeFeature].description}
              </p>
            </div>

            {/* Image */}
            <div className="lg:col-span-3 p-6 sm:p-8 order-1 lg:order-2">
              <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                <img
                  src={
                    mainFeatures[activeFeature].image ||
                    "/placeholder.svg?height=400&width=600" ||
                    "/placeholder.svg"
                  }
                  alt={`${mainFeatures[activeFeature].title} preview`}
                  className="w-full h-full object-contain sm:object-cover transition-all duration-700 ease-in-out hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-24 sm:mb-32">
        <header className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
            More powerful features
          </h3>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base sm:text-lg">
            Additional tools to enhance your journaling experience.
          </p>
        </header>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
          {additionalFeatures.map((feature, index) => (
            <article
              key={index}
              className="bg-[var(--card-bg)] dark:bg-[var(--bg-secondary)] rounded-3xl shadow-xl border border-[var(--border)] p-8 hover:border-[var(--accent)] hover:shadow-2xl transition-all duration-500 ease-in-out group"
            >
              <div className="flex items-start gap-5 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0 group-hover:bg-[var(--bg-hover)] transition-colors duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 leading-tight tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-base sm:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Feature Image */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                <img
                  src={feature.image || "/placeholder.svg?height=200&width=400"}
                  alt={`${feature.title} preview`}
                  className="w-full h-full object-contain sm:object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Signature Feature: Daily Story Chapters */}
      <div className="mb-24 sm:mb-32">
        <header className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
            Our Signature Story Experience
          </h3>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base sm:text-lg">
            Immerse yourself in a unique storytelling journey delivered to your
            in-site mailbox.
          </p>
        </header>

        <div className="bg-[var(--card-bg)] dark:bg-[var(--bg-secondary)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden transition-all duration-500 ease-in-out">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0">
                  <Anchor size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                  Daily Story Chapters
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg sm:text-xl mb-8">
                Purchase a captivating story and receive a new chapter each day
                in your in-site mailbox, crafted by engaging characters to
                inspire your journaling journey.
              </p>
              <button
                onClick={() => setShowSignupModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:bg-[var(--accent-hover)] transition-all duration-500 ease-in-out font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
                aria-label="Claim your first free story chapter"
              >
                Claim Your First Free Chapter
                <ArrowRight
                  size={20}
                  className="transition-transform duration-500 ease-in-out group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Image with Rotation */}
            <div className="lg:col-span-3 p-6 sm:p-8 order-1 lg:order-2">
              <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] relative">
                {storyImages.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg?height=400&width=600"}
                    alt={`Daily Story Chapters preview ${index + 1}`}
                    className={`w-full h-full object-contain sm:object-cover absolute top-0 left-0 transition-all duration-700 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
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
