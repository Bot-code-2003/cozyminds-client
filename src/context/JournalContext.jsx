// context/JournalContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
        const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
        if (!storedUser) return;
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
