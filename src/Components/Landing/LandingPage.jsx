"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Smile, Clock, Users, X, Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import axios from "axios";
import Home from "../../assets/home3.png";
import Signin from "../../assets/signin.png";
import Signup from "../../assets/signup.png";

const LandingPage = () => {
  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Peace");
  const { darkMode, setDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState(null);

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    nickname: "",
    email: "",
    password: "",
    verifyPassword: "",
    age: "",
    gender: "",
    subscribe: false,
  });
  const [signupError, setSignupError] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Check if passwords match
  useEffect(() => {
    if (signupForm.verifyPassword || signupForm.password) {
      setPasswordMatch(signupForm.password === signupForm.verifyPassword);
    }
  }, [signupForm.password, signupForm.verifyPassword]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Subscribed: ${email} to ${category}`);

    // Show success message
    const button = e.target.querySelector("button");
    const originalText = button.innerHTML;
    button.innerHTML = "Success!";

    setTimeout(() => {
      button.innerHTML = originalText;
      setEmail("");
    }, 2000);
  };

  // Login form handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await API.post("/login", loginForm);
      const { user, coinsEarned } = res.data;

      console.log("Login successful, coins earned:", coinsEarned);

      const coinsEarnedNum = Number.parseInt(coinsEarned || 0, 10);

      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(
        new CustomEvent("user-logged-in", {
          detail: {
            user,
            coinsEarned: coinsEarnedNum,
          },
        })
      );

      setShowLoginModal(false);
      window.location.href = "/"; // Refresh to show dashboard
    } catch (err) {
      setLoginError(err?.response?.data?.message || "Login failed. Try again.");
    }
  };

  // Signup form handlers
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (signupForm.password !== signupForm.verifyPassword) {
      setPasswordMatch(false);
      setSignupError("Passwords do not match. Please try again.");
      return;
    }

    try {
      const { verifyPassword, ...formDataToSend } = signupForm;

      const res = await API.post("/signup", formDataToSend);
      const user = res.data.user;
      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      setShowSignupModal(false);
      window.location.href = "/"; // Refresh to show dashboard
    } catch (err) {
      setSignupError(
        err?.response?.data?.message || "Signup failed. Try again."
      );
    }
  };

  // Handle scroll effect and user count
  useEffect(() => {
    const numOfUsers = async () => {
      try {
        const response = await API.get("/users");
        console.log("Number of users:", response.data.users);
        setUserCount(response.data.users);
      } catch (err) {
        console.error("Error fetching user count:", err);
      }
    };
    numOfUsers();

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Stored User:", storedUser);

    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open login modal
  const openLoginModal = (e) => {
    e.preventDefault();
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  // Open signup modal
  const openSignupModal = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  return (
    <div
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans flex flex-col items-center relative overflow-hidden transition-colors duration-300`}
    >
      {/* SEO Metadata */}
      <title>Cozy Minds - Guided Journaling for Mental Wellness</title>
      <meta
        name="description"
        content="Cozy Minds offers a minimalist approach to mental wellness through guided journaling and mindfulness practices. Start your journey to clarity today."
      />
      <meta
        name="keywords"
        content="mental wellness, guided journaling, mindfulness, mental health, self-care, meditation"
      />
      <meta name="author" content="Cozy Minds Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* Open Graph Tags */}
      <meta
        property="og:title"
        content="Cozy Minds - Guided Journaling for Mental Wellness"
      />
      <meta
        property="og:description"
        content="Join Cozy Minds for a minimalist approach to mental wellness with guided journaling and mindfulness practices."
      />
      <meta property="og:image" content={Home} />
      <meta property="og:url" content="https://yourwebsite.com" />
      <meta property="og:type" content="website" />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Cozy Minds - Guided Journaling for Mental Wellness"
      />
      <meta
        name="twitter:description"
        content="Discover mental clarity with Cozy Minds' guided journaling and mindfulness tools."
      />
      <meta name="twitter:image" content={Home} />
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Cozy Minds",
          url: "https://cozyminds.vercel.app",
          description:
            "A platform for mental wellness through guided journaling and mindfulness.",
          publisher: {
            "@type": "Organization",
            name: "Cozy Minds Team",
            logo: {
              "@type": "ImageObject",
              url: Home,
            },
          },
          potentialAction: {
            "@type": "SearchAction",
            target: "https://yourwebsite.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}
      </script>

      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
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
        user={user}
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openLoginModal={openLoginModal}
      />

      {/* Header */}
      <header className="z-10 w-full max-w-6xl mt-24 mb-16 px-1 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
              MENTAL CLARITY
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="relative">
                Cozy <span className="text-[#5999a8]">Minds</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-[#5999a8] dark:text-[#5999a8]"
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
            <p className="mt-4 text-lg md:text-xl opacity-80 font-medium sm:max-w-xl">
              Clarity starts here — sharp and simple. A minimalist approach to
              mental wellness through guided journaling and mindfulness.
            </p>
            <div className="mt-10">
              <button
                className={`px-6 py-3 ${
                  darkMode
                    ? "bg-[#5999a8] text-white"
                    : "bg-[#1A1A1A] text-white"
                } hover:opacity-90 transition-opacity w-full sm:w-fit rounded-md flex items-center gap-2 group border-2 border-transparent`}
                onClick={openLoginModal}
                aria-label="Begin your mental wellness journey"
              >
                <span className="flex items-center gap-2">
                  Begin your Journey
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
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
                  alt="Cozy Minds app interface showing guided journaling"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F8F1E9] dark:bg-[#1A1A1A] z-20 flex items-center justify-center">
                <span className="text-sm font-bold">Find Peace</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-24 max-w-7xl">
        {/* Stats Section */}
        <section
          className="w-full px-1 sm:px-6"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">
            User Statistics
          </h2>
          <div className="border-2 rounded-2xl border-[#1A1A1A] dark:border-[#F8F1E9]">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  number: userCount || 1250,
                  label: "Active Users",
                  icon: <Users size={28} />,
                  description:
                    "Join our growing community of mindful individuals",
                },
                {
                  number: "89%",
                  label: "Feel Calmer After Journaling",
                  icon: <Smile size={28} />,
                  description: "Based on our user satisfaction surveys",
                },
                {
                  number: "5 mins",
                  label: "To a More Peaceful Mind",
                  icon: <Clock size={28} />,
                  description:
                    "That's all it takes to start your daily practice",
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
                  <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                  <p className="text-lg font-medium mb-2">{stat.label}</p>
                  <p className="text-sm opacity-70">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks setShowLoginModal={setShowLoginModal} />
      </main>

      {/* Testimonials */}
      <Testimonials darkMode={darkMode} />

      {/* Footer + CTA Section */}
      <Footer darkMode={darkMode} setShowLoginModal={setShowLoginModal} />

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-4xl bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-[var(--accent)] z-10 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Close login modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Background Image Section */}
              <div
                className="flex-1 p-6 lg:p-8 flex items-center justify-center relative min-h-[200px] lg:min-h-[500px]"
                style={{
                  backgroundImage: `url(${Signin})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute inset-0 bg-black/40"
                  aria-hidden="true"
                ></div>
                <div className="text-center relative z-10">
                  <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
                    Back for another chapter?
                  </h2>
                  <p className="text-base lg:text-lg text-gray-200">
                    Let's keep the story going.
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 p-6 lg:p-8 flex items-center">
                <div className="w-full max-w-md mx-auto">
                  <form
                    onSubmit={handleLoginSubmit}
                    className="w-full space-y-4"
                    aria-labelledby="login-form-heading"
                  >
                    <h2 id="login-form-heading" className="sr-only">
                      Login Form
                    </h2>
                    {loginError && (
                      <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        {loginError}
                      </div>
                    )}

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                      className="w-full rounded-lg p-3 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      aria-label="Email address"
                    />

                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                        className="w-full rounded-lg p-3 pr-12 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)] hover:opacity-70 transition-opacity"
                        aria-label={
                          showLoginPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                      Important: Remember your email and password. If you forget
                      them, you'll need to contact the developer to recover your
                      account.
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition-all font-medium"
                      aria-label="Sign in to your account"
                    >
                      Sign In
                    </button>

                    <p className="text-sm text-center mt-4">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        onClick={openSignupModal}
                        className="text-[var(--accent)] underline hover:no-underline transition-all"
                        aria-label="Open signup modal"
                      >
                        Sign Up
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50 p-4">
          <div className="w-full max-w-5xl bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 p-2 text-[var(--accent)] z-10 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Close signup modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Background Image Section */}
              <div
                className="flex-1 p-6 lg:p-8 flex items-center justify-center relative min-h-[200px] lg:min-h-[600px]"
                style={{
                  backgroundImage: `url(${Signup})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute inset-0 bg-black/40"
                  aria-hidden="true"
                ></div>
                <div className="text-center relative z-10">
                  <h2 className="text-2xl lg:text-4xl font-bold text-gray-200 mb-2 lg:mb-4">
                    Hello, new friend
                  </h2>
                  <p className="text-base lg:text-lg text-gray-400">
                    Let's start writing your story, one page at a time.
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 p-6 lg:p-8 flex items-center">
                <div className="w-full max-w-md mx-auto">
                  <form
                    onSubmit={handleSignupSubmit}
                    className="w-full space-y-4"
                    aria-labelledby="signup-form-heading"
                  >
                    <h2 id="signup-form-heading" className="sr-only">
                      Signup Form
                    </h2>
                    {signupError && (
                      <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        {signupError}
                      </div>
                    )}

                    <input
                      type="text"
                      name="nickname"
                      placeholder="Nickname"
                      value={signupForm.nickname}
                      onChange={handleSignupChange}
                      required
                      className="w-full rounded-lg p-3 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      aria-label="Nickname"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      required
                      className="w-full rounded-lg p-3 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      aria-label="Email address"
                    />

                    <div className="flex flex-col sm:flex-row w-full gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          required
                          className="w-full rounded-lg p-3 pr-12 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                          aria-label="Password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)] hover:opacity-70 transition-opacity"
                          aria-label={
                            showSignupPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showSignupPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <div className="relative flex-1">
                        <input
                          type={showVerifyPassword ? "text" : "password"}
                          name="verifyPassword"
                          placeholder="Verify Password"
                          value={signupForm.verifyPassword}
                          onChange={handleSignupChange}
                          required
                          className={`w-full p-3 pr-12 border ${
                            signupForm.verifyPassword && !passwordMatch
                              ? "border-red-500 focus:ring-red-500"
                              : "border-[var(--border)] focus:ring-[var(--accent)]"
                          } bg-transparent rounded-lg focus:outline-none focus:ring-2 transition-all`}
                          aria-label="Verify password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowVerifyPassword(!showVerifyPassword)
                          }
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)] hover:opacity-70 transition-opacity"
                          aria-label={
                            showVerifyPassword
                              ? "Hide verify password"
                              : "Show verify password"
                          }
                        >
                          {showVerifyPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {signupForm.verifyPassword && !passwordMatch && (
                      <div className="text-red-500 text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        Passwords do not match
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row w-full gap-2">
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={signupForm.age}
                        onChange={handleSignupChange}
                        required
                        min="13"
                        className="flex-1 rounded-lg p-3 border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        aria-label="Age"
                      />

                      <select
                        name="gender"
                        value={signupForm.gender}
                        onChange={handleSignupChange}
                        required
                        className="flex-1 rounded-lg p-3 border border-[var(--border)] text-[var(--text-primary)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        aria-label="Gender"
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                      Important: Remember your email and password. If you forget
                      them, you'll need to contact the developer to recover your
                      account.
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={signupForm.verifyPassword && !passwordMatch}
                      aria-label="Create your account"
                    >
                      Create Account
                    </button>

                    <p className="text-sm text-center mt-4">
                      Already have an account?{" "}
                      <a
                        href="#"
                        onClick={openLoginModal}
                        className="text-[var(--accent)] underline hover:no-underline transition-all"
                        aria-label="Open login modal"
                      >
                        Log In
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
        }

        .dark .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.05);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
