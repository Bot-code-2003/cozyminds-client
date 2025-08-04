"use client";

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { MailProvider } from "./context/MailContext";
import { PublicJournalsProvider } from "./context/PublicJournalsContext";
import { getWithExpiry, setWithExpiry } from "./utils/anonymousName";
import { PublicStoriesProvider } from "./context/PublicStoriesContext";

// Components
import LandingPage from "./Components/Landing/LandingPage";
import JournalEntry from "./Components/JournalEntry";
import ProfileSettings from "./Components/ProfileSettings";
import Privacy from "./Components/Landing/Privacy";
import Terms from "./Components/Landing/Terms";
import PublicProfile from "./Components/PublicJournals/PublicProfile";
import SubscriptionsView from "./Components/PublicJournals/SubscriptionsView";
import JournalingAlt from "./Components/EnterJournal/journaling-alt";

import "./index.css";
import StoryEntry from "./Components/StoryEntry";
import Public from "./Components/Public";
import TagEntries from "./Components/PublicJournals/TagEntries";
import AboutUs from "./Components/Landing/AboutUs";

import Footer from "./Footer";
import PublicStories from "./Components/PublicJournals/PublicStories2";
import SavedEntries from "./Components/PublicJournals/SavedEntries";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getWithExpiry("user");
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);

    // Listen for login event
    const handleUserLoggedIn = (event) => {
      setUser(event.detail.user);
    };
    window.addEventListener("user-logged-in", handleUserLoggedIn);

    // Listen for signup event
    const handleUserSignedUp = (event) => {
      setUser(event.detail.user);
    };
    window.addEventListener("user-signed-up", handleUserSignedUp);

    // Listen for logout event
    const handleUserLoggedOut = () => {
      setUser(null);
    };
    window.addEventListener("user-logged-out", handleUserLoggedOut);

    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
      window.removeEventListener("user-signed-up", handleUserSignedUp);
      window.removeEventListener("user-logged-out", handleUserLoggedOut);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider>
      <PublicJournalsProvider>
        <PublicStoriesProvider>
          <MailProvider>
            <div>
              <Routes>
                <Route
                  path="/"
                  element={
                    user ? (
                      <>
                        <Public />
                        <Footer />
                      </>
                    ) : (
                      <LandingPage />
                    )
                  }
                />
                <Route
                  path="/tag/:tag"
                  element={
                    <>
                      <TagEntries />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/part"
                  element={
                    <>
                      <PublicStories />
                      <Footer />
                    </>
                  }
                />

                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms-of-service" element={<Terms />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/saved-entries" element={<SavedEntries />} />
                <Route
                  path="/:anonymousName/:slug"
                  element={
                    <>
                      <StoryEntry />
                      <Footer />
                    </>
                  }
                />
                <Route path="/:anonymousName" element={<PublicProfile />} />

                <Route path="/subscriptions" element={<SubscriptionsView />} />
                <Route path="/journaling-alt" element={<JournalingAlt />} />

                <Route path="/aboutus" element={<AboutUs />} />
              </Routes>
            </div>
          </MailProvider>
        </PublicStoriesProvider>
      </PublicJournalsProvider>
    </ThemeProvider>
  );
};

export default App;
