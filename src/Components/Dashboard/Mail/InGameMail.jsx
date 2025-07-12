import React, { useState, useEffect } from 'react';
import { Mail, X, Inbox, Trash2, Star } from "lucide-react";
import { useMails } from "../../../context/MailContext";
import { marked } from 'marked';

const InGameMail = ({ closeModal }) => {
  const { mails, user, error, claimReward, markAsRead, deleteMail } = useMails();
  const [selectedMail, setSelectedMail] = useState(null);
  const [mailStateError, setMailStateError] = useState(null);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [activeView, setActiveView] = useState('inbox');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set initial selected mail
  useEffect(() => {
    if (mails.length > 0 && !selectedMail) {
      setSelectedMail(mails[0]);
    } else if (mails.length === 0) {
      setSelectedMail(null);
    }
  }, [mails, selectedMail]);

  // Handle mail selection
  const handleSelectMail = async (mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      try {
        await markAsRead(mail.id);
      } catch (err) {
        setMailStateError(err.message);
      }
    }
    if (isMobile) {
      setActiveView('detail');
    }
  };

  // Handle back to inbox on mobile
  const handleBackToInbox = () => {
    setActiveView('inbox');
  };

  // Handle claim reward
  const handleClaimReward = async (mailId) => {
    try {
      setClaimingReward(true);
      setMailStateError(null);
      setClaimSuccess(null);

      const message = await claimReward(mailId);

      setSelectedMail(prev => prev && prev.id === mailId ? { ...prev, rewardClaimed: true, read: true } : prev);
      setClaimSuccess(message);
    } catch (err) {
      setMailStateError(err.message);
    } finally {
      setClaimingReward(false);
    }
  };

  // Handle delete mail
  const handleDeleteMail = async (mailId) => {
    try {
      await deleteMail(mailId);
      if (selectedMail && selectedMail.id === mailId) {
        const updatedMails = mails.filter(m => m.id !== mailId);
        setSelectedMail(updatedMails.length > 0 ? updatedMails[0] : null);
        if (isMobile) {
          setActiveView('inbox');
        }
      }
    } catch (err) {
      setMailStateError(err.message);
    }
  };

  return (
    <div className="fixed top-10 inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-md md:max-w-6xl h-[85vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mail</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{mails.length} messages</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 flex items-center justify-center transition-all duration-200"
            aria-label="Close mailbox"
          >
            <X size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <div className="flex-1 overflow-hidden">
            {activeView === 'inbox' ? (
              // Mobile Inbox
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 px-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Inbox size={24} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No mail yet</h3>
                    <p className="text-sm text-center opacity-60">Your magical messages will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {mails.map(mail => (
                      <div
                        key={mail.id}
                        onClick={() => handleSelectMail(mail)}
                        className={`px-6 py-4 cursor-pointer transition-all duration-200 ${
                          !mail.read 
                            ? 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                            : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-sm font-medium truncate ${
                                !mail.read 
                                  ? 'text-gray-900 dark:text-gray-100' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {mail.title}
                              </h3>
                              {['streak', 'milestone', 'reward'].includes(mail.mailType) && mail.rewardAmount > 0 && !mail.rewardClaimed && (
                                <span className="text-amber-500 text-xs">✨</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mail.sender}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {new Date(mail.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            {!mail.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Mobile Detail View
              <div className="flex flex-col h-full">
                <button
                  onClick={handleBackToInbox}
                  className="flex items-center gap-2 px-6 py-3 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50 border-b border-gray-200/30 dark:border-gray-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">← Back</span>
                </button>
                {selectedMail ? (
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                          {selectedMail.title}
                        </h2>
                        {['streak', 'milestone', 'reward'].includes(selectedMail.mailType) && selectedMail.rewardAmount > 0 && !selectedMail.rewardClaimed && (
                          <span className="text-amber-500 ml-2 flex-shrink-0">✨</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p>From: <span className="text-gray-700 dark:text-gray-300">{selectedMail.sender}</span></p>
                        <p>{new Date(selectedMail.date).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div
                      className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: marked.parse(selectedMail.content || '') }}
                    />
                    
                    {['streak', 'milestone', 'reward'].includes(selectedMail.mailType) && selectedMail.rewardAmount > 0 && (
                      <div className="mb-6">
                        {selectedMail.rewardClaimed ? (
                          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-xl">
                            <Star size={16} className="text-green-600 dark:text-green-400" />
                            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                              Claimed {selectedMail.rewardAmount} coins!
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimReward(selectedMail.id)}
                            disabled={claimingReward}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                          >
                            <Star size={16} />
                            {claimingReward ? 'Claiming...' : `Claim ${selectedMail.rewardAmount} Coins`}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {mailStateError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl">
                        <p className="text-red-700 dark:text-red-400 text-sm">{mailStateError}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMail(selectedMail.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <p>Select a mail to view</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Desktop View
          <div className="flex flex-1 overflow-hidden">
            {/* Mail List */}
            <div className="w-2/6 border-r border-gray-200/30 dark:border-gray-700/30 overflow-y-auto bg-gray-50/30 dark:bg-gray-800/30">
              {mails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 px-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <Inbox size={32} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No mail yet</h3>
                  <p className="text-sm text-center opacity-60">Your magical messages will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                  {mails.map(mail => (
                    <div
                      key={mail.id}
                      onClick={() => handleSelectMail(mail)}
                      className={`px-6 py-4 cursor-pointer transition-all duration-200 ${
                        selectedMail?.id === mail.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' 
                          : !mail.read 
                            ? 'bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/15' 
                            : 'hover:bg-white/50 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-medium truncate ${
                              selectedMail?.id === mail.id
                                ? 'text-blue-700 dark:text-blue-300'
                                : !mail.read 
                                  ? 'text-gray-900 dark:text-gray-100' 
                                  : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {mail.title}
                            </h3>
                            {['streak', 'milestone', 'reward'].includes(mail.mailType) && mail.rewardAmount > 0 && !mail.rewardClaimed && (
                              <span className="text-amber-500 text-xs">✨</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{mail.sender}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {new Date(mail.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          {!mail.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mail Detail */}
            <div className="flex-1 overflow-y-auto">
              {selectedMail ? (
                <div className="h-full flex flex-col">
                  <div className="px-8 py-6 border-b border-gray-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                        {selectedMail.title}
                      </h2>
                      {['streak', 'milestone', 'reward'].includes(selectedMail.mailType) && selectedMail.rewardAmount > 0 && !selectedMail.rewardClaimed && (
                        <span className="text-amber-500 ml-3 flex-shrink-0">✨</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>From: <span className="text-gray-700 dark:text-gray-300 font-medium">{selectedMail.sender}</span></p>
                      <p>{new Date(selectedMail.date).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 px-8 py-6">
                    <div
                      className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: marked.parse(selectedMail.content || '') }}
                    />
                    
                    {['streak', 'milestone', 'reward'].includes(selectedMail.mailType) && selectedMail.rewardAmount > 0 && (
                      <div className="mb-6">
                        {selectedMail.rewardClaimed ? (
                          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-xl">
                            <Star size={20} className="text-green-600 dark:text-green-400" />
                            <p className="text-green-700 dark:text-green-400 font-medium">
                              Claimed {selectedMail.rewardAmount} coins!
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimReward(selectedMail.id)}
                            disabled={claimingReward}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                          >
                            <Star size={18} />
                            {claimingReward ? 'Claiming...' : `Claim ${selectedMail.rewardAmount} Coins`}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {mailStateError && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl">
                        <p className="text-red-700 dark:text-red-400">{mailStateError}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMail(selectedMail.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <Mail size={32} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a message</h3>
                  <p className="text-sm opacity-60">Choose a mail from the list to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .prose a {
          color: #2563eb !important;
          text-decoration: underline;
        }
        .dark .prose a {
          color: #60a5fa !important;
        }
        .prose a:hover {
          color: #1d4ed8 !important;
        }
        .dark .prose a:hover {
          color: #3b82f6 !important;
        }
        .prose strong, .prose b {
          color: #111827 !important;
        }
        .dark .prose strong, .dark .prose b {
          color: #f1f5f9 !important;
        }
        .dark .prose h1, .dark .prose h2, .dark .prose h3, .dark .prose h4, .dark .prose h5, .dark .prose h6 {
          color: #f1f5f9 !important;
        }
        .dark .prose blockquote {
          color: #f1f5f9 !important;
          border-left: 4px solid #60a5fa !important;
          background: rgba(30,41,59,0.5) !important;
        }
        .view-journal-btn {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default InGameMail;