"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { Brain, Sunrise, Moon } from "lucide-react";
import AuthModals from "./AuthModals";
import { useEffect, useState } from "react";
import BlogPostData from "./blogPosts.json";
import { useNavigate } from "react-router-dom";

const BlogPage = ({ darkMode, setDarkMode, onBack }) => {
  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const [post, setPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  // get the slug from param
  useEffect(() => {
    const slug = window.location.pathname.split("/").pop();
    console.log("Slug:", slug);

    const post = BlogPostData.find((post) => post.slug === slug);
    if (post) {
      setPost(post);
    }

    console.log("Post:", post);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Brain: <Brain size={24} className="sm:w-8 sm:h-8" />,
      Sunrise: <Sunrise size={24} className="sm:w-8 sm:h-8" />,
      BookOpen: <BookOpen size={24} className="sm:w-8 sm:h-8" />,
      Heart: <Heart size={24} className="sm:w-8 sm:h-8" />,
      Moon: <Moon size={24} className="sm:w-8 sm:h-8" />,
    };
    return icons[iconName] || <BookOpen size={24} className="sm:w-8 sm:h-8" />;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    post && (
      <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
        {/* SEO Meta Tags */}
        <head>
          <title>{post.seo.ogTitle} | Starlit Journals Blog</title>
          <meta name="description" content={post.metaDescription} />
          <meta name="keywords" content={post.seo.keywords} />
          <meta name="author" content={post.author} />
          <link rel="canonical" href={post.seo.canonicalUrl} />

          {/* Open Graph */}
          <meta property="og:title" content={post.seo.ogTitle} />
          <meta property="og:description" content={post.seo.ogDescription} />
          <meta property="og:image" content={post.seo.ogImage} />
          <meta property="og:url" content={post.seo.canonicalUrl} />
          <meta property="og:type" content={post.seo.contentType} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.seo.twitterTitle} />
          <meta
            name="twitter:description"
            content={post.seo.twitterDescription}
          />
          <meta name="twitter:image" content={post.seo.twitterImage} />

          {/* Article specific */}
          <meta property="article:author" content={post.author} />
          <meta property="article:published_time" content={post.date} />
          <meta property="article:modified_time" content={post.lastUpdated} />
          <meta property="article:section" content={post.category} />
          {post.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </head>

        {/* Gradient Accents */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

        {/* Grid Pattern Background - Hidden on mobile for better performance */}
        <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none hidden sm:block">
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Mobile Navigation */}
          <div className="flex items-center justify-between mb-6 sm:hidden">
            <button
              onClick={() => navigate("/starlitblogs")}
              className="flex items-center gap-2 px-3 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                aria-label="Share article"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sunrise size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mb-6 p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    openLoginModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-3 text-left border border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openSignupModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/starlitblogs")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-md hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-md hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                aria-label="Share article"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-md hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sunrise size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9]">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2 sm:px-3 py-1 bg-[#5999a8] text-white text-xs sm:text-sm font-medium rounded-md">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-2 sm:px-3 py-1 bg-white/20 text-white text-xs sm:text-sm font-medium rounded-md">
                  FEATURED
                </span>
              )}
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl bg-[#5999a8]/10 dark:bg-[#5999a8]/20 w-fit">
                {getIcon(post.icon)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4">
                  {post.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl opacity-80 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Article Meta */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm opacity-70 mb-4 sm:mb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <User size={14} className="sm:w-4 sm:h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar size={14} className="sm:w-4 sm:h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <BookOpen size={14} className="sm:w-4 sm:h-4" />
                <span>{post.wordCount} words</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 bg-[#5999a8]/10 dark:bg-[#5999a8]/20 text-xs sm:text-sm rounded-md border border-[#1A1A1A] dark:border-[#F8F1E9] flex items-center gap-1"
                >
                  <Tag size={10} className="sm:w-3 sm:h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-sm sm:prose-lg max-w-none mb-8 sm:mb-12">
            <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm">
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h2
                      key={index}
                      className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 first:mt-0"
                    >
                      {paragraph.replace(/\*\*/g, "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("•")) {
                  const items = paragraph.split("\n");
                  return (
                    <ul
                      key={index}
                      className="list-disc list-inside space-y-2 sm:space-y-3 mb-4 sm:mb-6 ml-2 sm:ml-4"
                    >
                      {items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="leading-relaxed text-sm sm:text-base md:text-lg"
                        >
                          {item.replace("• ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  const items = paragraph.split("\n");
                  return (
                    <ol
                      key={index}
                      className="list-decimal list-inside space-y-2 sm:space-y-3 mb-4 sm:mb-6 ml-2 sm:ml-4"
                    >
                      {items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="leading-relaxed text-sm sm:text-base md:text-lg"
                        >
                          {item.replace(/^\d+\.\s*/, "")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p
                    key={index}
                    className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 opacity-90"
                    dangerouslySetInnerHTML={{
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
                        .replace(/\*(.*?)\*/g, "<em>$1</em>"), // Italics (optional)
                    }}
                  ></p>
                );
              })}
            </div>
          </article>

          {/* Author Bio */}
          <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 bg-[#5999a8]/5 dark:bg-[#5999a8]/10">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              About the Author
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl bg-[#5999a8]/10 dark:bg-[#5999a8]/20 w-fit">
                <User size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base sm:text-lg mb-2">
                  {post.author}
                </h4>
                <p className="opacity-80 leading-relaxed text-sm sm:text-base">
                  {post.authorBio}
                </p>
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm opacity-70">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span>Published: {post.date}</span>
                {post.lastUpdated !== post.date && (
                  <span>Updated: {post.lastUpdated}</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span>Reading Level: {post.seo.readingLevel}</span>
                <span>Category: {post.category}</span>
              </div>
            </div>
          </footer>

          {/* CTA Section */}
          <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-[#5999a8]/10 dark:bg-[#5999a8]/5 text-center">
            <div className="mb-4 sm:mb-6">
              <div className="inline-block p-3 sm:p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl">
                <Heart size={24} className="sm:w-8 sm:h-8" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 tracking-tight">
              Inspired to Start Journaling?
            </h3>
            <p className="text-sm sm:text-base md:text-lg opacity-80 mb-6 max-w-xl mx-auto leading-relaxed px-4">
              Join our community of mindful writers and discover the
              transformative power of daily reflection. Your journey to clarity
              starts here.
            </p>
            <div className="flex flex-col gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={openSignupModal}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all duration-300 rounded-md font-semibold text-base sm:text-lg group w-full"
              >
                Start Your Cozy Journey
                <ArrowLeft
                  size={18}
                  className="sm:w-5 sm:h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
              <button
                onClick={openLoginModal}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 rounded-md font-semibold text-base sm:text-lg w-full"
              >
                Already a Member? Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Auth Modals */}
        {modals}
      </div>
    )
  );
};

export default BlogPage;
