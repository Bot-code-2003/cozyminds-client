"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../../context/CoinContext.jsx";
import { useDarkMode } from "../../../context/ThemeContext.jsx";

import Navbar from "../Navbar.jsx";
import {
  ShoppingCart,
  Package,
  Sparkles,
  Star,
  Tag,
  BookOpen,
  Mail,
} from "lucide-react";
import ShopItem from "./ShopItem.jsx";
import ShopInventory from "./ShopInventory";
import ConceptPackItem from "./ConceptPackItem.jsx";

import { shopItems } from "./ShopItems.js";

const CozyShop = () => {
  const navigate = useNavigate();
  const {
    coins,
    inventory,
    purchaseItem,
    syncCoinsFromStorage,
    userData,
    updateUserData,
  } = useCoins();

  const { darkMode } = useDarkMode();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("shop");
  const [animateCoins, setAnimateCoins] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMailTheme, setActiveMailTheme] = useState(null);
  const [previewMailTheme, setPreviewMailTheme] = useState(null);

  // Sync coins when component mounts
  useEffect(() => {
    console.log("Inventory:", inventory);
    syncCoinsFromStorage();
    if (userData && userData.activeMailTheme) {
      setActiveMailTheme(userData.activeMailTheme);
    }
  }, []);

  // Add a function to check if an item is a one-time purchase
  const isOneTimePurchase = (category) => {
    // Items like themes, badges, concept packs, and mail themes should only be purchased once
    return ["theme", "badge", "conceptpack", "mailtheme"].includes(category);
  };

  // Replace the isItemSoldOut function in your CozyShop component with this:

  const isItemSoldOut = (item) => {
    // For concept packs, check if any items in inventory have this pack as parent
    if (item.category === "conceptpack") {
      return inventory.some((invItem) => invItem.parentPack === item.id);
    }

    // For other one-time purchase items, check if the user already owns it
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

  const handlePreviewMailTheme = (theme) => {
    setPreviewMailTheme(theme);
  };

  const closePreview = () => {
    setPreviewMailTheme(null);
  };

  const activateMailTheme = async (themeId) => {
    try {
      // Update user's active mail theme
      if (userData) {
        console.log("Activating mail theme:", themeId);

        const updatedUser = { ...userData, activeMailTheme: themeId };

        // Update in context
        updateUserData(updatedUser);

        // Update state
        setActiveMailTheme(themeId);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error activating mail theme:", error);
      return false;
    }
  };

  // Filter out items that are already in inventory for one-time purchases
  const filteredShopItems = shopItems.filter((item) => {
    if (isOneTimePurchase(item.category)) {
      return !isItemSoldOut(item);
    }
    return true;
  });

  const filteredItems =
    activeCategory === "all"
      ? filteredShopItems
      : activeCategory === "exclusive"
      ? filteredShopItems.filter((item) => item.featured === "Exclusive")
      : activeCategory === "solid"
      ? filteredShopItems.filter((item) => item.id.includes("solid"))
      : activeCategory === "conceptpack"
      ? filteredShopItems.filter((item) => item.category === "conceptpack")
      : activeCategory === "mailtheme"
      ? filteredShopItems.filter((item) => item.category === "mailtheme")
      : filteredShopItems.filter(
          (item) =>
            !item.featured &&
            !item.id.includes("solid") &&
            item.category !== "conceptpack" &&
            item.category !== "mailtheme"
        );

  if (!userData) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex text-center flex-col md:flex-row justify-center items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Cozy <span className="text-[var(--accent)]">Shop</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Enhance your journaling experience with unique items
            </p>
          </div>
          {/* <div
            className={`flex items-center px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-sm transition-all ${
              animateCoins ? "scale-110" : ""
            }`}
          >
            <span className="text-yellow-300 mr-2 text-2xl">🪙</span>
            <span className="text-[var(--text-primary)] text-xl font-medium">
              {coins}
            </span>
          </div> */}
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
          <>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "all"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveCategory("exclusive")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "exclusive"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                <Star className="inline mr-1" size={14} />
                Exclusive
              </button>
              <button
                onClick={() => setActiveCategory("solid")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "solid"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                <Tag className="inline mr-1" size={14} />
                Solid
              </button>
              <button
                onClick={() => setActiveCategory("conceptpack")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "conceptpack"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                <BookOpen className="inline mr-1" size={14} />
                Concept Packs
              </button>
              <button
                onClick={() => setActiveCategory("mailtheme")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "mailtheme"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                <Mail className="inline mr-1" size={14} />
                Mail Themes
              </button>
              <button
                onClick={() => setActiveCategory("regular")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeCategory === "regular"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                Regular
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) =>
                item.category === "conceptpack" ? (
                  <ConceptPackItem
                    key={item.id}
                    item={item}
                    isItemSoldOut={isItemSoldOut}
                    handlePurchase={handlePurchase}
                    coins={coins}
                  />
                ) : (
                  <ShopItem
                    key={item.id}
                    item={item}
                    isItemSoldOut={isItemSoldOut}
                    handlePurchase={handlePurchase}
                    coins={coins}
                    isOneTimePurchase={isOneTimePurchase}
                    getInventoryItemCount={getInventoryItemCount}
                    handlePreviewMailTheme={handlePreviewMailTheme}
                  />
                )
              )}
            </div>
          </>
        )}

        {/* Inventory */}
        {activeTab === "inventory" && (
          <ShopInventory
            inventory={inventory}
            setActiveTab={setActiveTab}
            isOneTimePurchase={isOneTimePurchase}
            activateMailTheme={activateMailTheme}
          />
        )}

        {/* Mail Theme Preview Modal */}
        {previewMailTheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-primary)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-[var(--border)]">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {previewMailTheme.name} Preview
                </h3>
              </div>
              <div className="p-6">
                <div
                  className={`border rounded-lg p-6 ${
                    previewMailTheme.previewClass || ""
                  }`}
                  style={previewMailTheme.styles || {}}
                >
                  <div className="mb-4 pb-4 border-b border-[var(--border)]">
                    <div className="font-medium text-[var(--text-primary)]">
                      From: {previewMailTheme.senderPrefix || "Cozy Minds Team"}
                    </div>
                    <div className="font-bold text-xl mt-2 text-[var(--text-primary)]">
                      Your Weekly Journaling Insights
                    </div>
                  </div>
                  <div
                    className="prose text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{
                      __html:
                        previewMailTheme.previewContent ||
                        '<p>Your Weekly Summary ✨</p><p>Entries this week: 5</p><p>Most frequent mood: Happy</p><p>You journal in the: evening</p><p>Prompt for this week: "What made you smile this week?"</p><p>Keep reflecting,</p><p>Cozy Minds Team</p>',
                    }}
                  />
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)] flex justify-end gap-2">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CozyShop;
