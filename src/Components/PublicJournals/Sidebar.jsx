import { BookOpen, Sparkles, Lightbulb, ArrowRight, TrendingUp, Tag, Users, Smile, Info, Heart, MessageCircle, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import PopularTopics from "./PopularTopics";
import TrendingJournals from "./TrendingJournals";
import { useEffect, useState } from "react";
import axios from "axios";
import ActiveDiscussions from "./ActiveDiscussions";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const SidebarSection = ({ icon, title, children, noPadding = false, showInfo = false, infoContent = null }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm sm:rounded-2xl sm:border sm:shadow-sm rounded-none border-0 shadow-none px-0">
    <div className="p-4 border-b border-gray-200 dark:border-slate-700/50 sm:p-4 p-3">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {showInfo && infoContent && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute z-[1000] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
              {infoContent}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className={noPadding ? "" : "p-4 sm:p-4 p-3"}>
      {children}
    </div>
  </div>
);

const FeedbackBox = ({ isLoggedIn, onLogin }) => {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    setStatus("");
    try {
      await API.post("/feedback", { feedback });
      setStatus("Thank you for your feedback!");
      setFeedback("");
    } catch {
      setStatus("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <form className="space-y-2">
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          rows={3}
          placeholder="Login to give feedback"
          disabled
        />
        <button
          type="button"
          className="w-full bg-[var(--accent)] text-white rounded-lg py-1.5 font-medium text-sm opacity-80 cursor-pointer"
          onClick={onLogin}
        >
          Login to give feedback
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        rows={3}
        placeholder="Have feedback or a suggestion? Let us know!"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full bg-[var(--accent)] text-white rounded-lg py-1.5 font-medium text-sm hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
        disabled={loading || !feedback.trim()}
      >
        {loading ? "Sending..." : "Send Feedback"}
      </button>
      {status && <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">{status}</div>}
    </form>
  );
};

const Sidebar = ({ onTopicClick, onWriterClick, isLoggedIn, category }) => {

  const handleTopicClick = (topic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  const handleWriterClick = (writer) => {
    if (onWriterClick) {
      onWriterClick(writer);
    }
  };

  return (
    <div className="w-full  space-y-6 px-0 sm:px-0">
      {/* {isLoggedIn && (
        <div className="mt-4 sm:mt-0 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
          </div>
          
          <div className="space-y-2">
            <Link
              to="/journaling-alt"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--accent)] text-white hover:bg-blue-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium text-sm">Write New Entry</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/subscriptions"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium text-sm">Manage Subscriptions</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )} */}

      <SidebarSection 
        icon={<TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />} 
        title="Trending"
      >
        <TrendingJournals />
      </SidebarSection>
      
      <SidebarSection 
        icon={<BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />} 
        title="Active Discussions"
      >
        <ActiveDiscussions />
      </SidebarSection>
      
      
      
      <SidebarSection 
        icon={<Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />} 
        title="Topics"
      >
        <PopularTopics type={category === 'story' ? 'story' : 'journal'} onTopicClick={handleTopicClick} />
      </SidebarSection>

      <SidebarSection icon={<Lightbulb className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Feedback Box">
        <FeedbackBox isLoggedIn={isLoggedIn} onLogin={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} />
      </SidebarSection>
      
      <div className="bg-gradient-to-br from-[var(--accent)]/10 to-purple-100 dark:from-[var(--accent)]/5 dark:to-purple-900/20 rounded-2xl border border-[var(--accent)]/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Writing Tips</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></span>
            <span>Use tags to help others discover your content</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></span>
            <span>Engage with other writers by liking their posts</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></span>
            <span>Share your thoughts and experiences authentically</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></span>
            <span>Follow writers whose content resonates with you</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 