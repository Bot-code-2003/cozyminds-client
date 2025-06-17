"use client";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Heart, MessageCircle, Eye, Share2, Bookmark } from "lucide-react";
import PublicImg from "../../assets/public.png";

const PublicJournalsShowcase = () => {
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Engage with Stories",
      description: "Like, comment, and interact with inspiring journal entries from our community."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share Your Journey",
      description: "Share your experiences and connect with others who share similar interests."
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: "Save Favorites",
      description: "Bookmark your favorite entries and build your personal collection of inspiration."
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">
          Discover Inspiring Stories
        </h2>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Explore a world of shared experiences, insights, and personal journeys from our community.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 ease-in-out">
            <img
              src={PublicImg}
              alt="Public Journals Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent" />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--accent)]/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-2xl" />
        </div>

        {/* Right Side - Content */}
        <div className="space-y-12">
          {/* Feature Highlights */}
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-500 ease-in-out hover:shadow-xl"
              >
                <div className="p-3 bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-6 pt-6">
            <p className="text-lg text-[var(--text-secondary)] text-center">
              Join our community of writers and readers today
            </p>
            <Link 
              to="/public-journals" 
              onClick={() => window.scrollTo(0, 0)}
            >
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:bg-[var(--accent-hover)] transition-all duration-500 ease-in-out font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]">
                <BookOpen size={20} />
                <span>Start Exploring</span>
                <ArrowRight size={20} className="transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicJournalsShowcase; 