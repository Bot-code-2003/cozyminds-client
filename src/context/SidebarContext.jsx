import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [popularWriters, setPopularWriters] = useState([]);
    const [trendingJournals, setTrendingJournals] = useState([]);
    const [topMoodPosts, setTopMoodPosts] = useState({});
    const [activeDiscussions, setActiveDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                topicsRes,
                writersRes,
                trendingJournalsRes,
                topMoodPostsRes,
                activeDiscussionsRes
            ] = await Promise.all([
                API.get('/popular-topics?limit=8').catch(e => e.response),
                API.get('/popular-writers?limit=6').catch(e => e.response),
                API.get('/trending-journals?limit=8').catch(e => e.response),
                API.get('/journals/top-by-mood').catch(e => e.response),
                API.get('/journals/with-comments?sort=-activityScore&limit=7').catch(e => e.response),
            ]);
            
            setTrendingTopics(topicsRes.data?.popularTopics || []);
            setPopularWriters(writersRes.data?.popularWriters || []);
            setTrendingJournals(trendingJournalsRes.data?.trendingJournals || []);
            setTopMoodPosts(topMoodPostsRes.data || {});
            setActiveDiscussions(activeDiscussionsRes.data?.journals || []);

        } catch (err) {
            setError('Failed to load sidebar data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const value = {
        trendingTopics,
        popularWriters,
        trendingJournals,
        topMoodPosts,
        activeDiscussions,
        loading,
        error,
        refreshSidebar: fetchData,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}; 