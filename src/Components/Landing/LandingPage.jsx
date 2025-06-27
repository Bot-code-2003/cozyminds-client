"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  BookImage,
  Notebook,
  Clock,
  Users,
  Gift,
} from "lucide-react";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import AuthModals from "./AuthModals";
import axios from "axios";
import Home from "../../assets/home3.png";
import PublicJournalsShowcase from "./PublicJournalsShowcase";
import { getWithExpiry, setWithExpiry } from "../../utils/anonymousName";
import PublicProfileShowcase from "./PublicProfileShowcase";

const LandingPage = () => {
  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  const [animatedUserCount, setAnimatedUserCount] = useState(0);
  const [animatedJournalCount, setAnimatedJournalCount] = useState(0);
  const [isUserCountLoading, setIsUserCountLoading] = useState(true);
  const [isJournalCountLoading, setIsJournalCountLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCount, setUserCount] = useState(null);
  const [journalCount, setJournalCount] = useState(null);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Peace");
  const { darkMode, setDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);

  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  // Slot machine animation - rapidly changing numbers
  const startSlotMachineAnimation = (setterFn, maxRange = 999) => {
    const interval = setInterval(() => {
      setterFn(Math.floor(Math.random() * maxRange));
    }, 50);
    return interval;
  };

  // Smooth settle animation to final value
  const settleToFinalValue = (finalValue, setterFn, duration = 2000) => {
    const startTime = performance.now();
    const startValue = Math.floor(Math.random() * 100);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = Math.floor(
        startValue + (finalValue - startValue) * easedProgress
      );

      setterFn(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`Subscribed: ${email} to ${category}`);

    const button = e.target.querySelector("button");
    const originalText = button.innerHTML;
    button.innerHTML = "Success!";

    setTimeout(() => {
      button.innerHTML = originalText;
      setEmail("");
    }, 2000);
  };

  useEffect(() => {
    let userSlotInterval, journalSlotInterval;

    // Start slot machine animations
    userSlotInterval = startSlotMachineAnimation(setAnimatedUserCount, 500);
    journalSlotInterval = startSlotMachineAnimation(
      setAnimatedJournalCount,
      1000
    );

    // --- Caching logic for user/journal counts ---
    const CACHE_KEY = "landing_stats";
    const CACHE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days in ms
    const cached = getWithExpiry(CACHE_KEY);
    if (cached && typeof cached === 'object' && cached.userCount && cached.journalCount) {
      setUserCount(cached.userCount);
      setJournalCount(cached.journalCount);
      clearInterval(userSlotInterval);
      clearInterval(journalSlotInterval);
      setIsUserCountLoading(false);
      setIsJournalCountLoading(false);
      setTimeout(() => {
        settleToFinalValue(cached.userCount, setAnimatedUserCount, 2000);
      }, 100);
      setTimeout(() => {
        settleToFinalValue(cached.journalCount, setAnimatedJournalCount, 2000);
      }, 200);
    } else {
      const fetchCounts = async () => {
        try {
          const userRes = await API.get("/users");
          const journalRes = await API.get("/journals/journalscount");

          const userFinal = userRes.data.length + 97;
          const journalFinal = journalRes.data.count + 114;

          setUserCount(userFinal);
          setJournalCount(journalFinal);

          setWithExpiry(CACHE_KEY, { userCount: userFinal, journalCount: journalFinal }, CACHE_EXPIRY);

          clearInterval(userSlotInterval);
          clearInterval(journalSlotInterval);

          setIsUserCountLoading(false);
          setIsJournalCountLoading(false);

          setTimeout(() => {
            settleToFinalValue(userFinal, setAnimatedUserCount, 2000);
          }, 100);

          setTimeout(() => {
            settleToFinalValue(journalFinal, setAnimatedJournalCount, 2000);
          }, 200);
        } catch (err) {
          console.error("Error fetching stats:", err);

          clearInterval(userSlotInterval);
          clearInterval(journalSlotInterval);

          setIsUserCountLoading(false);
          setIsJournalCountLoading(false);

          setTimeout(() => {
            settleToFinalValue(150, setAnimatedUserCount, 2000);
          }, 100);

          setTimeout(() => {
            settleToFinalValue(300, setAnimatedJournalCount, 2000);
          }, 200);
        }
      };
      fetchCounts();
    }

    // Scroll and login event listeners
    const storedUser = getWithExpiry("user");
    if (storedUser) setUser(storedUser);

    const handleUserLogin = (event) => setUser(event.detail.user);

    window.addEventListener("user-logged-in", handleUserLogin);

    // Ensure sufficient content height for scrolling
    document.body.style.minHeight = "200vh"; // Debugging: Force scrollable content
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(userSlotInterval);
      clearInterval(journalSlotInterval);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("user-logged-in", handleUserLogin);
      document.body.style.minHeight = ""; // Clean up
    };
  }, []);

  return (
    <div
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans flex flex-col items-center relative transition-colors duration-300`}
    >
      <title>Starlit Journals - Dream, Write, Track Moods</title>
      <meta
        name="description"
        content="Write with a rich text editor, track moods, tag entries, and earn coins for custom backgrounds and fun mail templates in Starlit Journals!"
      />
      <meta
        name="keywords"
        content="journaling app, mood tracker, creative writing, rich text editor, gamified journaling, mental health, self-expression, journal backgrounds"
      />
      <meta name="author" content="Starlit Journals Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none ">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black dark:border-white"
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-black dark:border-white"
            ></div>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <Navbar
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />

      {/* Header */}
      <header className="w-full max-w-6xl mt-32 mb-30 px-4 sm:px-8 z-[99]">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-6 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-sm font-medium tracking-wider rounded-full bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm">
              GAMIFIED
            </div>
            <h1 className="text-4xl md:text-hero font-bold tracking-tight mb-8 leading-tight">
              <span className="relative">
                Unleash Your Thoughts with Starlit Journals!
                <svg
                  className="absolute -bottom-3 left-0 w-full h-2 text-[#5999a8] dark:text-[#5999a8]"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl opacity-80 font-medium sm:max-w-xl leading-relaxed">
              Write, Track Moods, and Earn Rewards in a Fun, Creative Space.
            </p>
            <div className="mt-10">
              <button
                className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:bg-[var(--accent-hover)] transition-all duration-500 ease-in-out font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] inline-flex items-center gap-3 w-full sm:w-fit"
                onClick={openLoginModal}
                aria-label="Begin your journaling journey"
              >
                <span className="flex items-center gap-2">
                  Start Free – Get 50 Coins!
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-500 ease-in-out group-hover:translate-x-1"
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-square w-full max-w-md mx-auto relative">
              <div className="absolute inset-0 rounded-2xl bg-[#5999a8]/20 dark:bg-[#5999a8]/10 -rotate-3 transform"></div>
              <div className="absolute inset-0 border-2 rounded-2xl border-[#1A1A1A] dark:border-[#F8F1E9] rotate-3 transform"></div>
              <div className="absolute inset-0 rounded-2xl bg-[#5999a8]/20 dark:bg-[#5999a8]/10 rotate-6 transform"></div>
              <div className="relative z-10 rounded-2xl w-full h-full border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-white dark:bg-[#2A2A2A] flex items-center justify-center">
                <img
                  src={Home || "/placeholder.svg"}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Cozy journaling space - Starlit Journals"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F8F1E9] dark:bg-[#1A1A1A] z-20 flex items-center justify-center">
                <span className="text-2xl font-bold">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center max-w-7xl">
        {/* Stats Section */}
        <section
          className="w-full px-1 sm:px-6 sm:pb-16"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">
            User Statistics
          </h2>
          <div className="border-2 rounded-2xl border-[#1A1A1A] dark:border-[#F8F1E9]">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  number: animatedUserCount,
                  isLoading: isUserCountLoading,
                  label: "Creative Writers",
                  icon: <Users size={28} />,
                  description:
                    "Join our growing community of mindful journalers",
                },
                {
                  number: animatedJournalCount,
                  isLoading: isJournalCountLoading,
                  label: "Heartfelt Entries",
                  icon: <Notebook size={28} />,
                  description: "Total journal entries created by our community",
                },
                {
                  number: "1 Entry",
                  isLoading: false,
                  label: "Daily Writing Goal",
                  icon: <Clock size={28} />,
                  description: "Write one entry a day to build your habit!",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-8 ${
                    index !== 2
                      ? "border-b md:border-b-0 md:border-r"
                      : "border-b md:border-b-0"
                  } border-[#1A1A1A] dark:border-[#F8F1E9] ${
                    index === 1 ? "bg-[#5999a8]/10 dark:bg-[#5999a8]/5" : ""
                  }`}
                >
                  <div className="mb-4 rounded-2xl p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] inline-block">
                    {stat.icon}
                  </div>
                  <div
                    className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      stat.isLoading ? "text-[#5999a8] animate-pulse" : ""
                    }`}
                  >
                    {typeof stat.number === "number"
                      ? stat.number.toLocaleString()
                      : stat.number}
                  </div>
                  <p className="text-lg font-medium mb-2">{stat.label}</p>
                  <p className="text-sm opacity-70">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features
          setShowLoginModal={openLoginModal}
          setShowSignupModal={openSignupModal}
        />

        {/* Public Journals Showcase */}
        <PublicJournalsShowcase />

        <PublicProfileShowcase />

        {/* How It Works Section */}
        {/* <HowItWorks setShowLoginModal={openLoginModal} /> */}
      </main>

      {/* Testimonials */}
      <Testimonials darkMode={darkMode} />

      {/* Footer + CTA Section */}
      <Footer darkMode={darkMode} setShowLoginModal={openLoginModal} />

      {/* Auth Modals */}
      {modals}
    </div>
  );
};

export default LandingPage;