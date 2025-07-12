import { Link } from "react-router-dom";

const JournalEntryCard = ({ journal }) => {
  if (!journal) return null;
  const excerpt = journal.content?.replace(/<[^>]*>/g, '').substring(0, 120) + (journal.content?.length > 120 ? '...' : '');
  return (
    <Link
      to={`/${journal.userId?.anonymousName || 'anonymous'}/${journal.slug}`}
      className="block group rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        {journal.thumbnail && (
          <div className="sm:w-40 w-full h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={journal.thumbnail}
              alt={journal.title || 'Journal thumbnail'}
              className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[var(--accent)] transition-colors">
              {journal.title || 'Untitled Entry'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {excerpt}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {journal.userId?.anonymousName && (
              <span className="text-xs text-gray-400 dark:text-gray-500">by {journal.userId.anonymousName}</span>
            )}
            <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(journal.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JournalEntryCard; 