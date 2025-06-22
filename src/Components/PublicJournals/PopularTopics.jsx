import { useState, useEffect } from "react";
import { Tag, TrendingUp, Hash } from "lucide-react";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const PopularTopics = ({ onTopicClick }) => {
  const [popularTopics, setPopularTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularTopics = async () => {
      try {
        setLoading(true);
        const response = await API.get("/popular-topics?limit=8");
        setPopularTopics(response.data.popularTopics || []);
      } catch (err) {
        console.error("Error fetching popular topics:", err);
        setError("Failed to load popular topics");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTopics();
  }, []);

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

  if (popularTopics.length === 0) {
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
    <div >
      
      
      <div className="space-y-3">
        {popularTopics.map((topic, index) => (
          <button
            key={topic.tag}
            onClick={() => onTopicClick && onTopicClick(topic.tag)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-[var(--accent)] transition-colors">
                  {topic.tag}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {topic.totalLikes.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {topic.journalCount} {topic.journalCount === 1 ? 'post' : 'posts'}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Based on total likes and engagement
        </p>
      </div>
    </div>
  );
};

export default PopularTopics; 