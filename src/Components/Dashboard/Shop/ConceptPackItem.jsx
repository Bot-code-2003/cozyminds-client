"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

const ConceptPackItem = ({ item, isItemSoldOut, handlePurchase, coins }) => {
  const [showModal, setShowModal] = useState(false);
  const soldOut = isItemSoldOut(item); // Fix: Call isItemSoldOut with item

  return (
    <>
      <div
        className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative group h-60 flex flex-col cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Background Images Grid - Full Coverage */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          <div className="relative overflow-hidden">
            <img
              src={item.conceptImages?.[0]?.image || "/api/placeholder/400/300"}
              alt="Background 1"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src={item.conceptImages?.[1]?.image || "/api/placeholder/400/300"}
              alt="Background 2"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src={item.conceptImages?.[2]?.image || "/api/placeholder/400/300"}
              alt="Background 3"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          </div>
        </div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
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

        {/* Content Area - Positioned at bottom with z-index above background */}
        <div className="mt-auto p-4 flex flex-col items-center text-center z-20">
          <h3 className="text-xl font-semibold text-white mb-1 drop-shadow-lg">
            {item.name}
          </h3>
          <p className="text-white text-sm opacity-90 drop-shadow-md line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex items-center">
            <span className="text-yellow-300 mr-1">🪙</span>
            <span className="text-white font-medium drop-shadow-md">
              {item.price}
            </span>
          </div>
        </div>
      </div>

      {/* Concept Pack Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {item.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Story */}
              <div className="mb-8 p-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  The Story
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {item.story.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {item.conceptImages &&
                  item.conceptImages.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      <img
                        src={image.image || "/api/placeholder/400/300"}
                        alt={`${item.name} concept ${index + 1}`}
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

              {/* Purchase Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-1 text-xl">🪙</span>
                  <span className="text-[var(--text-primary)] font-medium text-xl">
                    {item.price}
                  </span>
                </div>
                {soldOut ? (
                  <span className="px-6 py-3 rounded-md bg-gray-500 text-white bg-opacity-70">
                    Owned
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      handlePurchase(item);
                      setShowModal(false);
                    }}
                    disabled={coins < item.price}
                    className={`px-6 py-3 rounded-md transition-all ${
                      coins >= item.price
                        ? "bg-[var(--accent)] cursor-pointer text-white hover:bg-opacity-90 hover:shadow-md"
                        : "bg-gray-500 text-white bg-opacity-70 cursor-not-allowed"
                    }`}
                  >
                    Purchase Concept Pack
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConceptPackItem;
