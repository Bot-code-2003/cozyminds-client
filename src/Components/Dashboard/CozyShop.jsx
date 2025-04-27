"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../context/CoinContext";
import { useDarkMode } from "../../context/ThemeContext";

import Forest from "../../assets/forest.png";
import Ocean from "../../assets/water.png";
import Black from "../../assets/black-n.png";
import CalmOcean from "../../assets/calm-ocean-n.png";
import NightSky from "../../assets/night-sky-n.png";
import PastelSky from "../../assets/pastel-sky-n.png";
import EnergeticYellow from "../../assets/energetic-yellow-n.png";
import CozyRoom from "../../assets/cozy-room-e.png";
import CountrySide from "../../assets/country-side-e.png";
import MagicalRoom from "../../assets/magical-room-e.png";
import NothernLights from "../../assets/nothern-lights-e.png";
import PostApocalyptic from "../../assets/post-apocalyptic-e.png";
import SpaceObserve from "../../assets/space-observe-e.png";
import WinterCabin from "../../assets/winter-cabin-e.png";

import Navbar from "./Navbar";
import { ShoppingCart, Package, Sparkles, Star } from "lucide-react";

const CozyShop = () => {
  const navigate = useNavigate();
  const { coins, inventory, purchaseItem, syncCoinsFromStorage } = useCoins();
  const { darkMode } = useDarkMode();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("shop");
  const [animateCoins, setAnimateCoins] = useState(false);

  // Sync coins when component mounts
  useEffect(() => {
    syncCoinsFromStorage();
  }, []);

  // Shop items with an additional `isEmoji` flag
  const shopItems = [
    {
      id: "emoji_cozy_room",
      name: "Cozy Room",
      description: "Relax and unwind in a cozy room",
      price: 100,
      image: CozyRoom,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "emoji_country_side",
      name: "Country Side",
      description: "Immerse yourself in a picturesque country side",
      price: 100,
      image: CountrySide,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "emoji_magical_room",
      name: "Magical Room",
      description: "Enter a world of enchantment and magic",
      price: 100,
      image: MagicalRoom,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "emoji_nothern_lights",
      name: "Northern Lights",
      description: "Immerse yourself in the mesmerizing northern lights",
      price: 100,
      image: NothernLights,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "emoji_post_apocalyptic",
      name: "Post-Apocalyptic",
      description: "Enter a world of dystopia and apocalypse",
      price: 100,
      image: PostApocalyptic,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "theme_forest",
      name: "Forest Theme",
      description: "Transform your journal with serene forest visuals",
      price: 100,
      image: Forest,
      category: "theme",
      featured: "Exclusive",
      featuredStyle: "feature-card",
      isEmoji: false,
    },
    {
      id: "theme_ocean",
      name: "Ocean Theme",
      description: "Immerse yourself in tranquil ocean waves",
      price: 50,
      image: Ocean,
      category: "theme",
      isEmoji: false,
    },
    {
      id: "theme_black",
      name: "Black Theme",
      description: "Enter a world of darkness and intrigue",
      price: 50,
      image: Black,
      category: "theme",
      isEmoji: false,
    },
    {
      id: "theme_calm_ocean",
      name: "Calm Ocean Theme",
      description: "Relax and unwind in a serene coastal haven",
      price: 50,
      image: CalmOcean,
      category: "theme",
      isEmoji: false,
    },
    {
      id: "theme_night_sky",
      name: "Night Sky Theme",
      description: "Immerse yourself in a mesmerizing night sky",
      price: 50,
      image: NightSky,
      category: "theme",
      isEmoji: false,
    },
    {
      id: "theme_pastel_sky",
      name: "Pastel Sky Theme",
      description: "Experience a vibrant and colorful pastel sky",
      price: 50,
      image: PastelSky,
      category: "theme",
      isEmoji: false,
    },
    {
      id: "theme_energetic_yellow",
      name: "Energetic Yellow Theme",
      description: "Immerse yourself in a vibrant and energetic yellow theme",
      price: 50,
      image: EnergeticYellow,
      category: "theme",
      isEmoji: false,
    },
  ];

  // Add a function to check if an item is a one-time purchase
  const isOneTimePurchase = (category) => {
    // Items like themes and badges should only be purchased once
    return ["theme", "badge"].includes(category);
  };

  const isItemSoldOut = (item) => {
    // For one-time purchase items, check if the user already owns it
    if (isOneTimePurchase(item.category)) {
      return inventory.some((i) => i.id === item.id);
    }
    return false;
  };

  const handlePurchase = async (item) => {
    // Check if the item is already owned and is a one-time purchase
    if (isItemSoldOut(item)) {
      setNotification({
        type: "error",
        message: "You already own this item!",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;
    }

    // Animate coins before purchase
    setAnimateCoins(true);
    setTimeout(() => setAnimateCoins(false), 500);

    const result = await purchaseItem(item);

    if (result.success) {
      setNotification({
        type: "success",
        message: `Successfully purchased ${item.name}!`,
      });
    } else {
      setNotification({
        type: "error",
        message: result.message,
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getInventoryItemCount = (itemId) => {
    const item = inventory.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Cozy Shop
            </h1>
            <p className="text-[var(--text-secondary)]">
              Enhance your journaling experience with unique items
            </p>
          </div>
          <div
            className={`flex items-center px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-sm transition-all ${
              animateCoins ? "scale-110" : ""
            }`}
          >
            <span className="text-yellow-300 mr-2 text-2xl">🪙</span>
            <span className="text-[var(--text-primary)] text-xl font-medium">
              {coins}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mb-6">
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "shop"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            onClick={() => setActiveTab("shop")}
          >
            <ShoppingCart className="inline mr-2" size={16} />
            Shop
          </button>
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "inventory"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            <Package className="inline mr-2" size={16} />
            My Items
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-md shadow-md transition-all duration-300 ease-in-out ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border-l-4 border-red-500"
            }`}
          >
            {notification.type === "success" ? (
              <div className="flex items-center">
                <Sparkles className="mr-2" size={18} />
                {notification.message}
              </div>
            ) : (
              notification.message
            )}
          </div>
        )}

        {/* Shop Items */}
        {activeTab === "shop" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => {
              const soldOut = isItemSoldOut(item);

              return (
                <div
                  key={item.id}
                  className={`border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative group h-60 flex flex-col ${
                    item.featuredStyle || ""
                  }`}
                  style={
                    !item.isEmoji
                      ? {
                          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%), url(${item.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
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
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <span className="text-yellow-300 mr-1">🪙</span>
                        <span className="text-white font-medium">
                          {item.price}
                        </span>
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
                              ? "bg-[var(--accent)] text-white hover:bg-opacity-90 hover:shadow-md"
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
            })}
          </div>
        )}

        {/* Inventory */}
        {activeTab === "inventory" && (
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
                  Purchase items from the shop to customize your journaling
                  experience
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
                    Items you've purchased from the Cozy Shop
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
                        !item.isEmoji
                          ? {
                              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%), url(${item.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
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
        )}
      </div>
    </div>
  );
};

export default CozyShop;
