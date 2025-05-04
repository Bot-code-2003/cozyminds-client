"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import Navbar from "../Dashboard/Navbar";
import JournalEditor from "./JournalEditor";
import MoodSelector from "./MoodSelector";
import ThemeSelector from "./ThemeSelector";
import TagsManager from "./TagsManager";
import CollectionsManager from "./CollectionsManager";
import StepIndicator from "./StepIndicator";
import { getThemeDetails } from "../Dashboard/ThemeDetails";

import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Data state
  const [existingTags, setExistingTags] = useState([]);
  const [existingCollections, setExistingCollections] = useState(["All"]);
  const [availableThemes, setAvailableThemes] = useState([]);

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
        if (!userData || !userData._id) return;

        // Get available themes from user inventory
        const themes = userData.inventory
          .filter((item) => item.category === "theme")
          .map((item) => ({
            id: item.id,
            name: getThemeDetails(item.id).icon
              ? item.id.replace("theme_", "")
              : item.name,
            icon: getThemeDetails(item.id).icon || item.image,
            description:
              getThemeDetails(item.id).readMoreText || item.description,
          }));

        setAvailableThemes(themes);

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

  // Update word count and reset isSaved
  useEffect(() => {
    const words = journalText.trim()
      ? journalText.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
    if (isSaved) setIsSaved(false); // Reset saved state on content change
  }, [journalText, journalTitle]);

  // Handle save
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
      };
      await API.post("/saveJournal", journalEntry);
      setIsSaved(true);
      setTimeout(() => navigate("/collections"), 1000);
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
    setCurrentStep((prev) => Math.min(prev + 1, 3));
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
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <div className="">
            <div>
              <MoodSelector
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            </div>
            <div className=" flex flex-col p-5 my-auto gap-5 bg-[var(--bg-secondary)]">
              <TagsManager
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                existingTags={existingTags}
              />

              <CollectionsManager
                selectedCollections={selectedCollections}
                setSelectedCollections={setSelectedCollections}
                existingCollections={existingCollections}
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={goToPreviousStep}
                className="px-4 py-2 border border-[var(--border)] bg-[var(--bg-primary)] rounded-md flex items-center text-sm hover:bg-[var(--bg-primary)]/80 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </button>
              <button
                onClick={goToNextStep}
                disabled={!selectedMood}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-md flex items-center text-sm hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <ThemeSelector
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              availableThemes={availableThemes}
              onBack={goToPreviousStep}
              onSave={handleSave}
              isSaving={isSaving}
              isSaved={isSaved}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      <Navbar handleLogout={handleLogout} name="New Journal" link={"/"} />

      <main className="max-w-[95%] mx-auto sm:px-4 py-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-l-4 border-red-500 rounded-md text-sm">
            {saveError}
          </div>
        )}

        <StepIndicator currentStep={currentStep} totalSteps={3} />

        <div className="mt-6">{renderCurrentStep()}</div>
      </main>
    </div>
  );
};

export default JournalingAlt;
