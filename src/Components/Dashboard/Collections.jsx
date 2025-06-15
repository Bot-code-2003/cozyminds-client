"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FolderOpen, Plus, Calendar, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { useJournals } from "../../context/JournalContext";
import Navbar from "./Navbar";
import { getCardClass } from "./ThemeDetails";

const Collections = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode } = useDarkMode();
  const {
    journalEntries,
    user,
    loading: isLoading,
    error,
    setError,
    setJournalEntries,
  } = useJournals();
  const [collections, setCollections] = useState(["All"]);
  const [userData, setUserData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Load user data and collections
  useEffect(() => {
    setUserData(user);
    const uniqueCollections = ["All"];
    journalEntries.forEach((journal) => {
      if (journal.collections && Array.isArray(journal.collections)) {
        journal.collections.forEach((collection) => {
          if (collection !== "All" && !uniqueCollections.includes(collection)) {
            uniqueCollections.push(collection);
          }
        });
      }
    });
    setCollections(uniqueCollections);
  }, [user, journalEntries, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleCollectionSelect = (collection) => {
    navigate(`/journal-entries/${encodeURIComponent(collection)}`);
  };

  const countEntriesInCollection = (collection) => {
    if (collection === "All") return journalEntries.length;
    return journalEntries.filter(
      (entry) =>
        entry.collections &&
        Array.isArray(entry.collections) &&
        entry.collections.includes(collection)
    ).length;
  };

  // Get entries for a collection
  const getCollectionEntries = (collection) => {
    return collection === "All"
      ? journalEntries
      : journalEntries.filter(
          (entry) =>
            entry.collections &&
            Array.isArray(entry.collections) &&
            entry.collections.includes(collection)
        );
  };

  // Extract first image from content
  const getFirstImageFromContent = (content) => {
    if (!content) return null;
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const img = tempDiv.querySelector("img");
      return img ? img.src : null;
    } catch (error) {
      return null;
    }
  };

  // Get images or themes for a collection (up to 4)
  const getCollectionImages = (collection) => {
    const entries = getCollectionEntries(collection);
    const images = [];

    // Try to find images or themes in entries
    for (const entry of entries) {
      if (images.length >= 4) break;
      const imageUrl = getFirstImageFromContent(entry.content);
      if (imageUrl && !images.includes(imageUrl)) {
        images.push({ type: "image", value: imageUrl });
      } else if (
        entry.theme &&
        !images.find((img) => img.value === entry.theme)
      ) {
        images.push({ type: "theme", value: entry.theme });
      }
    }

    return images;
  };

  // Get up to 4 unique themes for a collection
  const getCollectionThemes = (collection) => {
    const entries = getCollectionEntries(collection);

    // Get unique themes
    const themesSet = new Set(
      entries.filter((entry) => entry.theme).map((entry) => entry.theme)
    );
    let themes = Array.from(themesSet).slice(0, 4);

    // If no themes, use default
    if (themes.length === 0) {
      themes = ["default"];
    }

    return themes;
  };

  // Get dynamic grid classes based on number of items
  const getGridClasses = (itemCount) => {
    switch (itemCount) {
      case 1:
        return "grid-cols-1 grid-rows-1";
      case 2:
        return "grid-cols-2 grid-rows-1";
      case 3:
        return "grid grid-cols-2 grid-rows-2";
      case 4:
        return "grid-cols-2 grid-rows-2";
      default:
        return "grid-cols-1 grid-rows-1";
    }
  };

  const handleDeleteClick = (e, collection) => {
    e.stopPropagation();
    if (collection === "All") return;
    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCollectionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!collectionToDelete || collectionToDelete === "All") return;
    setIsDeleting(true);
    try {
      await API.delete(
        `/collection/${userData._id}/${encodeURIComponent(collectionToDelete)}`
      );
      setCollections(collections.filter((c) => c !== collectionToDelete));
      const response = await API.get(`/journals/${userData._id}`);
      setJournalEntries(response.data.journals || []);
      setShowDeleteModal(false);
      setCollectionToDelete(null);
    } catch (err) {
      console.error("Error deleting collection:", err);
      setError(`Failed to delete collection: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)]`}>
      <Navbar
        userData={userData}
        handleLogout={handleLogout}
        name="New Entry"
        link="/journaling-alt"
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Your Journal Collections
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Discover and manage your journal memories
          </p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4] overflow-hidden"
              >
                <div className="grid grid-cols-2 grid-rows-2 h-3/4">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="bg-gray-300 dark:bg-gray-600 w-full h-full"
                    ></div>
                  ))}
                </div>
                <div className="h-1/4 bg-gray-300 dark:bg-gray-600 p-4"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Error
            </p>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <section>
            <h2 className="text-xl font-semibold mb-6">Your Collections</h2>
            <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collections.map((collection) => {
                const items = getCollectionImages(collection);
                const gridClasses = getGridClasses(items.length || 1);
                const hasItems = items.length > 0;
                const themes = getCollectionThemes(collection);

                return (
                  <div
                    key={collection}
                    onClick={() => handleCollectionSelect(collection)}
                    className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg aspect-[3/4] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCollectionSelect(collection)
                    }
                  >
                    <div
                      className={`grid h-3/4 ${
                        hasItems ? gridClasses : "grid-cols-1 grid-rows-1"
                      }`}
                    >
                      {hasItems
                        ? items.map((item, i) => (
                            <div
                              key={`${collection}-${item.type}-${i}`}
                              className={`w-full h-full ${
                                item.type === "theme"
                                  ? getCardClass(item.value)
                                  : `bg-cover bg-center ${
                                      items.length === 3 && i === 0
                                        ? "col-span-2"
                                        : ""
                                    }`
                              }`}
                              style={
                                item.type === "image"
                                  ? { backgroundImage: `url(${item.value})` }
                                  : {}
                              }
                              aria-label={`${
                                item.type === "image" ? "Image" : "Theme"
                              } preview ${i + 1} for ${collection}`}
                            >
                              {item.type === "theme" &&
                                item.value === "default" && (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                    <FolderOpen
                                      size={24}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  </div>
                                )}
                            </div>
                          ))
                        : themes.map((theme, i) => (
                            <div
                              key={`${collection}-theme-${i}`}
                              className={`w-full h-full ${getCardClass(
                                theme
                              )} ${
                                themes.length === 3 && i === 0
                                  ? "col-span-2"
                                  : ""
                              }`}
                              aria-label={`Theme preview ${
                                i + 1
                              } for ${collection}`}
                            >
                              {theme === "default" && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                  <FolderOpen
                                    size={24}
                                    className="text-gray-400 dark:text-gray-500"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                    </div>
                    <div className="h-1/4 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-medium truncate">
                        {collection}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {collection !== "All" && (
                          <button
                            onClick={(e) => handleDeleteClick(e, collection)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title={`Delete ${collection} collection`}
                            aria-label={`Delete ${collection} collection`}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {countEntriesInCollection(collection)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                to="/journaling-alt"
                className="flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg aspect-[3/4] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Create new collection"
              >
                <div className="text-center">
                  <Plus size={32} className="text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">New Collection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start a new journal entry
                  </p>
                </div>
              </Link>
            </div>
          </section>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl animate-fade-in">
              <h3 className="text-xl font-bold mb-4">Delete Collection</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete the "
                <span className="font-semibold">{collectionToDelete}</span>"
                collection? This will remove it from all journal entries, but
                the entries will remain.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  disabled={isDeleting}
                  aria-label={
                    isDeleting
                      ? "Deleting collection"
                      : "Confirm delete collection"
                  }
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <Link
          to="/journaling-alt"
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300"
          aria-label="Create new journal entry"
        >
          <Calendar size={24} />
        </Link>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Collections;
