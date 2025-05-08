"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paperclip,
  Trash2,
  MailCheck,
  X,
  Gift,
  ArrowLeft,
  Inbox,
  Mail,
  Star,
} from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";
import { useCoins } from "../../../context/CoinContext";

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
  const { updateUserCoins, showCoinAward } = useCoins();
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [activeView, setActiveView] = useState("inbox"); // "inbox" or "detail"
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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

        // On mobile, go back to inbox view after deleting
        if (isMobile) {
          setActiveView("inbox");
        }
      }
    } catch (err) {
      console.error("Error deleting mail:", err);
      setError("Failed to delete mail.");
    }
  };

  // Handle mail selection
  const handleSelectMail = (mail) => {
    setSelectedMail(mail);
    if (!mail.read) markAsRead(mail.id);

    // On mobile, switch to detail view
    if (isMobile) {
      setActiveView("detail");
    }
  };

  // Handle back to inbox
  const handleBackToInbox = () => {
    setActiveView("inbox");
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
          className={`w-full max-w-md md:max-w-2xl lg:max-w-4xl rounded-lg shadow-lg p-5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]`}
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
          <div className="flex justify-center items-center h-[300px] md:h-[450px]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full"></div>
              <span className="text-base font-medium">
                Loading your mail...
              </span>
            </div>
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
          className={`w-full max-w-md md:max-w-2xl lg:max-w-4xl rounded-lg shadow-lg p-5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]`}
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
          <div className="flex justify-center items-center h-[300px] md:h-[450px]">
            <div className="text-center p-6 max-w-md">
              <div className="text-red-500 mb-3">
                <X size={40} className="mx-auto" />
              </div>
              <span className="text-base font-medium text-red-400 block mb-2">
                {error}
              </span>
              <button
                onClick={toggleMailModal}
                className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent)]/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        darkMode ? "bg-black/80" : "bg-black/50"
      }`}
    >
      <div
        className={`w-full max-w-md md:max-w-2xl lg:max-w-6xl min-h-[90vh] rounded-lg shadow-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              Inbox
            </h2>
          </div>
          <button
            onClick={toggleMailModal}
            className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[var(--accent)]" />
          </button>
        </div>

        {/* Mobile View */}
        {isMobile && (
          <div className="h-[80vh] overflow-hidden">
            {activeView === "inbox" ? (
              /* Mobile Inbox List */
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Inbox
                      size={40}
                      className="text-[var(--text-secondary)] mb-4"
                    />
                    <p className="text-base font-medium text-[var(--text-secondary)]">
                      Your inbox is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {mails.map((mail) => {
                      const formattedDate = new Date(
                        mail.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={mail.id}
                          onClick={() => handleSelectMail(mail)}
                          className={`p-4 cursor-pointer transition-colors hover:bg-[var(--bg-primary)] ${
                            !mail.read
                              ? "border-l-4 border-[var(--accent)]"
                              : "border-l-4 border-transparent"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3
                              className={`text-base font-medium ${
                                !mail.read ? "text-[var(--accent)]" : ""
                              }`}
                            >
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">🎁</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span className="w-2 h-2 bg-[var(--highlight)] rounded-full mt-2"></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                              {mail.sender}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Mobile Mail Detail */
              <div className="h-full flex flex-col">
                {/* Back button */}
                <button
                  onClick={handleBackToInbox}
                  className="flex items-center gap-2 p-3 text-[var(--accent)] border-b border-[var(--border)]"
                >
                  <ArrowLeft size={16} />
                  <span>Back to inbox</span>
                </button>

                {/* Mail content */}
                {selectedMail ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-semibold text-[var(--accent)] pr-4">
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">🎁</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                              Reward
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">From:</span>{" "}
                          {selectedMail.sender}
                        </div>
                        <div>
                          {new Date(selectedMail.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[var(--border)] my-4 pt-4">
                        <div
                          className="prose prose-sm max-w-none text-[var(--text-primary)]"
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Reward of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Reward Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className="w-full flex items-center justify-center gap-2 bg-[#D4B96E] text-white px-4 py-3 rounded-md hover:bg-[#C4A24C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Star size={16} />
                                <span className="font-medium">
                                  {claimingReward
                                    ? "Claiming..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md text-sm">
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className="mt-3 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className="flex items-center text-[var(--accent)] p-3 bg-[var(--bg-primary)] rounded-md">
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-white px-3 py-2 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteMail(selectedMail.id)}
                          title="Delete Mail"
                          className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-white px-3 py-2 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
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
            )}
          </div>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <div className="flex h-[80vh]">
            {/* Left Panel - Mail List */}
            <div className="w-1/3 border-r border-[var(--border)] overflow-hidden">
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Inbox
                      size={40}
                      className="text-[var(--text-secondary)] mb-4"
                    />
                    <p className="text-base font-medium text-[var(--text-secondary)]">
                      Your inbox is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
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
                          onClick={() => handleSelectMail(mail)}
                          className={`p-4 cursor-pointer transition-colors hover:bg-[var(--bg-primary)] ${
                            isSelected
                              ? "bg-[var(--bg-primary)] border-l-4 border-[var(--accent)]"
                              : !mail.read
                              ? "border-l-4 border-[var(--accent)]"
                              : "border-l-4 border-transparent"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3
                              className={`text-base font-medium truncate max-w-[80%] ${
                                !mail.read ? "text-[var(--accent)]" : ""
                              }`}
                            >
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">🎁</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span className="w-2 h-2 bg-[var(--highlight)] rounded-full mt-2"></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[var(--text-secondary)] truncate max-w-[60%]">
                              {mail.sender}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Mail Detail */}
            <div className="w-2/3 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {selectedMail ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-[var(--accent)] pr-4">
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">🎁</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                              Reward
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">From:</span>{" "}
                          {selectedMail.sender}
                        </div>
                        <div>
                          {new Date(selectedMail.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[var(--border)] my-4 pt-4">
                        <div
                          className="prose prose-sm max-w-none text-[var(--text-primary)]"
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Reward of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Reward Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className="flex items-center justify-center gap-2 bg-[#D4B96E] text-white px-4 py-3 rounded-md hover:bg-[#C4A24C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Star size={16} />
                                <span className="font-medium">
                                  {claimingReward
                                    ? "Claiming..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md text-sm">
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className="mt-3 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className="flex items-center text-[var(--accent)] p-3 bg-[var(--bg-primary)] rounded-md">
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteMail(selectedMail.id)}
                          title="Delete Mail"
                          className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
                    <Mail size={40} className="mb-4 opacity-50" />
                    <p className="text-base font-medium">
                      Select a mail to view
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InGameMail;
