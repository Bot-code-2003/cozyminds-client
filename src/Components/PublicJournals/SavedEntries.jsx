"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import PublicJournalCard, { PublicJournalCardSkeleton } from "./PublicJournalCard";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import Navbar from "../Dashboard/Navbar";
import LandingNavbar from "../Landing/Navbar";
import AuthModals from "../Landing/AuthModals";
import { useDarkMode } from "../../context/ThemeContext";

const SavedEntries = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  }, []);

  const isLoggedIn = !!user;

  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  const fetchSaved = useCallback(
    async (pageNum = 1) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const API = await import("axios").then((m) =>
          m.default.create({ baseURL: import.meta.env.VITE_API_URL })
        );
        const res = await API.get(`/users/${user._id}/saved-journals?page=${pageNum}`);
        const newJournals = res.data.journals || [];
        if (pageNum === 1) {
          setJournals(newJournals);
        } else {
          setJournals((prev) => [...prev, ...newJournals]);
        }
        setHasMore(res.data.hasMore && newJournals.length > 0);
      } catch (err) {
        setError("Failed to load saved journals");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const handleSave = useCallback(
    async (journalId, shouldSave, setIsSaved) => {
      if (!user) return;
      try {
        const API = await import("axios").then((m) =>
          m.default.create({ baseURL: import.meta.env.VITE_API_URL })
        );
        if (shouldSave) {
          await API.post(`/users/${user._id}/save-journal`, { journalId });
          setIsSaved(true);
        } else {
          await API.post(`/users/${user._id}/unsave-journal`, { journalId });
          setIsSaved(false);
          setJournals((prev) => prev.filter((j) => j._id !== journalId));
        }
      } catch (err) {
        console.error("Error saving/unsaving journal:", err);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchSaved(1);
  }, [fetchSaved]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSaved(nextPage);
  };

  if (!user) {
    return (
      <>
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-apple shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
            <p className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
              Please log in to view your saved journals.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 transition-colors min-h-12 active:scale-95"
              aria-label="Go to home page"
            >
              Go Home
            </button>
          </div>
        </div>
        {modals}
      </>
    );
  }

  return (
    <>
      <Navbar name="New Entry" link="/journaling-alt" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[var(--bg-primary)]">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-gray-100">
          Saved Journals
        </h1>
        {loading && journals.length === 0 ? (
          <div className="max-w-2xl mx-auto px-4 py-12">
            {[...Array(4)].map((_, i) => (
              <PublicJournalCardSkeleton key={i} />
            ))}
          </div>
        ) : !loading && journals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-apple flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
              <span className="text-4xl sm:text-6xl">🍏</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Saved Entries
            </h2>
            <p className="text-sm sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-4 text-center max-w-md">
              You haven't saved any journals yet. When you save journals, they'll appear here for easy access—just like your favorite notes on an Apple device!
            </p>
            <button
              onClick={() => navigate("/public-journals")}
              className="px-6 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 font-medium shadow-md min-h-12 active:scale-95"
              aria-label="Discover public journals"
            >
              Discover Journals
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1  gap-4 sm:gap-6 mb-6 sm:mb-8">
              {journals.map((journal) => (
                <div key={journal._id} className="min-h-12">
                  <PublicJournalCard
                    journal={journal}
                    isSaved={true}
                    onSave={handleSave}
                  />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 font-medium shadow-md min-h-12 active:scale-95 flex items-center gap-2"
                  disabled={loading}
                  aria-label="Load more saved journals"
                >
                  {loading && (
                    <Loader2 className="w-5 h-5 animate-spin inline-block" />
                  )}
                  Load More
                </button>
              </div>
            )}
          </>
        )}
        {error && (
          <div className="text-center mt-6 p-4 bg-white dark:bg-slate-800 rounded-apple shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
            <button
              onClick={() => fetchSaved(1)}
              className="px-6 py-2 bg-blue-500 text-white rounded-apple hover:bg-blue-600 transition-colors min-h-12 active:scale-95"
              aria-label="Retry loading saved journals"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Write FAB (Mobile) */}
        {isLoggedIn && (
          <Link
            to="/journaling-alt"
            className="sm:hidden fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
            aria-label="Write a new journal"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">Write</span>
          </Link>
        )}
      </div>
      {modals}
    </>
  );
};

export default SavedEntries;