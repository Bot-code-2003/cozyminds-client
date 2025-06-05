"use client";

import { Star, Eye, X, Mail, BookOpen, Play } from "lucide-react";
import { useState, useCallback } from "react";

const ShopItem = ({
  item,
  isItemSoldOut,
  handlePurchase,
  coins,
  isOneTimePurchase,
  getInventoryItemCount,
  handlePreviewMailTheme,
  // New props for inventory mode
  isInventoryMode = false,
  onActivateMailTheme,
  onOpenConceptModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const soldOut = isItemSoldOut ? isItemSoldOut(item) : false;
  const canAfford = coins >= item.price;
  const inventoryCount = getInventoryItemCount
    ? getInventoryItemCount(item.id)
    : 0;
  const showInventoryCount =
    !soldOut && !isOneTimePurchase(item.category) && inventoryCount > 0;

  const openModal = useCallback((e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onPurchase = useCallback(() => {
    if (handlePurchase) {
      handlePurchase(item);
    }
  }, [handlePurchase, item]);

  // Handle keyboard navigation for modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  // Handle concept pack click in inventory mode
  const handleConceptPackClick = useCallback(() => {
    if (isInventoryMode && item.isConceptPackGroup && onOpenConceptModal) {
      onOpenConceptModal(item);
    }
  }, [isInventoryMode, item, onOpenConceptModal]);

  // Get appropriate icon for category
  const getCategoryIcon = () => {
    switch (item.category) {
      case "mailtheme":
        return <Mail size={40} className="text-white opacity-70" />;
      case "story":
        return <BookOpen size={40} className="text-white opacity-70" />;
      case "conceptpack":
        return <BookOpen size={40} className="text-white opacity-70" />;
      default:
        return null;
    }
  };

  // Get category display name
  const getCategoryName = () => {
    switch (item.category) {
      case "mailtheme":
        return "Mail Theme";
      case "story":
        return "Story";
      case "conceptpack":
        return "Concept Pack";
      default:
        return item.category;
    }
  };

  return (
    <>
      {/* Shop Item Card */}
      <article
        className={`
          relative group h-60 flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
          ${item.featuredStyle || ""} ${
          item.cardClass || `card-${item.id.replace("theme_", "")}`
        }
          ${
            item.isConceptPackGroup || item.category === "story"
              ? "cursor-pointer"
              : ""
          }
        `}
        onClick={handleConceptPackClick}
        role="button"
        tabIndex={0}
        aria-label={`${item.name} - ${item.price ? `${item.price} coins` : ""}`}
      >
        {/* Badges */}
        <div className="flex justify-between items-start z-10">
          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {item.featured === "Exclusive" && (
                <Star size={10} className="text-yellow-500" />
              )}
              {item.featured}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {getCategoryName()}
          </div>
        </div>

        {/* Concept Pack Group - Display grid of images (Inventory Mode) */}
        {isInventoryMode &&
          item.isConceptPackGroup &&
          item.items &&
          item.items.length > 0 && (
            <div className="absolute inset-0 grid grid-cols-3 gap-0">
              {item.items.slice(0, 3).map((conceptItem, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage: conceptItem.image
                      ? `url(${conceptItem.image})`
                      : "none",
                  }}
                >
                  {/* Fallback CSS class styling if no image */}
                  {!conceptItem.image && (
                    <div
                      className={`w-full h-full ${
                        conceptItem.cardClass || `card-${conceptItem.id}`
                      }`}
                    />
                  )}
                </div>
              ))}
              {Array.from({
                length: Math.max(0, 3 - (item.items?.length || 0)),
              }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="relative overflow-hidden bg-gray-800"
                />
              ))}
            </div>
          )}

        {/* Emoji Display */}
        {item.isEmoji && (
          <div className="flex-grow flex items-center justify-center">
            <span
              className="text-6xl transform group-hover:scale-110 transition-transform duration-300"
              role="img"
              aria-label={item.name}
            >
              {item.emoji || item.image}
            </span>
          </div>
        )}

        {/* Category Icons */}
        {!item.isEmoji && !item.isConceptPackGroup && (
          <div className="flex-grow flex items-center justify-center">
            {getCategoryIcon()}
          </div>
        )}

        {/* Content Area */}
        <div className="mt-auto p-4 flex flex-col items-center text-center z-10">
          <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md line-clamp-1">
            {item.name}
          </h3>
          <p className="text-white/90 text-sm mb-4 drop-shadow-sm line-clamp-2 leading-relaxed">
            {item.description || item.abstract}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center items-center w-full gap-2">
            {/* Preview Button for Mail Themes and Stories */}
            {(item.category === "mailtheme" || item.category === "story") && (
              <button
                onClick={openModal}
                className="flex items-center gap-1 px-3 py-2 bg-white/80 hover:bg-white/90 text-gray-900 text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm"
                aria-label={`Preview ${item.name}`}
              >
                <Eye size={14} />
                Preview
              </button>
            )}

            {/* Inventory Mode Actions */}
            {isInventoryMode ? (
              <>
                {/* Mail Theme Activation */}
                {item.isMailTheme && onActivateMailTheme && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onActivateMailTheme(item);
                    }}
                    className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500/90 text-white text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm"
                    aria-label={`Activate ${item.name}`}
                  >
                    Activate
                  </button>
                )}
              </>
            ) : (
              /* Shop Mode Purchase Button */
              <>
                {soldOut ? (
                  <div className="px-4 py-2 bg-green-500/80 text-white text-sm font-medium rounded-md backdrop-blur-sm">
                    ✓ Owned
                  </div>
                ) : (
                  <button
                    onClick={onPurchase}
                    disabled={!canAfford}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm
                      ${
                        canAfford
                          ? "bg-blue-500/80 hover:bg-blue-500/90 text-white cursor-pointer hover:shadow-md"
                          : "bg-gray-500/60 text-white/70 cursor-not-allowed"
                      }
                    `}
                    aria-label={`Purchase ${item.name} for ${item.price} coins`}
                  >
                    🪙 {item.price.toLocaleString()}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Inventory Count */}
          {showInventoryCount && (
            <div className="mt-2 text-xs text-white/80 font-medium">
              Owned: {inventoryCount}
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </article>

      {/* Preview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                {item.name} {item.category === "story" ? "" : "Preview"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Close preview"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {/* Mail Theme Preview */}
              {item.category === "mailtheme" && item.previewHtml ? (
                <div
                  className={item.cardClass || `card-${item.id}`}
                  dangerouslySetInnerHTML={{ __html: item.previewHtml }}
                />
              ) : /* Story Preview */ item.category === "story" ? (
                <div className="space-y-4">
                  {item.genre && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen size={16} />
                      <span>Genre: {item.genre}</span>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Story Abstract
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.abstract}
                    </p>
                  </div>
                  {!isInventoryMode && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        💌 Purchase to unlock Andy’s heartfelt sea adventures —
                        delivered daily to your Magical Messenger.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Preview not available for this item.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              {!isInventoryMode && !soldOut && (
                <button
                  onClick={() => {
                    onPurchase();
                    closeModal();
                  }}
                  disabled={!canAfford}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      canAfford
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Purchase for 🪙 {item.price.toLocaleString()}
                </button>
              )}
              {isInventoryMode && item.isMailTheme && onActivateMailTheme && (
                <button
                  onClick={() => {
                    onActivateMailTheme(item);
                    closeModal();
                  }}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopItem;
