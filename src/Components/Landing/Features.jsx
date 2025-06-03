"use client";
import { useState } from "react";
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

const Features = ({ setShowLoginModal }) => {
  const { darkMode } = useDarkMode();
  const [activeFeature, setActiveFeature] = useState(0);

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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Everything you need to journal beautifully
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover powerful tools designed to make your journaling experience
          effortless and inspiring.
        </p>
      </div>

      {/* Main Features */}
      <div className="mb-20">
        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {mainFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFeature === index
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {feature.icon}
              <span className="hidden sm:inline">{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  {mainFeatures[activeFeature].icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mainFeatures[activeFeature].title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {mainFeatures[activeFeature].description}
              </p>
            </div>

            {/* Large Image */}
            <div className="lg:col-span-3 p-4">
              <div className="w-full h-80 lg:h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={
                    mainFeatures[activeFeature].image ||
                    "/placeholder.svg?height=400&width=600"
                  }
                  alt={mainFeatures[activeFeature].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features - 2 Column Layout */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            More powerful features
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Additional tools to enhance your journaling experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Large Image for Additional Features */}
              <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={feature.image || "/placeholder.svg?height=200&width=400"}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="inline-block p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Start journaling today
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Join thousands who have transformed their journaling experience.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 font-medium"
          >
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
