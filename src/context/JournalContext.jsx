// context/JournalContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getWithExpiry } from "../utils/anonymousName";

const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const [journalEntries, setJournalEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = getWithExpiry("user");
        console.log("JournalContext - storedUser:", storedUser);
        
        if (!storedUser) {
          console.log("JournalContext - No user found in localStorage");
          setLoading(false);
          return;
        }
        
        if (!storedUser._id) {
          console.log("JournalContext - User found but no _id:", storedUser);
          setError("Invalid user data. Please log in again.");
          setLoading(false);
          return;
        }
        
        setUser(storedUser);
        const response = await API.get(`/journals/${storedUser._id}`);
        setJournalEntries(response.data.journals || []);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        setError("Failed to load journal entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Re-fetch journals when user logs in
    const handleUserLoggedIn = () => {
      fetchData();
    };
    // Clear data when user logs out
    const handleUserLoggedOut = () => {
      setUser(null);
      setJournalEntries([]);
      setError(null);
    };
    window.addEventListener("user-logged-in", handleUserLoggedIn);
    window.addEventListener("user-logged-out", handleUserLoggedOut);
    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
      window.removeEventListener("user-logged-out", handleUserLoggedOut);
    };
  }, []);

  return (
    <JournalContext.Provider
      value={{ journalEntries, setJournalEntries, user, loading, error }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournals = () => useContext(JournalContext);
