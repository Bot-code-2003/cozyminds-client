"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Heart,
  Brain,
  Sunrise,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import blogPostsData from "./blogPosts.json";
import BlogPage from "./BlogPage";
import AuthModals from "./AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

const CozyMindsBlog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBlogPage, setShowBlogPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useDarkMode();
  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  useEffect(() => {
    scrollTo(0, 0);
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

  const getIcon = (iconName) => {
    const icons = {
      Brain: <Brain size={20} className="sm:w-6 sm:h-6" />,
      Sunrise: <Sunrise size={20} className="sm:w-6 sm:h-6" />,
      BookOpen: <BookOpen size={20} className="sm:w-6 sm:h-6" />,
      Heart: <Heart size={20} className="sm:w-6 sm:h-6" />,
      Moon: <Moon size={20} className="sm:w-6 sm:h-6" />,
    };
    return icons[iconName] || <BookOpen size={20} className="sm:w-6 sm:h-6" />;
  };

  const openBlogPost = (post) => {
    setSelectedPost(post);
    setShowBlogPage(true);
    window.scrollTo(0, 0);
  };

  const closeBlogPost = () => {
    setShowBlogPage(false);
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  // If showing blog page, render BlogPage component
  if (showBlogPage && selectedPost) {
    navigate(`/blog/${selectedPost.slug}`);
  }

  const featuredPost = blogPostsData.find((post) => post.featured);
  const regularPosts = blogPostsData.filter((post) => !post.featured);

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
      {/* SEO Meta Tags */}
      <head>
        <title>
          Starlit Journals Blog - Mindful Journaling Insights & Mental Wellness
          Tips
        </title>
        <meta
          name="description"
          content="Discover thoughtful insights, gentle guidance, and inspiring stories to support your journaling journey and mental wellness. Expert tips on mindful writing and self-reflection."
        />
        <meta
          name="keywords"
          content="journaling blog, mental wellness, mindfulness, self-reflection, therapeutic writing, emotional health, mindful living"
        />
        <meta name="author" content="Cozy Minds Team" />
        <meta
          property="og:title"
          content="Cozy Minds Blog - Mindful Journaling Insights"
        />
        <meta
          property="og:description"
          content="Thoughtful insights and gentle guidance for your journaling journey and mental wellness."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cozyminds.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Starlit Journals Blog - Mindful Journaling Insights"
        />
        <meta
          name="twitter:description"
          content="Discover expert tips on journaling, mindfulness, and mental wellness."
        />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Header */}

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

        {/* Desktop Header */}
        <div className="text-center mb-8 mt-20 sm:mb-16">
          <div className="inline-block mb-3 sm:mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
            MINDFUL READING
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="relative">
              Statlit Journals <span className="text-[#5999a8]">Blog</span>
              <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 text-[#5999a8]"
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
          <p className="text-base sm:text-lg md:text-xl opacity-80 font-medium max-w-2xl mx-auto px-4">
            Thoughtful insights, gentle guidance, and inspiring stories to
            support your journaling journey and mental wellness.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-8 sm:mb-16">
            <div
              className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl overflow-hidden bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => openBlogPost(featuredPost)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden order-1 md:order-1">
                  <img
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-48 sm:h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2 sm:px-3 py-1 bg-[#5999a8] text-white text-xs font-medium rounded-md shadow-lg">
                      FEATURED
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 order-2 md:order-2">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl bg-[#5999a8]/10 dark:bg-[#5999a8]/20 group-hover:scale-110 transition-transform duration-300">
                      {getIcon(featuredPost.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-medium opacity-70">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight group-hover:text-[#5999a8] transition-colors duration-300">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg opacity-80 mb-4 sm:mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-70">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <User size={14} className="sm:w-4 sm:h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Clock size={14} className="sm:w-4 sm:h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-md group-hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base w-fit">
                      Read More
                      <ArrowRight
                        size={14}
                        className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl overflow-hidden bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => openBlogPost(post)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <div className="p-1.5 sm:p-2 bg-white/90 dark:bg-[#1A1A1A]/90 rounded-xl sm:rounded-2xl border border-[#1A1A1A] dark:border-[#F8F1E9] group-hover:scale-110 transition-transform duration-300">
                    {getIcon(post.icon)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-[#5999a8]/10 dark:bg-[#5999a8]/20 rounded-md">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 leading-tight group-hover:text-[#5999a8] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base opacity-80 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <span className="text-right sm:text-left">{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Signup CTA */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-[#5999a8]/10 dark:bg-[#5999a8]/5 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="inline-block p-3 sm:p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl sm:rounded-2xl">
              <Heart size={24} className="sm:w-8 sm:h-8" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 tracking-tight">
            Ready to Start Your Journey?
          </h3>
          <p className="text-base sm:text-lg opacity-80 mb-6 max-w-xl mx-auto leading-relaxed px-4">
            Join thousands of mindful writers who've discovered the
            transformative power of daily journaling. Your cozy space awaits.
          </p>
          <div className="flex flex-col gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={openSignupModal}
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all duration-300 rounded-md font-semibold text-base sm:text-lg group w-full"
            >
              Begin Your Cozy Journey
              <ArrowRight
                size={18}
                className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
  );
};

export default CozyMindsBlog;
