import { Tag } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const PopularTopics = ({ onTopicClick }) => {
  const { trendingTopics, loading, error } = useSidebar();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Popular Topics</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Popular Topics</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (trendingTopics.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Popular Topics</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No topics available yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {trendingTopics.map((topic) => (
        <button
          key={topic.tag}
          onClick={() => onTopicClick && onTopicClick(topic.tag)}
          className="capitalize px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-[var(--accent)] dark:hover:text-white transition-all duration-200"
        >
          {topic.tag.toLowerCase()}
        </button>
      ))}
    </div>
  );
};

export default PopularTopics; 