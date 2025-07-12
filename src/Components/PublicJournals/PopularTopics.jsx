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

const PopularTopics = ({ onTopicClick, type = 'journal' }) => {
  const topics = type === 'story' ? STORY_TOPICS : JOURNAL_TOPICS;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl">
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => {
          const Icon = topicIcons[topic] || Tag;
          return (
            <button
              key={topic}
              onClick={() => onTopicClick && onTopicClick(topic)}
              className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/60 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-100 text-base font-medium transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title={topic}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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