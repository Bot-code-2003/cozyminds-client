import { BookOpen, Sparkles, Lightbulb, ArrowRight, TrendingUp, Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PopularTopics from "./PopularTopics";
import PopularWriters from "./PopularWriters";
import TrendingJournals from "./TrendingJournals";

const SidebarSection = ({ icon, title, children }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm">
    <div className="p-4 border-b border-gray-200 dark:border-slate-700/50">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

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
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <Link
              to="/journaling-alt"
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Write New Entry</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/subscriptions"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">Manage Subscriptions</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      <SidebarSection icon={<TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Trending Journals">
        <TrendingJournals />
      </SidebarSection>
      
      {/* <SidebarSection icon={<Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />} title="Popular Topics">
        <PopularTopics onTopicClick={handleTopicClick} />
      </SidebarSection> */}
      
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