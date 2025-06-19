import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Tag, Smile, BookOpen } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

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

const PublicRecommendations = ({ slug }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/journals/recommendations/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load recommendations");
        setLoading(false);
      });
  }, [slug]);

  const recommendationsList = useMemo(() => (
    <ul className="space-y-4">
      {recommendations.map((rec, idx) => {
        const firstImage = getFirstImage(rec.content);
        return (
          <li
            key={rec._id}
            style={{ animationDelay: `${idx * 60}ms` }}
            className="animate-fadeInUp"
          >
            <Link
              onClick={() => window.scrollTo({ top: 0 })}
              to={`/public-journal/${rec.slug}`}
              className="block group bg-white/90 dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 p-3 sm:p-4 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Read recommended journal by ${rec.authorName || "Anonymous"}`}
              title={rec.title || "Untitled Entry"}
            >
              <div className="flex items-center gap-3">
                {firstImage && (
                  <img
                    src={firstImage}
                    alt={rec.title || "Preview"}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rec.title || "Untitled Entry"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <BookOpen className="w-3 h-3" />
                    <span>{rec.authorName || "Anonymous"}</span>
                    {rec.mood && (
                      <span className="flex items-center gap-1 ml-2">
                        <Smile className="w-3 h-3" /> {rec.mood}
                      </span>
                    )}
                  </div>
                  {rec.tags && rec.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-1">
                      {rec.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg"
                        >
                          <Tag className="w-3 h-3" /> #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {(() => {
                      const text = rec.content ? rec.content.replace(/<[^>]+>/g, "") : "";
                      return text.length > 80 ? text.slice(0, 80) + "..." : text;
                    })()}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  ), [recommendations]);

  return (
    <aside className="sticky top-20 max-h-[calc(100vh-5rem)] ">
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-apple shadow-apple border border-black/5 dark:border-white/10 p-4 sm:p-5 space-y-4">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Recommended Journals</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm py-8 text-center">{error}</div>
        ) : recommendations.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">No recommendations found.</div>
        ) : recommendationsList}
      </div>
    </aside>
  );
};

export default PublicRecommendations; 