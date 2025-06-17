import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MailContext = createContext();

export const MailProvider = ({ children }) => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const [mails, setMails] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnreadMails, setHasUnreadMails] = useState(false); // Add hasUnreadMails state

  // Fetch mails and user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
        if (!storedUser) return;
        setUser(storedUser);
        const response = await API.get(`/mails/${storedUser._id}`);
        setMails(response.data.mails || []);
      } catch (err) {
        console.error("Error fetching mails:", err);
        setError("Failed to load mails.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update hasUnreadMails whenever mails change
  useEffect(() => {
    setHasUnreadMails(mails.some((mail) => !mail.read));
  }, [mails]);

  // Mark mail as read
  const markAsRead = async (mailId) => {
    try {
      await API.put(`/mail/${mailId}/read`, { userId: user._id });
      setMails((prevMails) =>
        prevMails.map((mail) =>
          mail.id === mailId ? { ...mail, read: true } : mail
        )
      );
    } catch (err) {
      console.error("Error marking mail as read:", err);
      throw new Error("Failed to mark mail as read.");
    }
  };

  // Claim reward
  const claimReward = async (mailId, callback) => {
    try {
      const response = await API.put(`/mail/${mailId}/claim-reward`, {
        userId: user._id,
      });

      // Update the mail in the list
      setMails((prevMails) =>
        prevMails.map((mail) =>
          mail.id === mailId
            ? { ...mail, rewardClaimed: true, read: true }
            : mail
        )
      );

      // Get the reward amount from the mail
      const mail = mails.find((m) => m.id === mailId);
      const rewardAmount = mail?.rewardAmount || 50; // Default to 50 if not specified

      // Update user coins in sessionStorage
      if (response.data.newCoinsBalance) {
        const updatedUser = { ...user, coins: response.data.newCoinsBalance };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Trigger a storage event to update other components
        window.dispatchEvent(new Event("storage"));

        // Call the callback to show coin award popup
        if (callback) {
          callback(rewardAmount);
        }
      }

      return response.data.message;
    } catch (err) {
      console.error("Error claiming reward:", err);
      throw new Error(err.response?.data?.message || "Failed to claim reward.");
    }
  };

  // Delete mail
  const deleteMail = async (mailId) => {
    try {
      await API.delete(`/mail/${mailId}`, { data: { userId: user._id } });
      setMails((prevMails) => prevMails.filter((mail) => mail.id !== mailId));
    } catch (err) {
      console.error("Error deleting mail:", err);
      throw new Error("Failed to delete mail.");
    }
  };

  return (
    <MailContext.Provider
      value={{
        mails,
        setMails,
        user,
        loading,
        error,
        markAsRead,
        claimReward,
        deleteMail,
        hasUnreadMails,
        setHasUnreadMails, // Provide setter for external updates if needed
      }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMails = () => useContext(MailContext);
