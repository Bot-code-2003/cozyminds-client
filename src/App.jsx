"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import { CoinProvider } from "./context/CoinContext"
import { JournalProvider } from "./context/JournalContext"
import { MailProvider } from "./context/MailContext"
import { PublicJournalsProvider } from './context/PublicJournalsContext'

// Components
import LandingPage from "./Components/Landing/LandingPage"
import JournalingAlt from "./Components/EnterJournal/JournalingAlt"
import Dashboard from "./Components/Dashboard/Dashboard"
import JournalEntry from "./Components/JournalEntry"
import JournalEntries from "./Components/Dashboard/JournalEntries"
import ProfileSettings from "./Components/ProfileSettings"
import Features from "./Components/Landing/Features"
import DetailedMoodDistributions from "./Components/Dashboard/DetailedMoodDistributions"
import CozyMindsBlog from "./Components/Landing/CozyMindsBlog"
import SiteMaster from "./SiteMaster"
import Collections from "./Components/Dashboard/Collections"
import CozyShop from "./Components/Dashboard/Shop/CozyShop"
import Privacy from "./Components/Landing/Privacy"
import Terms from "./Components/Landing/Terms"
import BlogPage from "./Components/Landing/BlogPage"
import AboutUs from "./Components/Landing/AboutUs"
import PublicJournals from "./Components/PublicJournals/PublicJournals"
import PublicJournalEntry from "./Components/PublicJournals/PublicJournalEntry"
import PublicProfile from "./Components/PublicJournals/PublicProfile"
import SubscriptionsView from "./Components/PublicJournals/SubscriptionsView"

import "./index.css"

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)

    // Listen for login event
    const handleUserLoggedIn = (event) => {
      setUser(event.detail.user)
    }
    window.addEventListener("user-logged-in", handleUserLoggedIn)

    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn)
    }
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ThemeProvider>
      <PublicJournalsProvider>
        <JournalProvider>
          <MailProvider>
            <CoinProvider>
              <div>
                <Routes>
                  <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                  <Route path="/journaling-alt" element={<JournalingAlt />} />
                  <Route path="/journal/:id" element={<JournalEntry />} />
                  <Route path="/cozyshop" element={<CozyShop />} />
                  <Route path="/journal-entries/:collection" element={<JournalEntries />} />
                  <Route path="/privacy-policy" element={<Privacy />} />
                  <Route path="/terms-of-service" element={<Terms />} />
                  <Route path="/starlitblogs" element={<CozyMindsBlog />} />
                  <Route path="/blog/:slug" element={<BlogPage />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/profile-settings" element={<ProfileSettings />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/mood-distributions" element={<DetailedMoodDistributions />} />
                  <Route path="/sitemaster" element={<SiteMaster />} />
                  <Route path="/public-journals" element={<PublicJournals />} />
                  <Route path="/public-journal/:slug" element={<PublicJournalEntry />} />
                  <Route path="/profile/:anonymousName" element={<PublicProfile />} />
                  <Route path="/subscriptions" element={<SubscriptionsView />} />
                </Routes>
              </div>
            </CoinProvider>
          </MailProvider>
        </JournalProvider>
      </PublicJournalsProvider>
    </ThemeProvider>
  )
}

export default App
