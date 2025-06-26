"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import Navbar from "../Dashboard/Navbar";
import JournalEditor from "./JournalEditor";
import ThemeSelector from "./ThemeSelector";
import { getThemeDetails } from "../Dashboard/ThemeDetails";
import SecondStep from "./SecondStep";
import PrivacySelection from "./PrivacySelection";
import { generateAnonymousName, getWithExpiry, setWithExpiry, logout } from "../../utils/anonymousName";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";

const JournalingAlt = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const { inventory } = useCoins();
  const navigate = useNavigate();

  // Journal content state
  const [journalText, setJournalText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Journal metadata state
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState(["All"]);
  const [selectedTheme, setSelectedTheme] = useState("theme_default");

  // Data state
  const [existingTags, setExistingTags] = useState([]);
  const [existingCollections, setExistingCollections] = useState(["All"]);
  const [availableThemes, setAvailableThemes] = useState([]);

  // Privacy state
  const [isPublic, setIsPublic] = useState(false);
  const [authorName, setAuthorName] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Fetch existing tags, collections, and set available themes from inventory
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userData = getWithExpiry("user");

        // console.log("User data:", userData.inventory);

        if (!userData || !userData._id) return;

        // Get available themes from user inventory
        const themes = userData.inventory
          .filter(
            (item) =>
              item.category === "theme" || item.category === "conceptpack"
          )
          .map((item) => ({
            id: item.id,
            name: item.name,
            icon: getThemeDetails(item.id).icon || item.image,
            description:
              getThemeDetails(item.id).readMoreText || item.description,
          }));

        setAvailableThemes(themes);

        // console.log("Available themes:", availableThemes);

        const response = await API.get(`/journals/${userData._id}`);
        const journals = response.data.journals || [];

        // Get unique tags
        const uniqueTags = [
          ...new Set(
            journals
              .flatMap((journal) => journal.tags || [])
              .map((tag) => tag.toUpperCase())
          ),
        ];
        setExistingTags(uniqueTags);

        // Get unique collections (always include "All")
        const uniqueCollections = ["All"];

        journals.forEach((journal) => {
          if (journal.collections && Array.isArray(journal.collections)) {
            journal.collections.forEach((collection) => {
              if (
                collection !== "All" &&
                !uniqueCollections.includes(collection)
              ) {
                uniqueCollections.push(collection);
              }
            });
          }
        });

        setExistingCollections(uniqueCollections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchExistingData();
  }, [inventory]);

  // console.log("Available themes:", availableThemes);

  // Update word count and reset isSaved
  useEffect(() => {
    
    const words = journalText.trim()
      ? journalText.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
    if (isSaved) setIsSaved(false); // Reset saved state on content change
  }, [journalText, journalTitle]);

  // Handle privacy selection
  const handlePrivacySelect = (privacy) => {
    setIsPublic(privacy === "public");
    if (privacy === "public") {
      const userData = getWithExpiry("user");
      if (userData && userData.nickname) {
        setAuthorName(userData.anonymousName);
      }
    } else {
      setAuthorName("");
    }
  };

  // Update handleSave to include privacy and author name
  const handleSave = async () => {
    if (!journalTitle.trim() || !journalText.trim()) {
      setSaveError("Please add a title and content.");
      return;
    }

    if (!selectedMood) {
      setSaveError("Please select a mood.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const userData = getWithExpiry("user");
      // console.log(userData._id);
      
      if (!userData || !userData._id) {
        setSaveError("User not found. Please log in.");
        setIsSaving(false);
        return;
      }
      const journalEntry = {
        userId: userData._id,
        title: journalTitle,
        mood: selectedMood,
        content: journalText,
        date: new Date(),
        wordCount,
        tags: selectedTags.map((tag) => tag.toUpperCase()),
        collections: selectedCollections,
        theme: selectedTheme,
        isPublic,
        authorName: isPublic ? authorName : null
      };
      await API.post("/saveJournal", journalEntry);
      setIsSaved(true);
      setTimeout(() => window.location.replace("/collections"), 1000);
    } catch (error) {
      setSaveError(error.response?.data?.message || "Failed to save journal.");
      setIsSaving(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1 && (!journalTitle.trim() || !journalText.trim())) {
      setSaveError("Please add a title and content before proceeding.");
      return;
    }

    if (currentStep === 2 && !selectedMood) {
      setSaveError("Please select a mood before proceeding.");
      return;
    }

    setSaveError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JournalEditor
            journalTitle={journalTitle}
            setJournalTitle={setJournalTitle}
            journalText={journalText}
            setJournalText={setJournalText}
            wordCount={wordCount}
          />
        );
      case 2:
        return (
          <SecondStep
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            existingTags={existingTags}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            existingCollections={existingCollections}
          />
        );
      case 3:
        return (
          <ThemeSelector
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            availableThemes={availableThemes}
          />
        );
      case 4:
        return (
          <PrivacySelection
            onSelect={handlePrivacySelect}
            initialValue={isPublic ? "public" : "private"}
          />
        );
      default:
        return null;
    }
  };

  // Navigation button logic
  const renderNavigation = () => {
    if (currentStep === 4) {
      return (
        <div className="flex w-full justify-between gap-4">
          <button
            onClick={goToPreviousStep}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      );
    }
    return (
      <div className="flex w-full justify-between gap-4">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={goToNextStep}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  // Show saveError for 2 seconds only
  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveError]);

  return (
    <div className="bg-[var(--bg-primary)]">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />
      <div className="max-w-5xl w-full mx-auto px-2 sm:px-0 flex flex-col">
        {renderCurrentStep()}
        {saveError && (
          <div className="absolute left-1/2 -translate-x-1/2 top-10 z-[1000] px-6 py-3 bg-red-100 text-red-700 rounded-lg shadow-lg transition-opacity duration-300 animate-fade-in-out">
            {saveError}
          </div>
        )}
      </div>
      {/* Sticky footer navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[var(--bg-primary)] border-t border-[var(--border)] z-50 py-4 px-2 sm:px-0">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
          {renderNavigation()}
        </div>
      </div>
    </div>
  );
};

export default JournalingAlt;
