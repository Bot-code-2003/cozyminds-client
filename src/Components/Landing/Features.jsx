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
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const storyImages = [StoryMailPreview, StoryMailPreview2]; //

  const mainFeatures = [
    {
      icon: <Edit3 size={20} />,
      title: "Rich Text Editor",
      description: "Write and format your thoughts with an easy-to-use editor.",
      image: EditorImg,
    },
    {
      icon: <BookOpen size={20} />,
      title: "Beautiful Journals",
      description: "Design journal entries with customizable templates.",
      image: Shop,
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Mood Analytics",
      description: "Track and understand your emotions with clear insights.",
      image: MoodGraphPreview,
    },
    {
      icon: <Mail size={20} />,
      title: "In-Site Mail",
      description: "Receive messages and rewards from in-world characters.",
      image: MailImg,
    },
  ];
  
  const additionalFeatures = [
    {
      icon: <Gift size={24} />,
      title: "Achievement System",
      description: "Earn rewards for your journaling milestones.",
      image: RewardImg,
    },
    {
      icon: <Layers size={24} />,
      title: "Collections",
      description: "Organize entries into collections you create.",
      image: CollectionsPreview,
    },
    {
      icon: <Palette size={24} />,
      title: "Custom Themes",
      description: "Personalize your journal with beautiful themes.",
      image: ThemeSelectStepPreview,
    },
    {
      icon: <Book size={24} />,
      title: "Entry Management",
      description: "View, filter, or delete your journal entries easily.",
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
  className="mb-10 sm:mb-14"
  role="tablist"
  aria-label="Feature navigation"
>
  <div className="flex justify-center">
    <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full shadow-sm">
      {mainFeatures.map((feature, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={activeFeature === index}
          aria-controls={`feature-panel-${index}`}
          onClick={() => setActiveFeature(index)}
          className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium font-sans transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600 ${
            activeFeature === index
              ? "bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
              : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          }`}
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          <span className="flex-shrink-0">{feature.icon}</span>
          <span className="hidden xs:inline sm:inline whitespace-nowrap">
            {feature.title}
          </span>
        </button>
      ))}
    </div>
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
              <div className="w-full min-h-[350px] max-h-[350px] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                <img
                  src={
                    mainFeatures[activeFeature].image ||
                    "/placeholder.svg?height=400&width=600" ||
                    "/placeholder.svg"
                  }
                  alt={`${mainFeatures[activeFeature].title} preview`}
                  className="w-full min-h-[350px] object-cover transition-all duration-700 ease-in-out hover:scale-105"
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
