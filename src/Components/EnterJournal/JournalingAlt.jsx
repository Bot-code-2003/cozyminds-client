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
import { generateAnonymousName } from "../../utils/anonymousName";

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
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  // Fetch existing tags, collections, and set available themes from inventory
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("user"));

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
      const userData = JSON.parse(sessionStorage.getItem("user"));
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
      const userData = JSON.parse(sessionStorage.getItem("user"));
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
          <div className="px-2 sm:px-4">
            <JournalEditor
              journalTitle={journalTitle}
              setJournalTitle={setJournalTitle}
              journalText={journalText}
              setJournalText={setJournalText}
              wordCount={wordCount}
              onNext={goToNextStep}
            />
          </div>
        );
      case 2:
        return (
          <div className="px-2 sm:px-4">
            <SecondStep
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              existingTags={existingTags}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              selectedCollections={selectedCollections}
              setSelectedCollections={setSelectedCollections}
              existingCollections={existingCollections}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </div>
        );
      case 3:
        return (
          <div className="px-2 sm:px-4">
            <ThemeSelector
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              availableThemes={availableThemes}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </div>
        );
      case 4:
        return (
          <div className="px-2 sm:px-4">
            <PrivacySelection
              onSelect={handlePrivacySelect}
              initialValue={isPublic ? "public" : "private"}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />
      <div className="mx-auto pb-12 px-2 sm:px-4">
        {renderCurrentStep()}
        {saveError && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {saveError}
          </div>
        )}
        {currentStep === 4 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? "Saving..." : "Save Journal"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalingAlt;
