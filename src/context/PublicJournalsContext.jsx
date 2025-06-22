import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const PublicJournalsContext = createContext();

export function PublicJournalsProvider({ children }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [likedJournals, setLikedJournals] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState('-createdAt');
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [singleJournalLoading, setSingleJournalLoading] = useState(false);
  const [singleJournalError, setSingleJournalError] = useState(null);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);

  const fetchJournals = useCallback(async (pageNum, currentFeedType = feedType, append = false) => {
    if (hasInitialFetch && pageNum === 1 && !append && currentFeedType === feedType) {
      return;
    }

    try {
      setLoading(!append);
      setLoadingMore(append);
      setError(null);

      let response;
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      const params = {
        page: pageNum,
        limit: 20,
        sort: currentFeedType,
      };

      if (showFollowingOnly && user) {
        response = await API.get(`/feed/${user._id}`, { params });
      } else {
        response = await API.get("/journals/public", { params });
      }

      const { journals: newJournals, hasMore: moreAvailable } = response.data;
      
      setJournals(prev => append ? [...prev, ...newJournals] : newJournals);
      setHasMore(moreAvailable);
      setPage(pageNum);
      setHasInitialFetch(true);
      setFeedType(currentFeedType);

      if (user) {
        const likedSet = new Set(
          newJournals
            .filter((journal) => journal.likes?.includes(user._id))
            .map((journal) => journal._id)
        );
        setLikedJournals(prev => append ? new Set([...prev, ...likedSet]) : likedSet);
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
      setError("Failed to fetch journals. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [feedType, hasInitialFetch, showFollowingOnly]);

  const fetchSingleJournalBySlug = useCallback(async (slug) => {
    const existingJournal = journals.find(journal => journal.slug === slug);
    if (existingJournal) {
      return existingJournal;
    }

    try {
      setSingleJournalLoading(true);
      setSingleJournalError(null);
      const response = await API.get(`/journals/singlepublic/${slug}`);
      const fetchedJournal = response.data;

      setJournals(prevJournals => {
        if (!prevJournals.some(j => j.slug === fetchedJournal.slug)) {
          return [...prevJournals, fetchedJournal];
        }
        return prevJournals;
      });

      return fetchedJournal;
    } catch (error) {
      console.error("Error fetching single public journal:", error);
      setSingleJournalError(error.response?.data?.message || "Failed to fetch single journal.");
      throw error;
    } finally {
      setSingleJournalLoading(false);
    }
  }, [journals]);

  const handleLike = useCallback(async (journal) => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      // Handle not logged in case if needed
      return;
    }
    const user = JSON.parse(userData);
    const journalId = journal._id;
    const currentIsLiked = likedJournals.has(journalId);

    // Optimistic update
    setLikedJournals(prev => {
      const newSet = new Set(prev);
      if (currentIsLiked) {
        newSet.delete(journalId);
      } else {
        newSet.add(journalId);
      }
      return newSet;
    });
    setJournals(prevJournals => 
      prevJournals.map(j => 
        j._id === journalId 
          ? { ...j, likeCount: j.likeCount + (currentIsLiked ? -1 : 1) }
          : j
      )
    );

    try {
      await API.post(`/journals/${journalId}/like`, { userId: user._id });
    } catch (error) {
      // Revert optimistic update on error
      setLikedJournals(prev => {
        const newSet = new Set(prev);
        if (currentIsLiked) {
          newSet.add(journalId);
        } else {
          newSet.delete(journalId);
        }
        return newSet;
      });
      setJournals(prevJournals => 
        prevJournals.map(j => 
          j._id === journalId 
            ? { ...j, likeCount: j.likeCount + (currentIsLiked ? 1 : -1) }
            : j
        )
      );
      console.error("Error liking journal:", error);
    }
  }, [likedJournals]);

  const handleFeedTypeChange = useCallback((newFeedType) => {
    if (newFeedType !== feedType) {
      fetchJournals(1, newFeedType, false);
    }
  }, [feedType, fetchJournals]);

  const toggleFollowingOnly = useCallback(() => {
    const newShowFollowingOnly = !showFollowingOnly;
    setShowFollowingOnly(newShowFollowingOnly);
    fetchJournals(1, feedType, false);
  }, [showFollowingOnly, feedType, fetchJournals]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchJournals(page + 1, feedType, true);
    }
  }, [page, hasMore, loadingMore, feedType, fetchJournals]);

  const value = {
    journals,
    loading,
    loadingMore,
    error,
    likedJournals,
    hasMore,
    feedType,
    showFollowingOnly,
    fetchJournals,
    handleLike,
    handleFeedTypeChange,
    toggleFollowingOnly,
    loadMore,
    fetchSingleJournalBySlug,
    singleJournalLoading,
    singleJournalError,
  };

  return (
    <PublicJournalsContext.Provider value={value}>
      {children}
    </PublicJournalsContext.Provider>
  );
}

export function usePublicJournals() {
  const context = useContext(PublicJournalsContext);
  if (context === undefined) {
    throw new Error('usePublicJournals must be used within a PublicJournalsProvider');
  }
  return context;
}