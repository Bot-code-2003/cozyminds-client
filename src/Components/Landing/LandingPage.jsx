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

const LandingPage = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
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

      // Make sure coinsEarned is a number
      const coinsEarnedNum = Number.parseInt(coinsEarned || 0, 10);

      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Dispatch the login event with coinsEarned detail
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

    // Check if passwords match before submitting
    if (signupForm.password !== signupForm.verifyPassword) {
      setPasswordMatch(false);
      setSignupError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Remove verifyPassword from the data sent to API
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

  // Handle scroll effect
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

  // Open login modal instead of navigating
  const openLoginModal = (e) => {
    e.preventDefault();
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  // Open signup modal instead of navigating
  const openSignupModal = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  return (
    <div
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans flex flex-col items-center relative overflow-hidden transition-colors duration-300`}
    >
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

      {/* SVG Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10 dark:opacity-5">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
          <rect
            x="40"
            y="40"
            width="40"
            height="40"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 opacity-10 dark:opacity-5">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="75"
            cy="75"
            r="50"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
          <circle
            cx="75"
            cy="75"
            r="25"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute top-1/3 right-1/4 opacity-10 dark:opacity-5">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 50H90M50 10V90"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Modified Navbar - Pass openLoginModal function */}
      <Navbar
        user={user}
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openLoginModal={openLoginModal}
      />

      {/* Header - Improved */}
      <header className="z-10 w-full max-w-6xl mt-24 mb-16 px-6">
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
            <p className="mt-4 text-lg md:text-xl opacity-80 font-medium max-w-xl">
              Clarity starts here — sharp and simple. A minimalist approach to
              mental wellness through guided journaling and mindfulness.
            </p>
            <div className="mt-10 ">
              <button
                className={`px-6 py-3 ${
                  darkMode
                    ? "bg-[#5999a8] text-white"
                    : "bg-[#1A1A1A] text-white"
                } hover:opacity-90 transition-opacity flex items-center gap-2 group border-2 border-transparent`}
                onClick={openLoginModal}
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
              {/* Decorative layers */}
              <div className="absolute inset-0 bg-[#5999a8]/20 dark:bg-[#5999a8]/10 -rotate-3 transform"></div>
              <div className="absolute inset-0 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rotate-3 transform"></div>
              <div className="absolute inset-0 bg-[#5999a8]/20 dark:bg-[#5999a8]/10 rotate-6 transform"></div>

              {/* Main image placeholder - replace with your actual image */}
              <div className="relative z-10 w-full h-full border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-white dark:bg-[#2A2A2A] flex items-center justify-center">
                <img
                  src={Home || "/placeholder.svg"}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F8F1E9] dark:bg-[#1A1A1A] z-20 flex items-center justify-center">
                <span className="text-sm font-bold">Find Peace</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-24 max-w-7xl">
        {/* Stats Section - Improved */}
        <div className="w-full px-6">
          <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9]">
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
                  <div className="mb-4 p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] inline-block">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg font-medium mb-2">{stat.label}</div>
                  <div className="text-sm opacity-70">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
          className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-[var(--accent)]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
              {loginError && (
                <div className="text-red-500 text-sm">{loginError}</div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
              />

              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)]"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-xs text-amber-500 font-medium">
                Important: Remember your email and password. If you forget them,
                you'll need to contact the developer to recover your account.
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition"
              >
                Sign In
              </button>

              <p className="text-sm text-center mt-4">
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={openSignupModal}
                  className="text-[var(--accent)] underline"
                >
                  Sign Up
                </a>
              </p>
            </form>

            {/* Cozy Geometric Pattern */}
            <div className="mt-8 w-full border-t border-[var(--border)] pt-4">
              <svg viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
                {/* Sky background */}
                <rect width="800" height="150" fill="#e6f7ff" />

                {/* Mountains */}
                <polygon
                  points="0,150 100,80 150,120 250,60 350,110 450,50 600,130 700,70 800,120 800,150"
                  fill="#a2d7dd"
                />
                <polygon
                  points="0,150 50,100 150,130 250,90 400,140 500,80 600,140 750,90 800,130 800,150"
                  fill="#86c5d0"
                />

                {/* Ground */}
                <rect y="130" width="800" height="20" fill="#b3e6b3" />

                {/* Geometric trees */}
                <g>
                  {/* Tree 1 */}
                  <rect x="50" y="90" width="10" height="40" fill="#5d4037" />
                  <polygon points="35,90 75,90 55,60" fill="#66bb6a" />
                  <polygon points="40,70 70,70 55,40" fill="#81c784" />
                </g>

                <g>
                  {/* Tree 2 */}
                  <rect x="150" y="100" width="8" height="30" fill="#5d4037" />
                  <polygon points="136,100 172,100 154,80" fill="#66bb6a" />
                  <polygon points="140,85 168,85 154,65" fill="#81c784" />
                  <polygon points="144,70 164,70 154,55" fill="#a5d6a7" />
                </g>

                <g>
                  {/* Tree 3 */}
                  <rect x="700" y="95" width="10" height="35" fill="#5d4037" />
                  <polygon points="685,95 725,95 705,75" fill="#66bb6a" />
                  <polygon points="690,80 720,80 705,60" fill="#81c784" />
                  <polygon points="695,65 715,65 705,45" fill="#a5d6a7" />
                </g>

                {/* Geometric house */}
                <g>
                  {/* House body */}
                  <rect x="350" y="90" width="50" height="40" fill="#ffccbc" />
                  {/* Roof */}
                  <polygon points="340,90 410,90 375,65" fill="#ff8a65" />
                  {/* Door */}
                  <rect x="365" y="110" width="15" height="20" fill="#795548" />
                  {/* Windows */}
                  <rect x="355" y="100" width="10" height="10" fill="#bbdefb" />
                  <rect x="385" y="100" width="10" height="10" fill="#bbdefb" />
                  <line
                    x1="360"
                    y1="100"
                    x2="360"
                    y2="110"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="355"
                    y1="105"
                    x2="365"
                    y2="105"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="390"
                    y1="100"
                    x2="390"
                    y2="110"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="385"
                    y1="105"
                    x2="395"
                    y2="105"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  {/* Chimney */}
                  <rect x="390" y="70" width="8" height="15" fill="#795548" />
                </g>

                {/* Garden flowers */}
                <g>
                  {/* Flower 1 */}
                  <rect x="250" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="246,120 256,120 251,112" fill="#f48fb1" />
                </g>

                <g>
                  {/* Flower 2 */}
                  <rect x="260" y="120" width="2" height="8" fill="#558b2f" />
                  <polygon points="256,120 266,120 261,112" fill="#ce93d8" />
                </g>

                <g>
                  {/* Flower 3 */}
                  <rect x="270" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="266,120 276,120 271,112" fill="#90caf9" />
                </g>

                <g>
                  {/* Flower 4 */}
                  <rect x="460" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="456,120 466,120 461,112" fill="#fff59d" />
                </g>

                <g>
                  {/* Flower 5 */}
                  <rect x="475" y="120" width="2" height="8" fill="#558b2f" />
                  <polygon points="471,120 481,120 476,112" fill="#ffcc80" />
                </g>

                {/* Sun */}
                <g>
                  <polygon
                    points="620,40 625,25 630,40 645,45 630,50 625,65 620,50 605,45"
                    fill="#ffeb3b"
                  />
                </g>

                {/* Birds (simple triangles) */}
                <polygon points="180,30 185,35 190,30" fill="#424242" />
                <polygon points="200,40 205,45 210,40" fill="#424242" />

                {/* Clouds (geometric) */}
                <g>
                  <rect x="100" y="30" width="30" height="15" fill="#ffffff" />
                  <rect x="115" y="23" width="20" height="12" fill="#ffffff" />
                  <rect x="90" y="35" width="20" height="10" fill="#ffffff" />
                </g>

                <g>
                  <rect x="500" y="25" width="40" height="20" fill="#ffffff" />
                  <rect x="520" y="15" width="30" height="15" fill="#ffffff" />
                  <rect x="490" y="35" width="25" height="10" fill="#ffffff" />
                </g>

                {/* Geometric bunny */}
                <g>
                  {/* Body */}
                  <rect x="550" y="115" width="20" height="15" fill="#f5f5f5" />
                  {/* Head */}
                  <rect x="545" y="105" width="15" height="12" fill="#f5f5f5" />
                  {/* Ears */}
                  <rect x="547" y="95" width="4" height="10" fill="#f5f5f5" />
                  <rect x="554" y="95" width="4" height="10" fill="#f5f5f5" />
                  {/* Tail */}
                  <rect x="570" y="120" width="5" height="5" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
          <div className="w-full max-w-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 p-2 text-[var(--accent)]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h1 className="text-3xl font-bold mb-6">Create Account</h1>

            <form onSubmit={handleSignupSubmit} className="w-full space-y-4">
              {signupError && (
                <div className="text-red-500 text-sm">{signupError}</div>
              )}

              <input
                type="text"
                name="nickname"
                placeholder="Nickname"
                value={signupForm.nickname}
                onChange={handleSignupChange}
                required
                className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
                className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
              />
              <div className="flex w-full justify-between gap-2 items-center ">
                <div className="relative w-full">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    required
                    className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)]"
                  >
                    {showSignupPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="relative w-full">
                  <input
                    type={showVerifyPassword ? "text" : "password"}
                    name="verifyPassword"
                    placeholder="Verify Password"
                    value={signupForm.verifyPassword}
                    onChange={handleSignupChange}
                    required
                    className={`w-full p-3 border ${
                      signupForm.verifyPassword && !passwordMatch
                        ? "border-red-500"
                        : "border-[var(--border)]"
                    } bg-transparent focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--accent)]"
                  >
                    {showVerifyPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {signupForm.verifyPassword && !passwordMatch && (
                  <div className="text-red-500 text-xs">
                    Passwords do not match
                  </div>
                )}
              </div>

              <div className="text-xs text-amber-500 font-medium">
                Important: Remember your email and password. If you forget them,
                you'll need to contact the developer to recover your account.
              </div>
              <div className="flex w-full justify-between gap-2 items-center ">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={signupForm.age}
                  onChange={handleSignupChange}
                  required
                  min="13"
                  className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
                />

                <select
                  name="gender"
                  value={signupForm.gender}
                  onChange={handleSignupChange}
                  required
                  className="w-full p-3 border border-[var(--border)] text-[var(--text-primary)] bg-transparent focus:outline-none"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="subscribe"
            checked={signupForm.subscribe}
            onChange={handleSignupChange}
          />
          <span>Subscribe to motivational emails</span>
        </label> */}

              <button
                type="submit"
                className="w-full p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition"
                disabled={signupForm.verifyPassword && !passwordMatch}
              >
                Create Account
              </button>

              <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={openLoginModal}
                  className="text-[var(--accent)] underline"
                >
                  Log In
                </a>
              </p>
            </form>
            <div className="mt-8 w-full border-t border-[var(--border)] pt-4">
              <svg viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
                {/* Sky background */}
                <rect width="800" height="150" fill="#e6f7ff" />

                {/* Mountains */}
                <polygon
                  points="0,150 100,80 150,120 250,60 350,110 450,50 600,130 700,70 800,120 800,150"
                  fill="#a2d7dd"
                />
                <polygon
                  points="0,150 50,100 150,130 250,90 400,140 500,80 600,140 750,90 800,130 800,150"
                  fill="#86c5d0"
                />

                {/* Ground */}
                <rect y="130" width="800" height="20" fill="#b3e6b3" />

                {/* Geometric trees */}
                <g>
                  {/* Tree 1 */}
                  <rect x="50" y="90" width="10" height="40" fill="#5d4037" />
                  <polygon points="35,90 75,90 55,60" fill="#66bb6a" />
                  <polygon points="40,70 70,70 55,40" fill="#81c784" />
                </g>

                <g>
                  {/* Tree 2 */}
                  <rect x="150" y="100" width="8" height="30" fill="#5d4037" />
                  <polygon points="136,100 172,100 154,80" fill="#66bb6a" />
                  <polygon points="140,85 168,85 154,65" fill="#81c784" />
                  <polygon points="144,70 164,70 154,55" fill="#a5d6a7" />
                </g>

                <g>
                  {/* Tree 3 */}
                  <rect x="700" y="95" width="10" height="35" fill="#5d4037" />
                  <polygon points="685,95 725,95 705,75" fill="#66bb6a" />
                  <polygon points="690,80 720,80 705,60" fill="#81c784" />
                  <polygon points="695,65 715,65 705,45" fill="#a5d6a7" />
                </g>

                {/* Geometric house */}
                <g>
                  {/* House body */}
                  <rect x="350" y="90" width="50" height="40" fill="#ffccbc" />
                  {/* Roof */}
                  <polygon points="340,90 410,90 375,65" fill="#ff8a65" />
                  {/* Door */}
                  <rect x="365" y="110" width="15" height="20" fill="#795548" />
                  {/* Windows */}
                  <rect x="355" y="100" width="10" height="10" fill="#bbdefb" />
                  <rect x="385" y="100" width="10" height="10" fill="#bbdefb" />
                  <line
                    x1="360"
                    y1="100"
                    x2="360"
                    y2="110"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="355"
                    y1="105"
                    x2="365"
                    y2="105"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="390"
                    y1="100"
                    x2="390"
                    y2="110"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  <line
                    x1="385"
                    y1="105"
                    x2="395"
                    y2="105"
                    stroke="#7986cb"
                    stroke-width="1"
                  />
                  {/* Chimney */}
                  <rect x="390" y="70" width="8" height="15" fill="#795548" />
                </g>

                {/* Garden flowers */}
                <g>
                  {/* Flower 1 */}
                  <rect x="250" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="246,120 256,120 251,112" fill="#f48fb1" />
                </g>

                <g>
                  {/* Flower 2 */}
                  <rect x="260" y="120" width="2" height="8" fill="#558b2f" />
                  <polygon points="256,120 266,120 261,112" fill="#ce93d8" />
                </g>

                <g>
                  {/* Flower 3 */}
                  <rect x="270" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="266,120 276,120 271,112" fill="#90caf9" />
                </g>

                <g>
                  {/* Flower 4 */}
                  <rect x="460" y="120" width="2" height="10" fill="#558b2f" />
                  <polygon points="456,120 466,120 461,112" fill="#fff59d" />
                </g>

                <g>
                  {/* Flower 5 */}
                  <rect x="475" y="120" width="2" height="8" fill="#558b2f" />
                  <polygon points="471,120 481,120 476,112" fill="#ffcc80" />
                </g>

                {/* Sun */}
                <g>
                  <polygon
                    points="620,40 625,25 630,40 645,45 630,50 625,65 620,50 605,45"
                    fill="#ffeb3b"
                  />
                </g>

                {/* Birds (simple triangles) */}
                <polygon points="180,30 185,35 190,30" fill="#424242" />
                <polygon points="200,40 205,45 210,40" fill="#424242" />

                {/* Clouds (geometric) */}
                <g>
                  <rect x="100" y="30" width="30" height="15" fill="#ffffff" />
                  <rect x="115" y="23" width="20" height="12" fill="#ffffff" />
                  <rect x="90" y="35" width="20" height="10" fill="#ffffff" />
                </g>

                <g>
                  <rect x="500" y="25" width="40" height="20" fill="#ffffff" />
                  <rect x="520" y="15" width="30" height="15" fill="#ffffff" />
                  <rect x="490" y="35" width="25" height="10" fill="#ffffff" />
                </g>

                {/* Geometric bunny */}
                <g>
                  {/* Body */}
                  <rect x="550" y="115" width="20" height="15" fill="#f5f5f5" />
                  {/* Head */}
                  <rect x="545" y="105" width="15" height="12" fill="#f5f5f5" />
                  {/* Ears */}
                  <rect x="547" y="95" width="4" height="10" fill="#f5f5f5" />
                  <rect x="554" y="95" width="4" height="10" fill="#f5f5f5" />
                  {/* Tail */}
                  <rect x="570" y="120" width="5" height="5" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Compact Geometric Pattern */}
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
