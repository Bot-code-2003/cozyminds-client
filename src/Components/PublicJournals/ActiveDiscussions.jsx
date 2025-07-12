import { useSidebar } from '../../context/SidebarContext';
import { Link } from 'react-router-dom';
import { Info, MessageCircle, Heart, Bookmark } from 'lucide-react';

const ActiveDiscussions = () => {
  const { activeDiscussions, loading, error } = useSidebar();

  if (loading) return <div className="text-xs text-gray-500">Loading...</div>;
  if (error) return <div className="text-xs text-red-500">{error}</div>;
  if (!activeDiscussions.length) return <div className="text-xs text-gray-500">No active discussions yet.</div>;

  return (
    <div>
      <ul className="space-y-2">
        {activeDiscussions.map(journal => (
          <li
            key={journal._id}
            className="flex items-center gap-3 p-3 rounded hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
          >
            <div className="flex-1 min-w-0">
              <Link
                to={`/journals/${journal.slug}`}
                className="font-medium text-gray-900 dark:text-gray-100 truncate block text-sm mb-1"
                title={journal.title}
              >
                {journal.title}
              </Link>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <span>by {journal.authorName || "Anonymous"}</span>
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
                <span>{journal.commentCount} comments</span>
                {/* {journal.activityScore && (
                  <>
                    <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-[var(--accent)] font-medium">
                      Score: {Math.round(journal.activityScore)}
                    </span>
                  </>
                )} */}
              </div>
            </div>
            <Link
              to={`/journals/${journal.slug}#comments`}
              className="text-xs text-[var(--accent)] font-semibold hover:underline flex-shrink-0"
            >
              Join
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveDiscussions; 