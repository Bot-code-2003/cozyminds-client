import { BookOpen, Sparkles, Lightbulb, ArrowRight, TrendingUp, Tag, Users, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import PopularTopics from "./PopularTopics";
import PopularWriters from "./PopularWriters";
import TrendingJournals from "./TrendingJournals";
import TopMoodPosts from "./TopMoodPosts";
import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const SidebarSection = ({ icon, title, children, noPadding = false }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm">
    <div className="p-4 border-b border-gray-200 dark:border-slate-700/50">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
    </div>
    <div className={noPadding ? "" : "p-4"}>
      {children}
    </div>
  </div>
);

const ActiveDiscussions = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const res = await API.get("/journals/with-comments?sort=-commentCount&limit=7");
        setJournals(res.data.journals || []);
      } catch (err) {
        setError("Failed to load discussions");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, []);

  if (loading) return <div className="text-xs text-gray-500">Loading...</div>;
  if (error) return <div className="text-xs text-red-500">{error}</div>;
  if (!journals.length) return <div className="text-xs text-gray-500">No active discussions yet.</div>;

  return (
    <ul className="space-y-2">
      {journals.map(journal => (
        <li
          key={journal._id}
          className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700/40 transition"
        >
          <div className="flex-1 min-w-0">
            <Link
              to={`/public-journal/${journal.slug}`}
              className="font-medium text-gray-900 dark:text-gray-100 truncate block text-sm mb-1"
              title={journal.title}
            >
              {journal.title}
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <span>by {journal.authorName || "Anonymous"}</span>
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
              <span>{journal.commentCount} comments</span>
            </div>
          </div>
          <Link
            to={`/public-journal/${journal.slug}#comments`}
            className="text-xs text-[var(--accent)] font-semibold hover:underline flex-shrink-0"
          >
            Join
          </Link>
        </li>
      ))}
    </ul>
  );
};

const FeedbackBox = () => {
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

const Sidebar = ({ onTopicClick, onWriterClick, isLoggedIn }) => {

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
    <div className="w-full space-y-6">
      {isLoggedIn && (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm p-4">
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
      )}

      <SidebarSection icon={<TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Trending Journals">
        <TrendingJournals />
      </SidebarSection>
      
      <SidebarSection icon={<BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Active Discussions">
        <ActiveDiscussions />
      </SidebarSection>
      
      <SidebarSection icon={<Lightbulb className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Feedback Box">
        <FeedbackBox />
      </SidebarSection>
      
      <SidebarSection icon={<Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Popular Topics">
        <PopularTopics onTopicClick={handleTopicClick} />
      </SidebarSection>
      
      <SidebarSection icon={<Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Top Posts by Mood" noPadding>
        <TopMoodPosts />
      </SidebarSection>
      
      <SidebarSection icon={<Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Top Writers">
        <PopularWriters onWriterClick={handleWriterClick} isLoggedIn={isLoggedIn} />
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