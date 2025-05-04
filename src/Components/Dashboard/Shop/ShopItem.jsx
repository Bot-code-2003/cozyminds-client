"use client";

import { Star } from "lucide-react";

const ShopItem = ({
  item,
  isItemSoldOut,
  handlePurchase,
  coins,
  isOneTimePurchase,
  getInventoryItemCount,
}) => {
  const soldOut = isItemSoldOut;

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
          {item.featured === "Exclusive" && <Star className="mr-1" size={10} />}
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

      {/* Pastel theme display */}
      {/* {!item.isEmoji && !item.image && item.color && renderPastelTheme()} */}

      {/* Content Area (over gradient for images, bottom for emojis) */}
      <div className="mt-auto p-6 flex flex-col items-center text-center z-10">
        <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">
          {item.name}
        </h3>
        <p className="text-white text-sm mb-4 opacity-90 drop-shadow-sm">
          {item.description}
        </p>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <span className="text-yellow-300 mr-1">🪙</span>
            <span className="text-white font-medium">{item.price}</span>
          </div>
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
              Buy
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
  );
};

export default ShopItem;
