"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import { JournalProvider } from "./context/JournalContext"
import { MailProvider } from "./context/MailContext"
import { PublicJournalsProvider } from './context/PublicJournalsContext'
import { SidebarProvider } from './context/SidebarContext'
import { getWithExpiry, setWithExpiry } from "./utils/anonymousName"
import { PublicStoriesProvider } from './context/PublicStoriesContext';

// Components
import LandingPage from "./Components/Landing/LandingPage"
import Dashboard from "./Components/Dashboard/Dashboard"
import JournalEntry from "./Components/JournalEntry"
import JournalEntries from "./Components/Dashboard/JournalEntries"
import ProfileSettings from "./Components/ProfileSettings"
import SiteMaster from "./SiteMaster"
import Collections from "./Components/Dashboard/Collections"
import Privacy from "./Components/Landing/Privacy"
import Terms from "./Components/Landing/Terms"
import AboutUs from "./Components/Landing/AboutUs"
import PublicJournals from "./Components/PublicJournals/PublicJournals"
import PublicProfile from "./Components/PublicJournals/PublicProfile"
import SubscriptionsView from "./Components/PublicJournals/SubscriptionsView"
import SavedEntries from "./Components/PublicJournals/SavedEntries"
import JournalingAlt from "./Components/EnterJournal/journaling-alt"

import "./index.css"
import StoryEntry from "./Components/StoryEntry"
import PublicStories from "./Components/PublicJournals/PublicStories"

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getWithExpiry("user")
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)

    // Listen for login event
    const handleUserLoggedIn = (event) => {
      setUser(event.detail.user)
    }
    window.addEventListener("user-logged-in", handleUserLoggedIn)

    // Listen for signup event
    const handleUserSignedUp = (event) => {
      setUser(event.detail.user)
    }
    window.addEventListener("user-signed-up", handleUserSignedUp)

    // Listen for logout event
    const handleUserLoggedOut = () => {
      setUser(null)
    }
    window.addEventListener("user-logged-out", handleUserLoggedOut)

    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn)
      window.removeEventListener("user-signed-up", handleUserSignedUp)
      window.removeEventListener("user-logged-out", handleUserLoggedOut)
    }
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ThemeProvider>
      <PublicJournalsProvider>
        <PublicStoriesProvider>
          <SidebarProvider>
            <JournalProvider>
              <MailProvider>
                <div>
                  <Routes>
                    <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/journal/:id" element={<JournalEntry />} />
                    <Route path="/journal-entries/:collection" element={<JournalEntries />} />
                    <Route path="/privacy-policy" element={<Privacy />} />
                    <Route path="/terms-of-service" element={<Terms />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/profile-settings" element={<ProfileSettings />} />
                    <Route path="/sitemaster" element={<SiteMaster />} />
                    <Route path="/journals" element={<PublicJournals />} />
                    <Route path="/stories" element={<PublicStories />} />
                    <Route path="/journals/:anonymousName/:slug" element={<JournalEntry />} />
                    <Route path="/stories/:anonymousName/:slug" element={<StoryEntry />} />
                    <Route path="/profile/id/:userId" element={<PublicProfile />} />
                    <Route path="/profile/:anonymousName" element={<PublicProfile />} />
                    <Route path="/subscriptions" element={<SubscriptionsView />} />
                    <Route path="/saved-entries" element={<SavedEntries />} />
                    <Route path="/journaling-alt" element={<JournalingAlt />} />
                  </Routes>
                </div>
              </MailProvider>
            </JournalProvider>
          </SidebarProvider>
        </PublicStoriesProvider>
      </PublicJournalsProvider>
    </ThemeProvider>
  )
}

export default App
