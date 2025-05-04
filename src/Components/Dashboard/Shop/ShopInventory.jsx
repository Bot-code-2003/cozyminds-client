"use client";

import { Package } from "lucide-react";

const ShopInventory = ({ inventory, setActiveTab, isOneTimePurchase }) => {
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
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative h-60 flex flex-col ${
                  item.featuredStyle || ""
                }`}
                style={
                  !item.isEmoji && item.image
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
                  {item.category}
                </div>
                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs px-2 py-1 rounded-full z-10">
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
                  {!isOneTimePurchase(item.category) && (
                    <div className="mt-2 px-3 py-1 bg-[var(--bg-primary)] bg-opacity-70 rounded-full text-sm text-white opacity-80">
                      Quantity: {item.quantity}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopInventory;
