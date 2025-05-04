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
  Percent,
} from "lucide-react";
import ShopDeals from "./ShopDeals.jsx";
import ShopItem from "./ShopItem.jsx";
import ShopInventory from "./ShopInventory";

import { shopItems } from "./ShopItems.js";

const CozyShop = () => {
  const navigate = useNavigate();
  const { coins, inventory, purchaseItem, syncCoinsFromStorage, userData } =
    useCoins();
  const { darkMode } = useDarkMode();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("shop");
  const [animateCoins, setAnimateCoins] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Sync coins when component mounts
  useEffect(() => {
    syncCoinsFromStorage();
  }, []);

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

  const filteredItems =
    activeCategory === "all"
      ? shopItems
      : activeCategory === "exclusive"
      ? shopItems.filter((item) => item.featured === "Exclusive")
      : activeCategory === "solid"
      ? shopItems.filter((item) => item.id.includes("solid"))
      : shopItems.filter(
          (item) => !item.featured && !item.id.includes("solid")
        );

  if (!userData) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8">
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
          {/* <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "deals"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            onClick={() => setActiveTab("deals")}
          >
            <Percent className="inline mr-2" size={16} />
            Deals
          </button> */}
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
                All Themes
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
                solid
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
              {filteredItems.map((item) => (
                <ShopItem
                  key={item.id}
                  item={item}
                  isItemSoldOut={isItemSoldOut(item)}
                  handlePurchase={handlePurchase}
                  coins={coins}
                  isOneTimePurchase={isOneTimePurchase}
                  getInventoryItemCount={getInventoryItemCount}
                />
              ))}
            </div>
          </>
        )}

        {/* Deals */}
        {/* {activeTab === "deals" && (
          <ShopDeals
            deals={shopDeals}
            shopItems={shopItems}
            inventory={inventory}
            coins={coins}
            handlePurchase={handlePurchase}
          />
        )} */}

        {/* Inventory */}
        {activeTab === "inventory" && (
          <ShopInventory
            inventory={inventory}
            setActiveTab={setActiveTab}
            isOneTimePurchase={isOneTimePurchase}
          />
        )}
      </div>
    </div>
  );
};

export default CozyShop;
