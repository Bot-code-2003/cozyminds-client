"use client";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, memo } from "react";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
} from "@dicebear/collection";

const avatarStyles = {
  avataaars,
  bottts,
  funEmoji,
  miniavs,
  croodles,
  micah,
  pixelArt,
  adventurer,
  bigEars,
  bigSmile,
  lorelei,
  openPeeps,
  personas,
  rings,
  shapes,
  thumbs,
};

const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const RecommendationCard = memo(({ journal }) => {
  const [authorProfile, setAuthorProfile] = useState(journal.userId || null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const getThumbnail = useCallback(() => {
    if (!journal.content || imageError) return null;
    if (journal.thumbnail) {
      try {
        new URL(journal.thumbnail);
        return journal.thumbnail;
      } catch {
        return null;
      }
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(journal.content, "text/html");
    const img = doc.querySelector("img[src]");
    if (img?.src) {
      try {
        new URL(img.src);
        return img.src;
      } catch {
        return null;
      }
    }
    return null;
  }, [journal.thumbnail, journal.content, imageError]);

  const thumbnail = getThumbnail();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        if (
          journal.userId &&
          typeof journal.userId === "object" &&
          journal.userId !== null
        ) {
          setAuthorProfile(journal.userId);
        } else if (journal.userId) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/user/${journal.userId}`,
            { signal: AbortSignal.timeout(5000) }
          );
          const data = await res.json();
          setAuthorProfile(data.user || null);
        } else {
          setAuthorProfile(null);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
        setAuthorProfile(null);
      }
    };
    fetchAuthor();
  }, [journal.userId]);

  const handleAuthorClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (authorProfile?._id) {
        navigate(`/profile/id/${authorProfile._id}`);
      }
    },
    [navigate, authorProfile]
  );

  return (
    <article
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      role="article"
      onClick={() => scrollTo(0, 0)}
      aria-labelledby={`recommendation-${journal._id}`}
    >
      <Link
        to={`/${authorProfile?.anonymousName || "anonymous"}/${journal.slug}`}
        className="block"
        aria-label={`Read journal: ${journal.title}`}
      >
        {thumbnail && (
          <div className="relative w-full h-40 sm:h-48">
            <img
              src={thumbnail}
              alt={`Thumbnail for ${journal.title}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        )}
        <div className="p-3 sm:p-4">
          {authorProfile && (
            <button
              onClick={handleAuthorClick}
              className="flex items-center gap-2 mb-2 focus:outline-none focus:underline"
              aria-label={`View profile of ${
                authorProfile.anonymousName || "Anonymous"
              }`}
            >
              <img
                src={getAvatarSvg(
                  authorProfile?.profileTheme?.avatarStyle || "avataaars",
                  authorProfile?.anonymousName || "Anonymous"
                )}
                alt={`Avatar of ${authorProfile.anonymousName || "Anonymous"}`}
                className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                loading="lazy"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[200px]">
                {authorProfile.anonymousName || "Anonymous"}
              </span>
            </button>
          )}
          <h3
            id={`recommendation-${journal._id}`}
            className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1"
          >
            {journal.title}
          </h3>
          {journal.metaDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {journal.metaDescription}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
});

RecommendationCard.displayName = "RecommendationCard";

export default RecommendationCard;
