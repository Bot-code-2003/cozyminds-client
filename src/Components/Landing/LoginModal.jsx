"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Signin from "../../assets/signin.png";
import { useNavigate } from "react-router-dom";

const MIN_LOADING_DURATION = 3000; // Minimum loading screen duration in ms
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const API = axios.create({ baseURL: API_BASE_URL });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value.trim() }));
    setLoginError(null); // Clear error on input change
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoginError(null);
      setIsLoading(true);
      setShowLoadingScreen(true);

      const { email, password } = loginForm;

      // Client-side validation
      if (!validateEmail(email)) {
        setLoginError("Please enter a valid email address.");
        setIsLoading(false);
        setShowLoadingScreen(false);
        return;
      }

      try {
        const loginPromise = API.post("/login", { email, password });
        const timerPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADING_DURATION)
        );
        const [loginRes] = await Promise.all([loginPromise, timerPromise]);

        const { user, coinsEarned } = loginRes.data;
        const coinsEarnedNum = Number.parseInt(coinsEarned || 0, 10);

        // Securely store minimal data
        localStorage.setItem("userId", user._id);
        sessionStorage.setItem("user", JSON.stringify(user));

        window.dispatchEvent(
          new CustomEvent("user-logged-in", {
            detail: { user, coinsEarned: coinsEarnedNum },
          })
        );

        setLoginSuccess(true);
        setShowLoadingScreen(false); // Hide loading screen after both API and timer resolve
      } catch (err) {
        console.error("Login error:", err); // Log for debugging
        const errorMessage =
          err?.response?.data?.message ||
          "Login failed. Please try again later.";
        setLoginError(errorMessage);
        setShowLoadingScreen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [loginForm]
  );

  const handleSwitchToSignup = useCallback(
    (e) => {
      e.preventDefault();
      onSwitchToSignup();
    },
    [onSwitchToSignup]
  );

  useEffect(() => {
    if (loginSuccess && !showLoadingScreen) {
      onClose();
      navigate("/", { replace: true });
    }
  }, [loginSuccess, showLoadingScreen, onClose, navigate]);

  if (!isOpen) return null;

  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
        <div className="relative flex flex-col items-center justify-center space-y-8 animate-[fadeInUp_0.8s_ease-out]">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5999a8] to-[#4a8ba0] shadow-2xl shadow-[#5999a8]/20 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-[#5999a8]/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-75"></div>
            <div className="absolute inset-0 rounded-2xl border-2 border-[#5999a8]/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-150"></div>
          </div>
          <div className="relative w-64">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#5999a8] to-[#4a8ba0] rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          <div className="text-center space-y-2 animate-[fadeIn_1s_ease-out_0.3s_both]">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Starlit Journals
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
              Signing you in...
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-0"></div>
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-200"></div>
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-400"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          @keyframes bounce {
            0%,
            80%,
            100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          .animation-delay-75 {
            animation-delay: 0.075s;
          }
          .animation-delay-150 {
            animation-delay: 0.15s;
          }
          .animation-delay-0 {
            animation-delay: 0ms;
          }
          .animation-delay-200 {
            animation-delay: 200ms;
          }
          .animation-delay-400 {
            animation-delay: 400ms;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 p-4"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-form-heading"
    >
      <div className="w-full max-w-4xl bg-[#f3f9fc] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F8F1E9] rounded-2xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9] max-h-[90vh] overflow-y-auto">
        <div className="relative flex flex-col lg:flex-row min-h-[500px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 dark:bg-white/20 rounded-full transition-colors z-10 hover:bg-black/30 dark:hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#5999a8]"
            aria-label="Close login modal"
          >
            <X size={20} className="text-white" />
          </button>
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
          <div className="flex-1 p-6 lg:p-8 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-4"
                noValidate
              >
                <h2
                  id="login-form-heading"
                  className="text-2xl font-bold mb-6 text-center"
                >
                  Welcome Back
                </h2>
                {loginError && (
                  <div
                    className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    role="alert"
                  >
                    {loginError}
                  </div>
                )}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium sr-only"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Email address"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1 relative">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium sr-only"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg p-3 pr-12 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#5999a8]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  Important: Remember your email and password. If you forget
                  them, you'll need to contact support to recover your account.
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5999a8]"
                  aria-label="Sign in to your account"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
                <p className="text-sm text-center mt-4">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={handleSwitchToSignup}
                    className="text-[#5999a8] underline hover:no-underline transition-all focus:outline-none focus:ring-2 focus:ring-[#5999a8]"
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
  );
};

export default LoginModal;