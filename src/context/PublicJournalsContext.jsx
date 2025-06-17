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
  const [feedType, setFeedType] = useState('recent');
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [singleJournalLoading, setSingleJournalLoading] = useState(false);
  const [singleJournalError, setSingleJournalError] = useState(null);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);

  const fetchJournals = useCallback(async (pageNum, append = false) => {
    console.log(`fetchJournals called: pageNum=${pageNum}, append=${append}, hasInitialFetch=${hasInitialFetch}, feedType=${feedType}, showFollowingOnly=${showFollowingOnly}`);
    // If we already have journals and this is the first page, don't fetch again
    if (hasInitialFetch && pageNum === 1 && !append) {
      console.log("Preventing re-fetch due to hasInitialFetch.");
      return;
    }

    try {
      setLoading(!append);
      setLoadingMore(append);
      setError(null);

      let response;
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (showFollowingOnly && user) {
        response = await API.get(`/feed/${user._id}`, {
          params: { page: pageNum, limit: 10 },
        });
      } else {
        response = await API.get("/journals/public", {
          params: { 
            page: pageNum, 
            limit: 10, 
            sort: feedType === 'most-liked' ? 'likeCount' : feedType === 'oldest' ? 'createdAt' : '-createdAt'
          },
        });
      }

      const { journals: newJournals, hasMore: moreAvailable } = response.data;
      
      setJournals(prev => append ? [...prev, ...newJournals] : newJournals);
      setHasMore(moreAvailable);
      setPage(pageNum);
      setHasInitialFetch(true);

      // Update liked journals if user is logged in
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
      console.log(`Journal with slug ${slug} found in PublicJournalsContext. Returning cached version.`);
      return existingJournal;
    }

    try {
      setSingleJournalLoading(true);
      setSingleJournalError(null);
      console.log(`Fetching single public journal with slug: ${slug}`);
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

  const handleLike = useCallback(async (journalId) => {
    const userData = sessionStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user) {
      throw new Error("User not logged in");
    }

    try {
      const response = await API.post(`/journals/${journalId}/like`, {
        userId: user._id,
      });

      setJournals(prev => 
        prev.map((journal) =>
          journal._id === journalId
            ? {
                ...journal,
                likes: response.data.isLiked
                  ? [...journal.likes, user._id]
                  : journal.likes.filter((id) => id !== user._id),
                likeCount: response.data.likeCount,
              }
            : journal
        )
      );

      setLikedJournals(prev => {
        const newSet = new Set(prev);
        if (response.data.isLiked) {
          newSet.add(journalId);
        } else {
          newSet.delete(journalId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error liking journal:", error);
      throw error;
    }
  }, []);

  const handleFeedTypeChange = useCallback((type) => {
    setFeedType(type);
    setPage(1);
    setJournals([]);
    setHasMore(true);
    setHasInitialFetch(false);
    fetchJournals(1);
  }, [fetchJournals]);

  const toggleFollowingOnly = useCallback(() => {
    setShowFollowingOnly(prev => !prev);
    setPage(1);
    setJournals([]);
    setHasMore(true);
    setHasInitialFetch(false);
    fetchJournals(1);
  }, [fetchJournals]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    fetchJournals(nextPage, true);
  }, [page, fetchJournals]);

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