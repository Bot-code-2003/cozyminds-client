"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  BookOpen,
  Heart,
  Menu,
  X,
  Sunrise,
  Moon,
  ChevronRight,
} from "lucide-react";
import AuthModals from "./AuthModals";
import { useEffect, useState } from "react";
import BlogPostData from "./blogPosts.json";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";

const BlogPage = ({ onBack }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const [post, setPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const navigate = useNavigate();
  const { slug } = useParams();

  // Parse content with proper formatting
  const parseContent = (content) => {
    if (!content) return [];

    const sections = content
      .split(/\n{1,2}/)
      .map((section) => section.trim())
      .filter(Boolean);

    let parsedSections = [];
    let currentList = null;

    sections.forEach((section, index) => {
      if (section.startsWith("**") && section.endsWith("**")) {
        if (currentList) {
          parsedSections.push(currentList);
          currentList = null;
        }
        parsedSections.push({
          type: "heading",
          content: section.replace(/\*\*/g, ""),
          index,
        });
        return;
      }

      if (section.startsWith("- ") || section.startsWith("• ")) {
        if (!currentList || currentList.type !== "list") {
          if (currentList) {
            parsedSections.push(currentList);
          }
          currentList = {
            type: "list",
            items: [],
            index,
          };
        }
        currentList.items.push(section.replace(/^[-•]\s*/, ""));
        return;
      }

      if (section.match(/^\d+\.\s/)) {
        if (!currentList || currentList.type !== "orderedList") {
          if (currentList) {
            parsedSections.push(currentList);
          }
          currentList = {
            type: "orderedList",
            items: [],
            index,
          };
        }
        currentList.items.push(section.replace(/^\d+\.\s*/, ""));
        return;
      }

      if (currentList) {
        parsedSections.push(currentList);
        currentList = null;
      }
      parsedSections.push({
        type: "paragraph",
        content: section,
        index,
      });
    });

    if (currentList) {
      parsedSections.push(currentList);
    }

    return parsedSections;
  };

  const formatText = (text) => {
    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
      );
  };

  useEffect(() => {
    if (slug) {
      const foundPost = BlogPostData.find((post) => post.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        document.title = `${foundPost.title} | Starlit Journals Blog`;
      }
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);

      // Calculate reading progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleRecommendationClick = (recommendedPost) => {
    navigate(`/blog/${recommendedPost.slug}`);
    window.scrollTo(0, 0);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  const parsedContent = parseContent(post.content);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/starlitblogs")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline font-medium">Back</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Share article"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sunrise size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 sm:hidden">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  openLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 text-left border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openSignupModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{post.wordCount} words</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {post.image && (
          <div className="mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {parsedContent.map((section) => {
            switch (section.type) {
              case "heading":
                return (
                  <h2
                    key={section.index}
                    className="text-2xl sm:text-3xl font-bold mt-12 mb-6 first:mt-0 text-gray-900 dark:text-gray-100"
                  >
                    {section.content}
                  </h2>
                );

              case "list":
                return (
                  <ul
                    key={section.index}
                    className="list-disc list-inside space-y-2 mb-8 text-gray-700 dark:text-gray-300"
                  >
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="leading-relaxed pl-2"
                        dangerouslySetInnerHTML={{ __html: formatText(item) }}
                      />
                    ))}
                  </ul>
                );

              case "orderedList":
                return (
                  <ol
                    key={section.index}
                    className="list-decimal list-inside space-y-2 mb-8 text-gray-700 dark:text-gray-300"
                  >
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="leading-relaxed pl-2"
                        dangerouslySetInnerHTML={{ __html: formatText(item) }}
                      />
                    ))}
                  </ol>
                );

              case "paragraph":
                return (
                  <p
                    key={section.index}
                    className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: formatText(section.content),
                    }}
                  />
                );

              default:
                return null;
            }
          })}
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <span>Published {post.date}</span>
              {post.lastUpdated !== post.date && (
                <span>Updated {post.lastUpdated}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>{post.seo.readingLevel} level</span>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-12">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              About {post.author}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.authorBio}
            </p>
          </div>
        </footer>

        {/* Related Articles */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Related Articles
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const relatedPosts = BlogPostData.filter((p) => {
                if (p.id === post.id) return false;
                const sameCategory = p.category === post.category;
                const commonTags = p.tags.some((tag) =>
                  post.tags.includes(tag)
                );
                return sameCategory || commonTags;
              }).slice(0, 3);

              if (relatedPosts.length < 3) {
                const otherPosts = BlogPostData.filter(
                  (p) =>
                    p.id !== post.id &&
                    !relatedPosts.find((rp) => rp.id === p.id)
                ).slice(0, 3 - relatedPosts.length);
                relatedPosts.push(...otherPosts);
              }

              return relatedPosts.map((recommendedPost) => (
                <article
                  key={recommendedPost.id}
                  className="group cursor-pointer"
                  onClick={() => handleRecommendationClick(recommendedPost)}
                >
                  {recommendedPost.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={recommendedPost.image}
                        alt={recommendedPost.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {recommendedPost.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {recommendedPost.title}
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                    {recommendedPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{recommendedPost.author}</span>
                    <span>{recommendedPost.readTime}</span>
                  </div>
                </article>
              ));
            })()}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/starlitblogs")}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              View all articles
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <Heart size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Start Your Journaling Journey
            </h3>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Join thousands of writers discovering the power of daily
              reflection. Transform your thoughts into clarity, one entry at a
              time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openSignupModal}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Get Started Free
              </button>
              <button
                onClick={openLoginModal}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Auth Modals */}
      {modals}
    </div>
  );
};

export default BlogPage;
