import { useSidebar } from '../../context/SidebarContext';
import { Link } from 'react-router-dom';

const ActiveDiscussions = () => {
  const { activeDiscussions, loading, error } = useSidebar();

  if (loading) return <div className="text-xs text-gray-500">Loading...</div>;
  if (error) return <div className="text-xs text-red-500">{error}</div>;
  if (!activeDiscussions.length) return <div className="text-xs text-gray-500">No active discussions yet.</div>;

  return (
    <ul className="space-y-2">
      {activeDiscussions.map(journal => (
        <li
          key={journal._id}
          className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700/40 transition"
        >
          <div className="flex-1 min-w-0">
            <Link
              to={`/public-journals/${journal.slug}`}
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
            to={`/public-journals/${journal.slug}#comments`}
            className="text-xs text-[var(--accent)] font-semibold hover:underline flex-shrink-0"
          >
            Join
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ActiveDiscussions; 