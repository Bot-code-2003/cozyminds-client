"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Trash2, MailCheck, X, Gift } from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";
import { useCoins } from "../../../context/CoinContext"; // Import the coin context

// Configure Axios with base URL
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const InGameMail = ({
  toggleMailModal,
  mails,
  setMails,
  setHasUnreadMails,
  userId,
}) => {
  const { darkMode } = useDarkMode();
  const { updateUserCoins, showCoinAward } = useCoins(); // Use the coin context
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);

  // Set initial selected mail when mails change
  useEffect(() => {
    if (mails.length > 0 && !selectedMail) {
      setSelectedMail(mails[0]);
    } else if (mails.length === 0) {
      setSelectedMail(null);
    }
  }, [mails, selectedMail]);

  // Mark mail as read
  const markAsRead = async (mailId) => {
    try {
      await API.put(`/mail/${mailId}/read`, { userId });
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));
    } catch (err) {
      console.error("Error marking mail as read:", err);
    }
  };

  // Claim reward
  const claimReward = async (mailId) => {
    try {
      setClaimingReward(true);
      setError(null);
      setClaimSuccess(null);

      const response = await API.put(`/mail/${mailId}/claim-reward`, {
        userId,
      });

      // Update the mail in the list
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, rewardClaimed: true, read: true } : mail
      );

      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));

      // Update selected mail
      if (selectedMail && selectedMail.id === mailId) {
        setSelectedMail({ ...selectedMail, rewardClaimed: true, read: true });
      }

      // Get the reward amount from the mail
      const mail = mails.find((m) => m.id === mailId);
      const rewardAmount = mail?.rewardAmount || 50; // Default to 50 if not specified

      // Update user coins in context and show coin award popup
      if (response.data.newCoinsBalance) {
        // Update coins directly with the new balance from the server
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (user) {
          user.coins = response.data.newCoinsBalance;
          sessionStorage.setItem("user", JSON.stringify(user));

          // Trigger a storage event to update other components
          window.dispatchEvent(new Event("storage"));
        }

        // Show the coin award popup
        showCoinAward(rewardAmount);
      }

      setClaimSuccess(response.data.message);
    } catch (err) {
      console.error("Error claiming reward:", err);
      setError(err.response?.data?.message || "Failed to claim reward.");
    } finally {
      setClaimingReward(false);
    }
  };

  // Delete mail
  const deleteMail = async (mailId) => {
    try {
      await API.delete(`/mail/${mailId}`, { data: { userId } });
      const updatedMails = mails.filter((mail) => mail.id !== mailId);
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));
      if (selectedMail && selectedMail.id === mailId) {
        // After deleting the selected mail automatically update the selected mail to the next mail.
        setSelectedMail(updatedMails.length > 0 ? updatedMails[0] : null);
      }
    } catch (err) {
      console.error("Error deleting mail:", err);
      setError("Failed to delete mail.");
    }
  };

  // Handle claim button click in mail content
  useEffect(() => {
    if (
      selectedMail &&
      selectedMail.mailType === "reward" &&
      !selectedMail.rewardClaimed
    ) {
      const claimButton = document.getElementById("claim-reward-button");
      if (claimButton) {
        claimButton.addEventListener("click", () =>
          claimReward(selectedMail.id)
        );
        return () => {
          claimButton.removeEventListener("click", () =>
            claimReward(selectedMail.id)
          );
        };
      }
    }
  }, [selectedMail]);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-black/80" : "bg-black/50"
        }`}
      >
        <div
          className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              Inbox
            </h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[var(--accent)]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[450px]">
            <span className="text-base font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-black/80" : "bg-black/50"
        }`}
      >
        <div
          className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              Inbox
            </h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[var(--accent)]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[450px]">
            <span className="text-base font-medium text-red-400">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? "bg-black/80" : "bg-black/50"
      }`}
    >
      <div
        className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--accent)]">Inbox</h2>
          <button
            onClick={toggleMailModal}
            className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[var(--accent)]" />
          </button>
        </div>
        <div
          className={`max-w-7xl mx-auto h-[550px] flex bg-[var(--bg-secondary)] text-[var(--text-primary)]`}
        >
          {/* Left Panel - Mail List */}
          <div className="w-1/3 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-3 space-y-2">
                {mails.length === 0 ? (
                  <p className="text-center text-base font-medium p-4 text-[var(--text-secondary)]">
                    No mails to display.
                  </p>
                ) : (
                  <div>
                    {mails.map((mail) => {
                      const formattedDate = new Date(
                        mail.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      const isSelected = selectedMail?.id === mail.id;

                      return (
                        <div
                          key={mail.id}
                          onClick={() => {
                            setSelectedMail(mail);
                            if (!mail.read) markAsRead(mail.id);
                          }}
                          className={`p-3 rounded cursor-pointer flex items-center transition-colors hover:bg-[var(--bg-primary)] ${
                            isSelected
                              ? "bg-[var(--bg-primary)] border-l-2 border-[var(--accent)]"
                              : mail.read
                              ? "opacity-60"
                              : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3
                                className={`text-base font-medium ${
                                  !mail.read ? "text-[var(--accent)]" : ""
                                }`}
                              >
                                {mail.title}
                                {mail.mailType === "reward" && (
                                  <span className="ml-2 text-yellow-500">
                                    🎁
                                  </span>
                                )}
                              </h3>
                              {!mail.read && (
                                <span className="w-2 h-2 bg-[var(--highlight)] rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              {formattedDate} • {mail.sender}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Separation Line */}
          <div className={`w-px mx-4 bg-[var(--border)]`}></div>

          {/* Right Panel - Mail Detail */}
          <div className="w-2/3 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {selectedMail ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-[var(--accent)]">
                        {selectedMail.title}
                        {selectedMail.mailType === "reward" && (
                          <span className="ml-2 text-yellow-500">🎁</span>
                        )}
                      </h2>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      From: {selectedMail.sender} •{" "}
                      {new Date(selectedMail.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Mail Content */}
                    <div
                      className="leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: selectedMail.content }}
                    />

                    {/* Reward Claim Button (if applicable) */}
                    {selectedMail.mailType === "reward" && (
                      <div className="mt-4">
                        {selectedMail.rewardClaimed ? (
                          <div className="p-3 bg-green-100 text-green-800 rounded-md flex items-center">
                            <Gift size={18} className="mr-2" />
                            <span>
                              Reward of {selectedMail.rewardAmount || 50} coins
                              already claimed!
                            </span>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() => claimReward(selectedMail.id)}
                              disabled={claimingReward}
                              className="flex items-center space-x-2 bg-[#D4B96E] text-white px-4 py-2 rounded-md hover:bg-[#C4A24C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Gift size={18} />
                              <span>
                                {claimingReward
                                  ? "Claiming..."
                                  : `Claim ${
                                      selectedMail.rewardAmount || 50
                                    } Coins`}
                              </span>
                            </button>

                            {claimSuccess && (
                              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">
                                {claimSuccess}
                              </div>
                            )}

                            {error && (
                              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md">
                                {error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedMail.hasAttachment && (
                      <div className="flex items-center text-[var(--accent)]">
                        <Paperclip size={16} className="mr-1" />
                        <span className="text-sm">Attachment</span>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-4">
                      {!selectedMail.read && (
                        <button
                          onClick={() => markAsRead(selectedMail.id)}
                          title="Mark as Read"
                          className="flex items-center space-x-2 bg-[var(--accent)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                        >
                          <MailCheck size={16} />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteMail(selectedMail.id)}
                        title="Delete Mail"
                        className="flex items-center space-x-2 bg-[var(--accent)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Delete Mail</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                    <p className="text-base font-medium">
                      Select a mail to view.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InGameMail;
