import { Tag, Heart, Briefcase, User, Globe, TrendingUp, BookOpen, Smile, Users, Cloud, Star, Plane, Brain, Feather, Sun, Moon, HeartHandshake, Mountain, Sparkles, Ghost, Book, Search, History, HeartPulse, Compass, Film, Laugh, Drama, Flame, Umbrella, Puzzle, } from "lucide-react";

const JOURNAL_TOPICS = [
  'Life', 'Relationships', 'Career', 'Health & Wellness', 'Travel',
  'Personal Growth', 'Reflections', 'Gratitude', 'Family', 'Dreams',
];

const STORY_TOPICS = [
  'Fantasy', 'Science Fiction', 'Horror', 'Mystery', 'Historical',
  'Romance', 'Adventure', 'Drama', 'Thriller', 'Comedy',
];

const topicIcons = {
  // Journal topics
  'Life': User,
  'Relationships': HeartHandshake,
  'Career': Briefcase,
  'Health & Wellness': HeartPulse,
  'Travel': Plane,
  'Personal Growth': Brain,
  'Reflections': Feather,
  'Gratitude': Smile,
  'Family': Users,
  'Dreams': Cloud,
  // Story topics
  'Fantasy': Sparkles,
  'Science Fiction': Globe,
  'Horror': Ghost,
  'Mystery': Search,
  'Historical': History,
  'Romance': Heart,
  'Adventure': Compass,
  'Drama': Drama,
  'Thriller': Flame,
  'Comedy': Laugh,
};

// Assign a unique color for each topic (Apple-like pastel palette)
const topicColors = {
  'Life':    { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400' },
  'Relationships': { bg: 'bg-pink-100 dark:bg-pink-900/30', icon: 'text-pink-600 dark:text-pink-400' },
  'Career':  { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-400' },
  'Health & Wellness': { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-600 dark:text-green-400' },
  'Travel':  { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
  'Personal Growth': { bg: 'bg-teal-100 dark:bg-teal-900/30', icon: 'text-teal-600 dark:text-teal-400' },
  'Reflections': { bg: 'bg-gray-100 dark:bg-gray-900/30', icon: 'text-gray-600 dark:text-gray-400' },
  'Gratitude': { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400' },
  'Family':   { bg: 'bg-indigo-100 dark:bg-indigo-900/30', icon: 'text-indigo-600 dark:text-indigo-400' },
  'Dreams':   { bg: 'bg-cyan-100 dark:bg-cyan-900/30', icon: 'text-cyan-600 dark:text-cyan-400' },
  // Story topics
  'Fantasy':  { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
  'Science Fiction': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', icon: 'text-cyan-600 dark:text-cyan-400' },
  'Horror':   { bg: 'bg-red-100 dark:bg-red-900/30', icon: 'text-red-600 dark:text-red-400' },
  'Mystery':  { bg: 'bg-gray-100 dark:bg-gray-900/30', icon: 'text-gray-600 dark:text-gray-400' },
  'Historical': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-400' },
  'Romance':  { bg: 'bg-pink-100 dark:bg-pink-900/30', icon: 'text-pink-600 dark:text-pink-400' },
  'Adventure': { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-600 dark:text-green-400' },
  'Drama':    { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400' },
  'Thriller': { bg: 'bg-red-100 dark:bg-red-900/30', icon: 'text-red-600 dark:text-red-400' },
  'Comedy':   { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-400' },
};

const PopularTopics = ({ onTopicClick, type = 'journal' }) => {
  const topics = type === 'story' ? STORY_TOPICS : JOURNAL_TOPICS;

  return (
    <div className="rounded-2xl">
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => {
          const Icon = topicIcons[topic] || Tag;
          const color = topicColors[topic] || { bg: 'bg-gray-100 dark:bg-gray-900/30', icon: 'text-gray-600 dark:text-gray-400' };
          return (
            <button
              key={topic}
              onClick={() => onTopicClick && onTopicClick(topic)}
              className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/60 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-100 text-base font-medium transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title={topic}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${color.bg}`}>
                <Icon className={`w-5 h-5 ${color.icon}`} />
              </span>
              <span className="truncate text-left">{topic}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PopularTopics; 