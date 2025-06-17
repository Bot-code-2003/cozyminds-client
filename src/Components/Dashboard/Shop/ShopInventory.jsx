"use client";

import { useState, useCallback } from "react";
import { X, Package, Mail, Crown, BookOpen, Tag, Scroll } from "lucide-react";
import { shopItems } from "./ShopItems";
import { getCardClass } from "../ThemeDetails";
import ShopItem from "./ShopItem";

const ShopInventory = ({
  inventory,
  setActiveTab,
  isOneTimePurchase,
  activateMailTheme,
}) => {
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [selectedConceptPack, setSelectedConceptPack] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Group concept pack items
  const groupedInventory = inventory.reduce((acc, item) => {
    if (item.category === "conceptpack" && item.parentPack) {
      const existingGroupIndex = acc.findIndex(
        (group) =>
          group.isConceptPackGroup && group.parentPackId === item.parentPack
      );

      if (existingGroupIndex >= 0) {
        acc[existingGroupIndex].items.push(item);
      } else {
        const parentPackName = item.description?.includes("part of")
          ? item.description.split("part of")[1]?.trim()
          : "Concept Pack";

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
          cardClass: `card-${item.parentPack}`,
        });
      }
    } else if (item.category === "mailtheme") {
      acc.push({
        ...item,
        isMailTheme: true,
      });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  // Filter items based on category
  const filteredInventory = (() => {
    if (activeCategory === "all") {
      return groupedInventory;
    }

    switch (activeCategory) {
      case "exclusive":
        return groupedInventory.filter((item) => item.featured === "Exclusive");
      case "conceptpack":
        return groupedInventory.filter(
          (item) => item.category === "conceptpack" || item.isConceptPackGroup
        );
      case "mailtheme":
        return groupedInventory.filter(
          (item) => item.category === "mailtheme" || item.isMailTheme
        );
      case "story":
        return groupedInventory.filter((item) => item.category === "story");
      case "regular":
        return groupedInventory.filter(
          (item) =>
            !item.featured &&
            item.category !== "conceptpack" &&
            item.category !== "mailtheme" &&
            item.category !== "story" &&
            !item.isConceptPackGroup &&
            !item.isMailTheme
        );
      default:
        return groupedInventory;
    }
  })();

  // Categories for filtering
  const categories = [
    { id: "all", name: "All", icon: <Package size={14} /> },
    { id: "exclusive", name: "Exclusive", icon: <Crown size={14} /> },
    { id: "conceptpack", name: "Concept Packs", icon: <BookOpen size={14} /> },
    { id: "mailtheme", name: "Mail Themes", icon: <Mail size={14} /> },
    { id: "story", name: "Stories", icon: <Scroll size={14} /> },
    { id: "regular", name: "Regular", icon: <Tag size={14} /> },
  ];

  const handleActivateMailTheme = useCallback(
    (theme) => {
      activateMailTheme(theme.id);
      alert(`${theme.name} has been activated! New mails will use this theme.`);
    },
    [activateMailTheme]
  );

  const openConceptModal = useCallback((conceptPack) => {
    const originalPack = shopItems.find(
      (item) => item.id === conceptPack.parentPackId
    );

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
  }, []);

  const closeConceptModal = useCallback(() => {
    setShowConceptModal(false);
    setSelectedConceptPack(null);
  }, []);

  // Handle keyboard navigation for modals
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeConceptModal();
      }
    },
    [closeConceptModal]
  );

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                  My Collection
                </h2>
                <p className="text-[var(--text-secondary)] text-sm">
                  Items you've purchased from the Starlit Shop
                </p>
              </div>

              {/* Compact Category Filter */}
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeCategory === category.id
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                isInventoryMode={true}
                onActivateMailTheme={handleActivateMailTheme}
                onOpenConceptModal={openConceptModal}
                isOneTimePurchase={isOneTimePurchase}
              />
            ))}
          </div>

          {/* Show message when no items match filter */}
          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No items in this category
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try selecting a different category or purchase more items from
                the shop.
              </p>
            </div>
          )}

          {/* Concept Pack Modal */}
          {showConceptModal && selectedConceptPack && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
              onClick={closeConceptModal}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="concept-modal-title"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="concept-modal-title"
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {selectedConceptPack.name}
                  </h2>
                  <button
                    onClick={closeConceptModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    aria-label="Close concept pack preview"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                {selectedConceptPack.story && (
                  <div className="mb-8 p-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                      The Story
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {(
                    selectedConceptPack.conceptImages ||
                    selectedConceptPack.items ||
                    []
                  ).map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-md bg-cover bg-center"
                      style={{
                        backgroundImage: image.image
                          ? `url(${image.image})`
                          : "none",
                      }}
                    >
                      <div className="w-full h-48">
                        {/* Fallback CSS styling if no image */}
                        {!image.image && (
                          <div
                            className={`w-full h-full ${
                              image.cardClass || getCardClass(image.id)
                            }`}
                          />
                        )}
                      </div>
                      <div className="p-4 bg-[var(--bg-primary)]">
                        <h3 className="font-medium text-[var(--text-primary)] mb-2 text-sm">
                          {image.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeConceptModal}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopInventory;
