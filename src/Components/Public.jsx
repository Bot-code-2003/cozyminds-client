import React, { useState, useMemo } from "react";
import { useDarkMode } from "../context/ThemeContext";
import AuthModals from "./Landing/AuthModals";
import Navbar from "./Dashboard/Navbar";
import LandingNavbar from "./Landing/Navbar";
import PublicStories from "./PublicJournals/PublicStories";
import PublicJournals from "./PublicJournals/PublicJournals";
import { BookOpen, FileText } from 'lucide-react';

const getCurrentUser = () => {
  try {
    const itemStr = localStorage.getItem('user');
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (item && item.value) return item.value;
    return item;
  } catch {
    return null;
  }
};

const Public = () => {
  const [activeTab, setActiveTab] = useState("stories");
  const { darkMode, setDarkMode } = useDarkMode();
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const user = useMemo(() => getCurrentUser(), []);
  const isLoggedIn = !!user;

  return (
    <>
      {/* Navbar */}
      {isLoggedIn ? (
        <Navbar name="New Entry" link="/journaling-alt" />
      ) : (
        <LandingNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      {modals}

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-[999]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1 my-4">
              <button
                onClick={() => setActiveTab("stories")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "stories"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Stories
              </button>
              <button
                onClick={() => setActiveTab("journals")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "journals"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Journals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "stories" ? <PublicStories /> : <PublicJournals />}
    </>
  );
};

export default Public;