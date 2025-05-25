"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const ShopItem = ({
  item,
  isItemSoldOut,
  handlePurchase,
  coins,
  isOneTimePurchase,
  getInventoryItemCount,
  handlePreviewMailTheme,
}) => {
  const soldOut = isItemSoldOut(item);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For pastel themes that don't have images
  const renderPastelTheme = () => {
    return (
      <div
        className="flex-grow flex items-center justify-center"
        style={{
          backgroundColor: item.color,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <div className=" w-full"></div>
      </div>
    );
  };

  return (
    <>
      <div
        key={item.id}
        className={`border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative group h-60 flex flex-col ${
          item.featuredStyle || ""
        }`}
        style={
          !item.isEmoji && item.image
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%), url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : item.gradient
            ? {
                backgroundImage: `${item.gradient}`,
              }
            : item.color
            ? {
                backgroundColor: item.color,
              }
            : {}
        }
      >
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full z-10">
          {item.category}
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

        {/* Emoji Display for isEmoji: true */}
        {item.isEmoji && (
          <div className="flex-grow flex items-center justify-center">
            <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
              {item.image}
            </span>
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
          <div className="flex justify-between items-center w-full gap-2">
            {item.category === "mailtheme" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="px-3 py-2 bg-white text-black bg-opacity-70 rounded-md text-sm hover:bg-opacity-90"
              >
                Preview
              </button>
            )}
            {soldOut ? (
              <span className="px-4 py-2 rounded-md bg-gray-500 text-white bg-opacity-70">
                Owned
              </span>
            ) : (
              <button
                onClick={() => handlePurchase(item)}
                disabled={coins < item.price}
                className={`px-4 py-2 rounded-md transition-all ${
                  coins >= item.price
                    ? "bg-[var(--accent)] cursor-pointer text-white hover:bg-opacity-90 hover:shadow-md"
                    : "bg-gray-500 text-white bg-opacity-70 cursor-not-allowed"
                }`}
              >
                🪙{item.price}
              </button>
            )}
          </div>

          {!soldOut &&
            !isOneTimePurchase(item.category) &&
            getInventoryItemCount(item.id) > 0 && (
              <div className="mt-2 text-sm text-white opacity-80">
                Owned: {getInventoryItemCount(item.id)}
              </div>
            )}
        </div>
      </div>

      {/* Modal for Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 max-w-3xl w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">
              {item.name} Preview
            </h2>
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: item.previewHtml }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShopItem;
