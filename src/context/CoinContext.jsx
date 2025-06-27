"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getWithExpiry, setWithExpiry } from "../utils/anonymousName";

// Configure Axios with base URL
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [activeMailTheme, setActiveMailTheme] = useState(null);

  // Function to sync user data from session storage
  const syncUserData = () => {
    const user = getWithExpiry("user");
    if (user) {
      setUserData(user);
      setCoins(user.coins || 0);
      setInventory(user.inventory || []);
      setActiveMailTheme(user.activeMailTheme || null);
      return user;
    }
    return null;
  };

  // Initialize user data
  useEffect(() => {
    syncUserData();
    setIsInitialized(true);
  }, []);

  // Add a listener for storage events to sync coins across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      syncUserData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add a listener for login events
  useEffect(() => {
    const handleLoginEvent = (event) => {
      // Access the coinsEarned from the event detail
      const { user, coinsEarned } = event.detail;

      syncUserData();

      // Show coin popup if coins were earned during login
      if (coinsEarned && coinsEarned > 0) {
        setCoinsEarned(coinsEarned);
        setShowCoinPopup(true);

        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowCoinPopup(false);
        }, 3000);
      }
    };

    window.addEventListener("user-logged-in", handleLoginEvent);

    // Listen for signup event as well
    window.addEventListener("user-signed-up", handleLoginEvent);

    // Listen for logout event
    const handleLogoutEvent = () => {
      setUserData(null);
      setCoins(0);
      setInventory([]);
      setActiveMailTheme(null);
    };
    window.addEventListener("user-logged-out", handleLogoutEvent);

    return () => {
      window.removeEventListener("user-logged-in", handleLoginEvent);
      window.removeEventListener("user-signed-up", handleLoginEvent);
      window.removeEventListener("user-logged-out", handleLogoutEvent);
    };
  }, []);

  const updateUserCoins = async (userId, coinsToAdd) => {
    try {
      const user = getWithExpiry("user");
      if (!user) return;

      const newCoins = (user.coins || 0) + coinsToAdd;

      const response = await API.put(`/user/${userId}`, {
        coins: newCoins,
        lastVisited: new Date(),
      });

      setCoins(newCoins);
      const updatedUser = { ...user, coins: newCoins, lastVisited: new Date() };
      setWithExpiry("user", updatedUser, 2 * 60 * 60 * 1000);

      // Show popup for manually awarded coins too
      if (coinsToAdd > 0) {
        setCoinsEarned(coinsToAdd);
        setShowCoinPopup(true);

        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowCoinPopup(false);
        }, 3000);
      }

      return newCoins;
    } catch (error) {
      console.error("Error updating coins:", error);
      return null;
    }
  };

  const purchaseItem = async (item) => {
    try {
      // Validate coins
      if (coins < item.price) {
        return { success: false, message: "Not enough coins" };
      }

      // Fetch user from sessionStorage
      let user = getWithExpiry("user");
      if (!user) {
        return { success: false, message: "User not logged in" };
      }

      const newCoins = coins - item.price;
      const newInventory = [...inventory];

      // 🧩 Handle concept pack
      if (
        item.category === "conceptpack" &&
        Array.isArray(item.conceptImages) &&
        item.conceptImages.length > 0
      ) {
        // Add each concept image as a separate inventory item
        item.conceptImages.forEach((img) => {
          newInventory.push({
            id: img.id,
            name: img.name,
            description: img.description,
            image: img.image || "/api/placeholder/400/300",
            category: "conceptpack",
            quantity: 1,
            isEmoji: false,
            parentPack: img.parentPack,
          });
        });
      } else if (item.category === "mailtheme") {
        // Add mail theme
        newInventory.push({
          ...item,
          quantity: 1,
          isEmoji: item.isEmoji ?? false,
        });

        // Set as active mail theme if none is set
        if (!user.activeMailTheme && !activeMailTheme) {
          user.activeMailTheme = item.id;
        }
      } else if (item.category === "story") {
        // Handle story purchase - initialize story progress
        const storyName = item.name;
        const storyProgress = {
          storyName: storyName,
          currentChapter: 1,
          lastSent: null,
          isComplete: false,
        };
        
        // Add story to inventory
        newInventory.push({
          ...item,
          quantity: 1,
          isEmoji: item.isEmoji ?? false,
        });

        // Update user with story progress
        user.storyProgress = storyProgress;
      } else {
        // 🪄 Regular item
        const existingItemIndex = newInventory.findIndex(
          (i) => i.id === item.id
        );
        if (existingItemIndex !== -1) {
          newInventory[existingItemIndex] = {
            ...newInventory[existingItemIndex],
            quantity: (newInventory[existingItemIndex].quantity || 1) + 1,
          };
        } else {
          newInventory.push({
            ...item,
            quantity: 1,
            isEmoji: item.isEmoji ?? false,
          });
        }
      }

      // 💾 Prepare updated user
      const updatedUser = {
        ...user,
        coins: newCoins,
        inventory: newInventory,
        activeMailTheme: user.activeMailTheme || activeMailTheme,
        storyProgress: user.storyProgress, // Include story progress if it was set
      };

      // Update backend
      const response = await API.put(`/user/${user._id}`, updatedUser);
      if (!response.data || response.status >= 400) {
        throw new Error("Failed to update user data on server");
      }

      // Update client state
      setCoins(newCoins);
      setInventory(newInventory);
      setUserData(updatedUser);
      setWithExpiry("user", updatedUser, 2 * 60 * 60 * 1000);

      return { success: true, message: `Successfully purchased ${item.name}!` };
    } catch (error) {
      console.error("Error purchasing item:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to purchase item";
      return { success: false, message };
    }
  };

  const syncCoinsFromStorage = () => {
    syncUserData();
  };

  const updateUserData = async (updatedUser) => {
    try {
      if (!updatedUser || !updatedUser._id) return false;

      // Update in API
      await API.put(`/user/${updatedUser._id}`, updatedUser);

      // Update in local storage with expiry
      setWithExpiry("user", updatedUser, 2 * 60 * 60 * 1000);

      // Update state
      setUserData(updatedUser);
      setCoins(updatedUser.coins || 0);
      setInventory(updatedUser.inventory || []);
      setActiveMailTheme(updatedUser.activeMailTheme || null);

      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  };

  // Function to manually trigger coin popup (for testing or other components)
  const showCoinAward = (amount) => {
    setCoinsEarned(amount);
    setShowCoinPopup(true);
    setTimeout(() => {
      setShowCoinPopup(false);
    }, 3000);
  };

  return (
    <CoinContext.Provider
      value={{
        coins,
        setCoins,
        inventory,
        setInventory,
        updateUserCoins,
        purchaseItem,
        syncCoinsFromStorage,
        isInitialized,
        showCoinPopup,
        coinsEarned,
        showCoinAward,
        userData,
        updateUserData,
        activeMailTheme,
      }}
    >
      {children}
      {/* Global coin popup that can be shown from anywhere */}

      {showCoinPopup && (
        <div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border border-yellow-400 text-yellow-800 px-6 py-3 rounded-xl shadow-xl flex items-center space-x-3 animate-fade-in"
          style={{
            zIndex: 99999,
          }}
        >
          <span className="text-2xl font-bold text-yellow-700">
            +{coinsEarned}
          </span>
          <span className="text-3xl">🪙</span>
          <span className="font-semibold text-sm opacity-80">
            Coins Earned!
          </span>
        </div>
      )}
    </CoinContext.Provider>
  );
};

export const useCoins = () => useContext(CoinContext);
