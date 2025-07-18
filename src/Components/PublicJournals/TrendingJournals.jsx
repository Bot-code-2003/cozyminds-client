import { useMemo } from "react";
import { TrendingUp, Clock, Heart, Tag, BookOpen, Smile, Loader2, Info, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

// Helper to get thumbnail or extract first image src from HTML content
function getImageSource(journal) {
  // First check for thumbnail
  if (journal.thumbnail) {
    return journal.thumbnail;
  }
  
  // Fallback to extracting first image from content
  if (!journal.content) return null;
  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = journal.content;
    const img = tempDiv.querySelector("img");
    return img?.src || null;
  } catch {
    return null;
  }
}

const TrendingJournals = () => {
  const { trendingJournals, loading, error } = useSidebar();

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const trendingList = useMemo(() => (
    <ul className="space-y-3">
      {trendingJournals.map((journal, idx) => {
        const imageSource = getImageSource(journal);
        return (
          <li
            key={journal._id}
            style={{ animationDelay: `${idx * 60}ms` }}
            className="animate-fadeInUp"
          >
            <Link
              onClick={() => window.scrollTo({ top: 0 })}
              to={`/public-journals/${journal.slug}`}
              className="block group bg-white/90 dark:bg-gray-900/80 p-3 a focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Read trending journal by ${journal.authorName || "Anonymous"}`}
              title={journal.title || "Untitled Entry"}
            >
              <div className="flex items-center gap-3">
                {imageSource ? (
                  <img
                    src={imageSource}
                    alt={journal.title || "Preview"}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {journal.title || "Untitled Entry"}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{journal.authorName || "Anonymous"}</span>
                    {journal.mood && (
                      <span className="flex items-center gap-1 ml-2">
                        <Smile className="w-3 h-3" /> {journal.mood}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(journal.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {journal.likeCount}
                    </span>
                    {journal.commentCount > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        {journal.commentCount}
                      </span>
                    )}
                    {/* {journal.engagementScore && (
                      <span className="text-[var(--accent)] font-medium">
                        Score: {Math.round(journal.engagementScore)}
                      </span>
                    )} */}
                  </div>
                  
                  {journal.tags && journal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-0.5">
                      {journal.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-md"
                        >
                          <Tag className="w-2.5 h-2.5" /> #{tag}
                        </span>
                      ))}
                      {journal.tags.length > 2 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[8px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-md">
                          +{journal.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  ), [trendingJournals]);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-apple shadow-apple p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Trending Now</h3>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-8 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading trending journals...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-apple shadow-apple border border-black/5 dark:border-white/10 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Trending Now</h3>
        </div>
        <div className="text-red-500 text-sm py-8 text-center">{error}</div>
      </div>
    );
  }

  if (trendingJournals.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-apple p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Trending Now</h3>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">
          No trending journals yet. Be the first to create engaging content!
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Info Header */}
      
      
      {trendingList}
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          High engagement in the last 7 days • Updated in real-time
        </p>
      </div>
    </div>
  );
};

export default TrendingJournals; 