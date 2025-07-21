import React, { useState } from "react";
import { Menu, X, Star } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModals from "./AuthModals";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Modal control handlers
  const openLoginModal = () => {
    setShowSignup(false);
    setShowLogin(true);
  };
  const openSignupModal = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="min-h-screen bg-[#f7eee0] text-black font-serif">
      {/* Navigation */}
      <nav className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-semibold font-">
                Starlit Journals
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-black transition-colors text-sm"
              >
                Our story
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-black transition-colors text-sm"
              >
                Write
              </a>
              <button
                onClick={openLoginModal}
                className="text-gray-700 hover:text-black transition-colors text-sm"
              >
                Sign in
              </button>
              <button
                onClick={openSignupModal}
                className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
              >
                Get started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-500 py-4">
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-700 hover:text-black px-4 py-2 text-sm"
                >
                  Our story
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-black px-4 py-2 text-sm"
                >
                  Write
                </a>
                <button
                  onClick={openLoginModal}
                  className="text-gray-700 hover:text-black px-4 py-2 text-sm text-left"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignupModal}
                  className="bg-black text-white mx-4 py-2 rounded-full text-sm"
                >
                  Get started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="lg:pr-16">
            <h1 className="text-7xl font-serif  lg:text-8xl font-normal leading-tight mb-8 text-black">
              Anonymous
              <br />
              stories & journals
            </h1>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-lg">
              A place to read, write, and share authentic experiences without
              revealing who you are
            </p>

            <Link
              to={"/public"}
              className="bg-black text-white px-12 py-3 rounded-full text-lg hover:bg-gray-800 transition-colors"
            >
              Start Reading
            </Link>
          </div>
          {/* Right Content - Simple Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <img src="/absr.png" alt="" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-500 mt-16">
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-black transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-black transition-colors">
              About
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Text to speech
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitchToSignup={openSignupModal}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
      />
    </div>
  );
};

export default LandingPage;
