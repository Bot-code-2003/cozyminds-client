"use client";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Heart, Share2, Bell, Users, TrendingUp, Tag, Smile } from "lucide-react";
import PublicImg from "../../assets/public.png";
import { Helmet } from "react-helmet";

const PublicJournalsShowcase = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />, 
      title: "Latest Entries",
      description: "Explore the newest anonymous journals and stories shared by our community.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trending Entries",
      description: "Discover journals and stories gaining traction and sparking conversations.",
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Popular Topics",
      description: "Dive into trending topics that inspire and connect our community.",
    },
    {
      icon: <Smile className="w-6 h-6" />,
      title: "Entries by Mood",
      description: "Find journals and stories that resonate with your emotions.",
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
      title: "Share Stories & Journals",
      description: "Share inspiring entries to connect with like-minded readers.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Subscribe to Updates",
      description: "Stay updated with new posts from writers you love.",
    },
  ];

  // Group features for editorial cards
  const discoverFeatures = features.filter(f => [
    "Latest Entries",
    "Trending Entries",
    "Popular Topics"
  ].includes(f.title));
  const engageFeatures = features.slice(4);

  return (
    <>
      <Helmet>
        <title>Trending Public Journals & Stories | Discover Popular Diary Topics</title>
        <meta name="description" content="Discover trending public journals and stories, popular diary topics, and anonymous confessions. Read, engage, and connect with a vibrant community of storytellers." />
        <meta name="keywords" content="trending public journals, stories, popular diary topics, read confessions, anonymous stories, community journals, discover diaries, confession site, mental health stories" />
        <meta property="og:title" content="Trending Public Journals & Stories | Discover Popular Diary Topics" />
        <meta property="og:description" content="Discover trending public journals and stories, popular diary topics, and anonymous confessions. Read, engage, and connect with a vibrant community of storytellers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://starlitjournals.com/public-journals" />
        <meta property="og:image" content="/public/andy_the_sailor.png" />
      </Helmet>
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28  font-sans">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--text-primary)] tracking-tight font-sans"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Vibrant Community Stories & Journals
          </h2>
          <p className="text-xl sm:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Discover, engage, and connect through trending entries, lively discussions, and curated content.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)]">
              <img
                src={PublicImg}
                alt="Public Journals & Stories Preview"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
            </div>
          </div>

          {/* Right Side - Editorial Cards */}
          <div className="flex flex-col gap-10">
            {/* Discover & Explore Card */}
            <div className="bg-[var(--card-bg)] dark:bg-[var(--bg-secondary)] rounded-3xl shadow-xl border border-[var(--border)] p-8 md:p-10 flex flex-col gap-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Discover & Explore</h3>
              <ul className="space-y-5">
                {discoverFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="p-3 bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-xl text-[var(--accent)] dark:text-[var(--accent)] flex-shrink-0 mt-1">{feature.icon}</span>
                    <div>
                      <span className="block text-lg font-bold text-[var(--text-primary)] mb-1 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.title}</span>
                      <span className="block text-[var(--text-secondary)] text-base font-light leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engage & Connect Card */}
            <div className="bg-[var(--card-bg)] dark:bg-[var(--bg-secondary)] rounded-3xl shadow-xl border border-[var(--border)] p-8 md:p-10 flex flex-col gap-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Engage & Connect</h3>
              <ul className="space-y-5">
                {engageFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="p-3 bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-xl text-[var(--accent)] dark:text-[var(--accent)] flex-shrink-0 mt-1">{feature.icon}</span>
                    <div>
                      <span className="block text-lg font-bold text-[var(--text-primary)] mb-1 font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.title}</span>
                      <span className="block text-[var(--text-secondary)] text-base font-light leading-relaxed font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{feature.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col items-center gap-4 pt-2">
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] text-center font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                Join a thriving community of storytellers and explorers
              </p>
              <Link to="/public-journals" onClick={() => window.scrollTo(0, 0)}>
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white rounded-2xl hover:from-[var(--accent-hover)] hover:to-[var(--accent)] transition-all duration-300 ease-in-out font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] font-sans text-lg"
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                >
                  <BookOpen size={22} />
                  <span>Join the Community</span>
                  <ArrowRight size={22} className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicJournalsShowcase;