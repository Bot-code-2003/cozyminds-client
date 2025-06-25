"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import axios from "axios";
import Signup from "../../assets/signup.png";
import { useNavigate } from "react-router-dom";
import TermsModal from "./TermsModal";
import { setWithExpiry } from "../../utils/anonymousName";

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    nickname: "",
    email: "",
    password: "",
    verifyPassword: "",
    age: "",
    gender: "",
    subscribe: false,
    agreedToTerms: false,
  });
  const [signupError, setSignupError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const navigate = useNavigate();

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
  });

  useEffect(() => {
    const pass = signupForm.password;
    if (pass) {
      if (pass.length < 10) {
        setPasswordError("Password must be at least 10 characters long.");
      } else if (!/[a-zA-Z]/.test(pass)) {
        setPasswordError("Password must contain at least one letter.");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }

    if (signupForm.verifyPassword || signupForm.password) {
      setPasswordMatch(signupForm.password === signupForm.verifyPassword);
    }
  }, [signupForm.password, signupForm.verifyPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (passwordError) {
      setSignupError(passwordError);
      return;
    }

    if (signupForm.password !== signupForm.verifyPassword) {
      setPasswordMatch(false);
      setSignupError("Passwords do not match. Please try again.");
      return;
    }

    if (!signupForm.agreedToTerms) {
      setSignupError("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    setIsLoading(true);
    setShowLoadingScreen(true);

    try {
      const signupPromise = API.post("/signup", {
        nickname: signupForm.nickname,
        email: signupForm.email,
        password: signupForm.password,
        age: signupForm.age,
        gender: signupForm.gender,
        subscribe: signupForm.subscribe,
        agreedToTerms: signupForm.agreedToTerms,
      });
      const timerPromise = new Promise((resolve) => setTimeout(resolve, 3000));

      const [signupRes] = await Promise.all([signupPromise, timerPromise]);
      const { user } = signupRes.data;

      localStorage.setItem("userId", user._id);
      setWithExpiry("user", user, 2 * 60 * 60 * 1000);

      window.dispatchEvent(
        new CustomEvent("user-signed-up", {
          detail: { user },
        })
      );

      setSignupSuccess(true);
    } catch (err) {
      setSignupError(
        err?.response?.data?.message || "Signup failed. Try again."
      );
      setIsLoading(false);
      setShowLoadingScreen(false);
      setSignupSuccess(false);
    }
  };

  useEffect(() => {
    if (signupSuccess && showLoadingScreen) {
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (signupSuccess && !showLoadingScreen) {
      onClose();
      navigate("/", { replace: true });
    }
  }, [signupSuccess, showLoadingScreen, onClose, navigate]);

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
        <div className="relative flex flex-col items-center justify-center space-y-8 animate-[fadeInUp_0.8s_ease-out]">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5999a8] to-[#4a8ba0] shadow-2xl shadow-[#5999a8]/20 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
               Creating your Starlit Journals account...
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-0"></div>
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-200"></div>
            <div className="w-2 h-2 bg-[#5999a8] rounded-full animate-[bounce_1.4s_ease-in-out_infinite] animation-delay-400"></div>
          </div>
        </div>
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-5xl bg-[#f3f9fc] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F8F1E9] rounded-2xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9] max-h-[90vh] overflow-y-auto">
          <div className="relative flex flex-col lg:flex-row min-h-[600px]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 dark:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Close signup modal"
            >
              <X size={20} className="text-white" />
            </button>
            <div
              className="flex-1 p-6 lg:p-8 flex items-center justify-center relative min-h-[200px] lg:min-h-[600px]"
              style={{ backgroundImage: `url(${Signup})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
              <div className="text-center relative z-10">
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-200 mb-2 lg:mb-4">Hello, new friend</h2>
                <p className="text-base lg:text-lg text-gray-400">Let's start writing your story, one page at a time.</p>
              </div>
            </div>
            <div className="flex-1 p-6 lg:p-8 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="w-full space-y-4" aria-labelledby="signup-form-heading">
                  <h2 id="signup-form-heading" className="text-2xl font-bold mb-6 text-center">Join Starlit Journals</h2>
                  
                  {signupError && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} />
                      {signupError}
                    </div>
                  )}

                  <input type="text" name="nickname" placeholder="Nickname" value={signupForm.nickname} onChange={handleChange} required className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all" aria-label="Nickname" />

                  <div className="space-y-2">
                    <input type="email" name="email" placeholder="Email" value={signupForm.email} onChange={handleChange} required className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all" aria-label="Email address" />
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1">💡 No need for your real email! Feel free to use something creative.</div>
                  </div>

                  <div className="space-y-2">
                    <input type="number" name="age" placeholder="Age" value={signupForm.age} onChange={handleChange} required min={1} className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all" aria-label="Age" />
                  </div>

                  <div className="space-y-2">
                    <select name="gender" value={signupForm.gender} onChange={handleChange} required className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all" aria-label="Gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="relative flex items-center w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus-within:ring-2 focus-within:ring-[#5999a8] transition-all">
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter a strong password" value={signupForm.password} onChange={handleChange} required className="w-full bg-transparent focus:outline-none" aria-label="Password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:opacity-70 transition-opacity" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && <div className="text-red-500 text-xs px-1 flex items-center gap-1"><AlertCircle size={14} />{passwordError}</div>}
                  </div>

                  <div className="space-y-2">
                    <div className="relative flex items-center w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus-within:ring-2 focus-within:ring-[#5999a8] transition-all">
                      <input type={showVerifyPassword ? "text" : "password"} name="verifyPassword" placeholder="Verify password" value={signupForm.verifyPassword} onChange={handleChange} required className="w-full bg-transparent focus:outline-none" aria-label="Verify Password" />
                      <button type="button" onClick={() => setShowVerifyPassword(!showVerifyPassword)} className="hover:opacity-70 transition-opacity" aria-label={showVerifyPassword ? "Hide password" : "Show password"}>
                        {showVerifyPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {signupForm.verifyPassword && !passwordMatch && <div className="text-red-500 text-xs px-1">Passwords do not match.</div>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="agreedToTerms" name="agreedToTerms" checked={signupForm.agreedToTerms} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-[#5999a8] focus:ring-[#5999a8]" />
                    <label htmlFor="agreedToTerms" className="text-sm">
                      I agree to the{" "}
                      <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-[#5999a8] underline hover:no-underline">
                        Terms and Conditions
                      </button>
                    </label>
                  </div>
                  
                  <button type="submit" className="w-full rounded-lg p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !passwordMatch || !!passwordError || !signupForm.agreedToTerms} aria-label="Create your account">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                  
                  <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <button onClick={handleSwitchToLogin} className="text-[#5999a8] underline hover:no-underline transition-all" aria-label="Open login modal">
                      Log In
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default SignupModal;