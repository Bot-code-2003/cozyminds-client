"use client";

import { useState } from "react";
import { X, Star, Package, Mail } from "lucide-react";
import { shopItems } from "./ShopItems"; // Adjust the import path as needed

const ShopInventory = ({
  inventory,
  setActiveTab,
  isOneTimePurchase,
  activateMailTheme,
}) => {
  const [previewMailTheme, setPreviewMailTheme] = useState(null);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [selectedConceptPack, setSelectedConceptPack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group concept pack items
  const groupedInventory = inventory.reduce((acc, item) => {
    // If it's a concept pack item with a parentPack property
    if (item.category === "conceptpack" && item.parentPack) {
      // Find if we already have a group for this parent pack
      const existingGroupIndex = acc.findIndex(
        (group) =>
          group.isConceptPackGroup && group.parentPackId === item.parentPack
      );

      if (existingGroupIndex >= 0) {
        // Add this item to the existing group
        acc[existingGroupIndex].items.push(item);
      } else {
        // Create a new group for this parent pack
        const parentPackName = item.description?.includes("part of")
          ? item.description.split("part of")[1]?.trim()
          : "Concept Pack";

        // Find the original concept pack in the inventory if it exists
        const originalPack = inventory.find(
          (invItem) => invItem.id === item.parentPack
        );

        acc.push({
          id: `group-${item.parentPack}`,
          name: originalPack?.name || parentPackName,
          description:
            originalPack?.description || `Collection of concept images`,
          category: "conceptpack",
          isConceptPackGroup: true,
          parentPackId: item.parentPack,
          items: [item],
          story: originalPack?.story || "",
          featured: originalPack?.featured || null,
        });
      }
    } else if (item.category === "mailtheme") {
      // Add mail themes with an activate button
      acc.push({
        ...item,
        isMailTheme: true,
      });
    } else {
      // For all other items, just add them directly
      acc.push(item);
    }
    return acc;
  }, []);

  const handleActivateMailTheme = (theme) => {
    activateMailTheme(theme.id);
    alert(`${theme.name} has been activated! New mails will use this theme.`);
  };

  const handlePreviewMailTheme = (theme) => {
    setPreviewMailTheme(theme);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setPreviewMailTheme(null);
    setIsModalOpen(false);
  };

  const openConceptModal = (conceptPack) => {
    // Find the original concept pack in shopItems.js to get the full data
    const originalPack = shopItems.find(
      (item) => item.id === conceptPack.parentPackId
    );

    // If we found the original pack, use its data for the modal
    if (originalPack) {
      setSelectedConceptPack({
        ...conceptPack,
        conceptImages: originalPack.conceptImages || [],
        story: originalPack.story || conceptPack.story || "",
      });
    } else {
      setSelectedConceptPack(conceptPack);
    }

    setShowConceptModal(true);
  };

  const closeConceptModal = () => {
    setShowConceptModal(false);
    setSelectedConceptPack(null);
  };

  return (
    <div>
      {inventory.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
          <Package
            size={64}
            className="mx-auto text-[var(--text-secondary)] mb-4 opacity-50"
          />
          <h3 className="text-2xl font-medium text-[var(--text-primary)] mb-3">
            Your inventory is empty
          </h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Purchase items from the shop to customize your journaling experience
          </p>
          <button
            onClick={() => setActiveTab("shop")}
            className="px-6 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Browse Shop
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              My Collection
            </h2>
            <p className="text-[var(--text-secondary)]">
              Items you've purchased from the Cozy Shop <br /> Write a new entry
              to use these items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedInventory.map((item) => (
              <div
                key={item.id}
                className={`border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative h-60 flex flex-col ${
                  item.featuredStyle || ""
                } ${item.isConceptPackGroup ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (item.isConceptPackGroup) {
                    openConceptModal(item);
                  }
                }}
                style={
                  item.isConceptPackGroup
                    ? {
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : !item.isEmoji && item.image
                    ? {
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%), url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : item.color
                    ? { backgroundColor: item.color }
                    : {}
                }
              >
                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full z-10">
                  {item.isMailTheme ? "Mail Theme" : item.category}
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs px-2 py-1 rounded-full z-10 flex items-center">
                    {item.featured === "Exclusive" && (
                      <Star className="mr-1" size={10} />
                    )}
                    {item.featured}
                  </div>
                )}

                {/* Concept Pack Group - Display grid of images */}
                {item.isConceptPackGroup &&
                  item.items &&
                  item.items.length > 0 && (
                    <>
                      <div className="absolute inset-0 grid grid-cols-3 gap-0">
                        {item.items.slice(0, 3).map((conceptItem, index) => (
                          <div key={index} className="relative overflow-hidden">
                            <img
                              src={
                                conceptItem.image || "/api/placeholder/400/300"
                              }
                              alt={`Concept ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/400/300";
                              }}
                            />
                          </div>
                        ))}
                        {/* Fill remaining slots with placeholders if less than 3 items */}
                        {Array.from({
                          length: Math.max(0, 3 - (item.items?.length || 0)),
                        }).map((_, index) => (
                          <div
                            key={`placeholder-${index}`}
                            className="relative overflow-hidden bg-gray-800"
                          ></div>
                        ))}
                      </div>
                      {/* Dark Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </>
                  )}

                {/* Emoji Display for isEmoji: true */}
                {item.isEmoji && (
                  <div className="flex-grow flex items-center justify-center">
                    <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {item.image}
                    </span>
                  </div>
                )}

                {/* Mail Theme Icon */}
                {item.isMailTheme && (
                  <div className="flex-grow flex items-center justify-center">
                    <Mail size={64} className="text-white opacity-70" />
                  </div>
                )}

                {/* Content Area (over gradient for images, bottom for emojis) */}
                <div className="mt-auto p-6 flex flex-col items-center text-center z-10">
                  <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">
                    {item.name}
                  </h3>
                  <p className="text-white text-sm mb-4 opacity-90 drop-shadow-sm">
                    {item.description}
                  </p>

                  {/* For concept packs, show "Contains X items" */}
                  {/* {item.items && item.items.length > 0 && (
                    <div className="mt-2 px-3 py-1 bg-[var(--bg-primary)] bg-opacity-70 rounded-full text-sm dark:text-white text-black opacity-80">
                      Contains {item.items.length} items
                    </div>
                  )} */}

                  {/* For mail themes, show activate and preview buttons */}
                  {item.isMailTheme && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewMailTheme(item);
                        }}
                        className="px-3 py-1 bg-[var(--bg-primary)] bg-opacity-70 rounded-md text-sm dark:text-white hover:bg-opacity-90"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivateMailTheme(item);
                        }}
                        className="px-3 py-1 bg-[var(--accent)] rounded-md text-sm text-white hover:bg-opacity-90"
                      >
                        Activate
                      </button>
                    </div>
                  )}

                  {/* For quantity items */}
                  {!isOneTimePurchase(item.category) &&
                    !item.isConceptPackGroup && (
                      <div className="mt-2 px-3 py-1 bg-[var(--bg-primary)] bg-opacity-70 rounded-full text-sm text-white opacity-80">
                        Quantity: {item.quantity}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Concept Pack Modal */}
          {showConceptModal && selectedConceptPack && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-[var(--bg-secondary)] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                      {selectedConceptPack.name}
                    </h2>
                    <button
                      onClick={closeConceptModal}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Story */}
                  {selectedConceptPack.story && (
                    <div className="mb-8 p-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                        The Story
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {selectedConceptPack.story
                          .split("\n")
                          .map((line, idx) => (
                            <span key={idx}>
                              {line}
                              <br />
                            </span>
                          ))}
                      </p>
                    </div>
                  )}

                  {/* Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {selectedConceptPack.conceptImages
                      ? selectedConceptPack.conceptImages.map(
                          (image, index) => (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden shadow-md"
                            >
                              <img
                                src={image.image || "/api/placeholder/400/300"}
                                alt={`${selectedConceptPack.name} concept ${
                                  index + 1
                                }`}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/400/300";
                                }}
                              />
                              <div className="p-4 bg-[var(--bg-primary)]">
                                <h3 className="font-medium text-[var(--text-primary)] mb-2">
                                  {image.name}
                                </h3>
                              </div>
                            </div>
                          )
                        )
                      : selectedConceptPack.items &&
                        selectedConceptPack.items.map((image, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden shadow-md"
                          >
                            <img
                              src={image.image || "/api/placeholder/400/300"}
                              alt={`${selectedConceptPack.name} concept ${
                                index + 1
                              }`}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/400/300";
                              }}
                            />
                            <div className="p-4 bg-[var(--bg-primary)]">
                              <h3 className="font-medium text-[var(--text-primary)] mb-2">
                                {image.name}
                              </h3>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mail Theme Preview Modal */}
          {isModalOpen && previewMailTheme && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[var(--bg-secondary)] rounded-lg p-6 max-w-3xl w-full relative">
                <button
                  onClick={closePreview}
                  className="absolute top-2 right-2 text-black dark:text-white hover:text-gray-300"
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-semibold text-white mb-4">
                  {previewMailTheme.name} Preview
                </h2>
                <div
                  className="preview-content"
                  dangerouslySetInnerHTML={{
                    __html: previewMailTheme.previewHtml,
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopInventory;
