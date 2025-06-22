import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ServerCrash, Heart, BookOpen } from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const moodEmojis = {
  Happy: "😊",
  Grateful: "🙏",
  Inspired: "💡",
  Productive: "🚀",
  Relaxed: "😌",
  Hopeful: "🌱",
  Reflective: "🤔",
  Sad: "😢",
  Anxious: "😟",
  Tired: "😴",
};

// Helper to extract first image src from HTML content
function getFirstImage(html) {
  if (!html) return null;
  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const img = tempDiv.querySelector("img");
    return img?.src || null;
  } catch {
    return null;
  }
}

const TopMoodPosts = () => {
  const [moodPosts, setMoodPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopMoodPosts = async () => {
      try {
        setLoading(true);
        const response = await API.get("/journals/top-by-mood");
        // console.log(response.data); // <-- add this

        setMoodPosts(response.data);
      } catch (err) {
        console.error("Error fetching top mood posts:", err);
        setError("Failed to load posts by mood.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopMoodPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        <ServerCrash className="w-6 h-6 mx-auto mb-2" />
        {error}
      </div>
    );
  }

  // Filter out moods with no posts and sort the rest
  const sortedMoodsWithPosts = Object.entries(moodPosts)
    .filter(([_, journals]) => journals.length > 0)
    .sort(([, a], [, b]) => b.length - a.length);

  if (sortedMoodsWithPosts.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No popular posts by mood yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {sortedMoodsWithPosts.map(([mood, journals]) => (
        <div key={mood}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{moodEmojis[mood] || "✨"}</span>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{mood}</h4>
          </div>
          <ul className="space-y-2">
            {journals.map((journal) => (
              <li key={journal.slug}>
                <Link
                  to={`/public-journal/${journal.slug}`}
                  className="block group p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {(() => {
                      const firstImage = getFirstImage(journal.content);
                      return firstImage ? (
                        <img
                          src={firstImage}
                          alt={journal.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)] transition-colors truncate">
                        {journal.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        by {journal.authorName || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span>{journal.likeCount} {journal.likeCount === 1 ? 'like' : 'likes'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TopMoodPosts; 