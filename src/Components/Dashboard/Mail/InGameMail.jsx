"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paperclip,
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
import AID from "../../../assets/wifu.png";

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
  const [mailAnimation, setMailAnimation] = useState(false);

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
      setMailAnimation(true);

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

      // Reset animation after 2 seconds
      setTimeout(() => {
        setMailAnimation(false);
      }, 2000);
    } catch (err) {
      console.error("Error claiming reward:", err);
      setError(err.response?.data?.message || "Failed to claim reward.");
      setMailAnimation(false);
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

  // Custom styles for deep sea fantasy theme
  const fantasyStyles = {
    modalBg:
      "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm",
    mailContainer: `w-full max-w-md md:max-w-2xl lg:max-w-7xl min-h-[90vh] overflow-hidden border-2 ${
      darkMode
        ? "bg-[#0B3B46] border-[#FFCE59] shadow-[0_0_15px_rgba(255,206,89,0.4)]"
        : "bg-[#EFE7CB] border-[#2FA58D] shadow-[0_0_15px_rgba(47,165,141,0.4)]"
    }`,
    header: `flex justify-between items-center p-4 ${
      darkMode
        ? "bg-[#215866] border-b border-[#FFCE59]"
        : "bg-gradient-to-r from-[#93BBC6] to-[#65A0B0] border-b border-[#2FA58D]"
    }`,
    headerTitle: `text-xl font-serif font-semibold ${
      darkMode ? "text-[#FFCE59]" : "text-[#0B3B46]"
    }`,
    scrollArea: `h-[80vh] ${
      darkMode
        ? "scrollbar-thin scrollbar-thumb-[#FFCE59] scrollbar-track-[#0B3B46]"
        : "scrollbar-thin scrollbar-thumb-[#2FA58D] scrollbar-track-[#EFE7CB]"
    }`,
    mailListItem: (isSelected, isUnread) =>
      `p-4 cursor-pointer transition-all duration-300 ${
        darkMode
          ? isSelected
            ? "bg-[#215866] border-l-4 border-[#FFCE59]"
            : isUnread
            ? "border-l-4 border-[#FFCE59]"
            : "border-l-4 border-transparent hover:bg-[#215866]/70"
          : isSelected
          ? "bg-[#CBE4EA] border-l-4 border-[#2FA58D]"
          : isUnread
          ? "border-l-4 border-[#2FA58D]"
          : "border-l-4 border-transparent hover:bg-[#CBE4EA]/70"
      }`,
    mailTitle: (isUnread) =>
      `text-base font-medium truncate max-w-[80%] ${
        darkMode
          ? isUnread
            ? "text-[#FFCE59]"
            : "text-[#F6F1DC]"
          : isUnread
          ? "text-[#2FA58D] font-bold"
          : "text-[#0B3B46]"
      }`,
    mailSender: `text-sm truncate max-w-[60%] ${
      darkMode ? "text-[#93BBC6]" : "text-[#215866]"
    }`,
    mailDate: `text-xs ${darkMode ? "text-[#93BBC6]" : "text-[#215866]"}`,
    mailContent: `p-6 ${darkMode ? "text-[#F6F1DC]" : "text-[#0B3B46]"}`,
    mailDetailTitle: `text-xl font-serif font-semibold ${
      darkMode ? "text-[#FFCE59]" : "text-[#215866]"
    }`,
    rewardTag: `text-xs px-2 py-1 ${
      darkMode
        ? "bg-[#FFCE59]/20 text-[#FFCE59]"
        : "bg-[#2FA58D]/20 text-[#2FA58D] font-semibold"
    }`,
    rewardBox: `mt-6 p-4 border ${
      darkMode
        ? "bg-[#215866] border-[#FFCE59]"
        : "bg-[#CBE4EA]/70 border-[#2FA58D]"
    }`,
    button: (color = "primary") =>
      `flex items-center gap-2 ${
        color === "primary"
          ? darkMode
            ? "bg-[#FFCE59] text-[#0B3B46]"
            : "bg-[#2FA58D] text-white"
          : darkMode
          ? "bg-[#2FA58D] text-white"
          : "bg-[#215866] text-white"
      } px-4 py-2 hover:opacity-90 transition-all duration-300 shadow-md`,
    emptyState:
      "flex flex-col items-center justify-center h-full p-6 text-center",
    emptyIcon: `mb-4 opacity-50 ${
      darkMode ? "text-[#93BBC6]" : "text-[#65A0B0]"
    }`,
    emptyText: `text-base font-medium ${
      darkMode ? "text-[#93BBC6]" : "text-[#215866]"
    }`,
    loadingSpinner: `animate-spin w-8 h-8 border-4 border-t-transparent ${
      darkMode ? "border-[#FFCE59]" : "border-[#2FA58D]"
    }`,
    mobileBackButton: `flex items-center gap-2 p-3 ${
      darkMode
        ? "text-[#FFCE59] border-b border-[#FFCE59]"
        : "text-[#2FA58D] border-b border-[#2FA58D]"
    }`,
    claimButton: `w-full flex items-center justify-center gap-2 px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
      darkMode
        ? "bg-gradient-to-r from-[#FFCE59] to-[#FFAD33] text-[#0B3B46] hover:brightness-110 transition-all duration-300 shadow-[0_0_10px_rgba(255,206,89,0.5)]"
        : "bg-gradient-to-r from-[#2FA58D] to-[#217A69] text-white hover:brightness-110 transition-all duration-300 shadow-[0_0_10px_rgba(47,165,141,0.5)]"
    }`,
    successMessage: `mt-3 p-2 text-sm ${
      darkMode
        ? "bg-[#2FA58D]/20 text-[#2FA58D]"
        : "bg-[#2FA58D]/20 text-[#0B3B46]"
    }`,
    errorMessage: `mt-3 p-2 text-sm ${
      darkMode ? "bg-red-100 text-red-800" : "bg-[#f5caca] text-[#a83240]"
    }`,
    attachmentBox: `flex items-center p-3 ${
      darkMode
        ? "bg-[#215866] text-[#FFCE59]"
        : "bg-[#CBE4EA]/70 text-[#2FA58D]"
    }`,
    mailDetailContent: `prose prose-sm max-w-none ${
      darkMode
        ? "text-[#F6F1DC] prose-headings:text-[#FFCE59] prose-a:text-[#2FA58D]"
        : "text-[#0B3B46] prose-headings:text-[#2FA58D] prose-a:text-[#215866]"
    }`,
    unreadIndicator: `w-2 h-2 mt-2 animate-pulse ${
      darkMode ? "bg-[#FFCE59]" : "bg-[#2FA58D]"
    }`,
    storyCircle: `ring-2 ring-offset-2 ${
      darkMode
        ? "ring-[#FFCE59] ring-offset-[#0B3B46]"
        : "ring-[#2FA58D] ring-offset-[#EFE7CB]"
    }`,
    mailAnimation: mailAnimation ? "animate-bounce" : "",
  };

  if (loading) {
    return (
      <div className={fantasyStyles.modalBg}>
        <div className={fantasyStyles.mailContainer}>
          <div className={fantasyStyles.header}>
            <h2 className={fantasyStyles.headerTitle}>Inbox</h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[#d4a256]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[300px] md:h-[450px]">
            <div className="flex flex-col items-center gap-3">
              <div className={fantasyStyles.loadingSpinner}></div>
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
      <div className={fantasyStyles.modalBg}>
        <div className={fantasyStyles.mailContainer}>
          <div className={fantasyStyles.header}>
            <h2 className={fantasyStyles.headerTitle}>Inbox</h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[#d4a256]" />
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
                className={fantasyStyles.button()}
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
    <div className={fantasyStyles.modalBg}>
      <div className={fantasyStyles.mailContainer}>
        {/* Header */}
        <div className={fantasyStyles.header}>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#d4a256]" />
            <h2 className={fantasyStyles.headerTitle}>Magical Messenger</h2>
          </div>
          <button
            onClick={toggleMailModal}
            className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[#d4a256]" />
          </button>
        </div>

        {/* Mobile View */}
        {isMobile && (
          <div className={fantasyStyles.scrollArea}>
            {activeView === "inbox" ? (
              /* Mobile Inbox List */
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className={fantasyStyles.emptyState}>
                    <Inbox size={40} className={fantasyStyles.emptyIcon} />
                    <p className={fantasyStyles.emptyText}>
                      Your magical scroll case is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e2c496]/30">
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
                          className={fantasyStyles.mailListItem(
                            false,
                            !mail.read
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={fantasyStyles.mailTitle(!mail.read)}>
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">✨</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span
                                className={fantasyStyles.unreadIndicator}
                              ></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={fantasyStyles.mailSender}>
                              {mail.sender}
                            </p>
                            <p className={fantasyStyles.mailDate}>
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
                  className={fantasyStyles.mobileBackButton}
                >
                  <ArrowLeft size={16} />
                  <span>Back to scrolls</span>
                </button>

                {/* Mail content */}
                {selectedMail ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className={fantasyStyles.mailContent}>
                      <div className="flex items-start justify-between">
                        <h2 className={fantasyStyles.mailDetailTitle}>
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">✨</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className={fantasyStyles.rewardTag}>
                              Treasure
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#7e6c56] mt-2">
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

                      <div
                        className={`border-t border-[#e2c496]/30 my-4 pt-4 ${fantasyStyles.mailAnimation}`}
                      >
                        <div
                          className={fantasyStyles.mailDetailContent}
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className={fantasyStyles.rewardBox}>
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Treasure of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Magical Treasure Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className={fantasyStyles.claimButton}
                              >
                                <Star size={16} className="animate-pulse" />
                                <span>
                                  {claimingReward
                                    ? "Summoning..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Magic Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className={fantasyStyles.successMessage}>
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className={fantasyStyles.errorMessage}>
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className={fantasyStyles.attachmentBox}>
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Magical Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className={fantasyStyles.button()}
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        {/* <button
                            onClick={() => deleteMail(selectedMail.id)}
                            title="Delete Mail"
                            className={fantasyStyles.button("secondary")}
                          >
                            <Trash2 size={16} />
                            <span>Discard</span>
                          </button> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#7e6c56]">
                    <p className="text-base font-medium">
                      Select a scroll to view.
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
            <div className="w-1/3 border-r border-[#e2c496]/30 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className={fantasyStyles.emptyState}>
                    <Inbox size={40} className={fantasyStyles.emptyIcon} />
                    <p className={fantasyStyles.emptyText}>
                      Your magical scroll case is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e2c496]/30">
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
                          className={fantasyStyles.mailListItem(
                            isSelected,
                            !mail.read
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={fantasyStyles.mailTitle(!mail.read)}>
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">✨</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span
                                className={fantasyStyles.unreadIndicator}
                              ></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={fantasyStyles.mailSender}>
                              {mail.sender}
                            </p>
                            <p className={fantasyStyles.mailDate}>
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
                  <div className={fantasyStyles.mailContent}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h2 className={fantasyStyles.mailDetailTitle}>
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">✨</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className={fantasyStyles.rewardTag}>
                              Treasure
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#7e6c56]">
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

                      <div
                        className={`border-t border-[#e2c496]/30 my-4 pt-4 ${fantasyStyles.mailAnimation}`}
                      >
                        <div
                          className={fantasyStyles.mailDetailContent}
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className={fantasyStyles.rewardBox}>
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Treasure of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Magical Treasure Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className={fantasyStyles.claimButton}
                              >
                                <Star size={16} className="animate-pulse" />
                                <span>
                                  {claimingReward
                                    ? "Summoning..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Magic Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className={fantasyStyles.successMessage}>
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className={fantasyStyles.errorMessage}>
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className={fantasyStyles.attachmentBox}>
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Magical Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className={fantasyStyles.button()}
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        {/* <button
                          onClick={() => deleteMail(selectedMail.id)}
                          title="Delete Mail"
                          className={fantasyStyles.button("secondary")}
                        >
                          <Trash2 size={16} />
                          <span>Discard</span>
                        </button> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#7e6c56]">
                    <Mail size={40} className="mb-4 opacity-50" />
                    <p className="text-base font-medium">
                      Select a magical scroll to view
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
