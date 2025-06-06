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
    <section className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <header className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
          Everything you need to journal beautifully
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover powerful tools designed to make your journaling experience
          effortless and inspiring.
        </p>
      </header>

      {/* Main Features */}
      <div className="mb-16 sm:mb-20">
        {/* Feature Navigation */}
        <nav
          className="mb-8 sm:mb-12"
          role="tablist"
          aria-label="Feature navigation"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {mainFeatures.map((feature, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeFeature === index}
                aria-controls={`feature-panel-${index}`}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 ${
                  activeFeature === index
                    ? "bg-gray-900 dark:bg-gray-100 shadow-lg text-white dark:text-gray-900 transform scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-102"
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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          role="tabpanel"
          id={`feature-panel-${activeFeature}`}
          aria-labelledby={`feature-tab-${activeFeature}`}
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {mainFeatures[activeFeature].icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {mainFeatures[activeFeature].title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                {mainFeatures[activeFeature].description}
              </p>
            </div>

            {/* Image */}
            <div className="lg:col-span-3 p-4 sm:p-6 order-1 lg:order-2">
              <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img
                  src={
                    mainFeatures[activeFeature].image ||
                    "/placeholder.svg?height=400&width=600" ||
                    "/placeholder.svg"
                  }
                  alt={`${mainFeatures[activeFeature].title} preview`}
                  className="w-full h-full object-contain sm:object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-12 sm:mb-16">
        <header className="text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            More powerful features
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Additional tools to enhance your journaling experience.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {additionalFeatures.map((feature, index) => (
            <article
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Feature Image */}
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img
                  src={feature.image || "/placeholder.svg?height=200&width=400"}
                  alt={`${feature.title} preview`}
                  className="w-full h-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Signature Feature: Daily Story Chapters */}
      <div className="mb-12 sm:mb-16">
        <header className="text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Our Signature Story Experience
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Immerse yourself in a unique storytelling journey delivered to your
            in-site mailbox.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0">
                  <Anchor size={20} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Daily Story Chapters
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-6">
                Purchase a captivating story and receive a new chapter each day
                in your in-site mailbox, crafted by engaging characters to
                inspire your journaling journey.
              </p>
              <button
                onClick={() => setShowSignupModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                aria-label="Claim your first free story chapter"
              >
                Claim Your First Free Chapter
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Image with Rotation */}
            <div className="lg:col-span-3 p-4 sm:p-6 order-1 lg:order-2">
              <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 relative">
                {storyImages.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg?height=400&width=600"}
                    alt={`Daily Story Chapters preview ${index + 1}`}
                    className={`w-full h-full object-contain sm:object-cover absolute top-0 left-0 transition-opacity duration-500 ${
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
