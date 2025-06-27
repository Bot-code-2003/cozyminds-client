"use client";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Heart, Share2, Bell, Users, TrendingUp, Tag, Smile } from "lucide-react";
import PublicImg from "../../assets/public.png";

const PublicJournalsShowcase = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Latest Journals",
      description: "Explore the newest anonymous journal entries shared by our community.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trending Journals",
      description: "Discover journals gaining traction and sparking conversations.",
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Popular Topics",
      description: "Dive into trending topics that inspire and connect our community.",
    },
    {
      icon: <Smile className="w-6 h-6" />,
      title: "Entries by Mood",
      description: "Find journal entries that resonate with your emotions.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Who to Follow",
      description: "Connect with top writers sharing unique perspectives.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Like & Engage",
      description: "Show support with likes and join meaningful discussions.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share Stories",
      description: "Share inspiring entries to connect with like-minded readers.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Subscribe to Updates",
      description: "Stay updated with new posts from journals you love.",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold mb-4 text-gray-900 dark:text-gray-100 tracking-tight"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          Vibrant Community Stories
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover, engage, and connect through trending journals, lively discussions, and curated content.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Left Side - Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <img
              src={PublicImg}
              alt="Public Journals Preview"
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-300/10 dark:bg-indigo-600/10 rounded-full blur-xl" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-300/10 dark:bg-indigo-600/10 rounded-full blur-xl" />
        </div>

        {/* Right Side - Content */}
        <div className="space-y-8">
          {/* Feature Highlights */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 sm:p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 ease-in-out hover:shadow-md"
              >
                <div className="p-2.5 bg-indigo-100/50 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-sans font-semibold text-gray-900 dark:text-gray-100 mb-1"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
              Join a thriving community of storytellers and explorers
            </p>
            <Link to="/public-journals" onClick={() => window.scrollTo(0, 0)}>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 ease-in-out font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                <BookOpen size={20} />
                <span>Join the Community</span>
                <ArrowRight size={20} className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicJournalsShowcase;