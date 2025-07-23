import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const AboutUs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.5;

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Cursor-following orb (smaller, smoother) */}
        <div
          className="absolute w-8 h-8 rounded-full bg-white opacity-10 transition-all duration-200 ease-out"
          style={{
            left: mousePosition.x - 4,
            top: mousePosition.y - 4,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: `translateY(${parallaxOffset}px)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white border-opacity-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-8 px-8">
          <div className="group cursor-pointer">
            <a
              href="/"
              className="text-3xl font-light tracking-[0.2em] transition-all duration-300 group-hover:tracking-[0.3em]"
            >
              STARLIT JOURNALS
            </a>
            <div className="h-px bg-white w-0 group-hover:w-full transition-all duration-500 mt-1"></div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={openLoginModal}
              className="text-lg font-light tracking-wider opacity-70 hover:opacity-100 transition-all duration-300 hover:tracking-widest"
            >
              Sign In
            </button>
            <button
              onClick={openSignupModal}
              className="bg-white text-black px-4 py-2 rounded-full text-lg font-light hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-white border-opacity-10 py-4 bg-black">
            <div className="flex flex-col space-y-4 px-8">
              <a
                href="/aboutus"
                className="text-lg font-light tracking-wider opacity-70 hover:opacity-100 transition-all duration-300"
              >
                Our Story
              </a>
              <button
                onClick={openLoginModal}
                className="text-lg font-light tracking-wider opacity-70 hover:opacity-100 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={openSignupModal}
                className="bg-white text-black px-4 py-2 rounded-full text-lg font-light hover:bg-gray-200 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (About Us Content) */}
      <section className="relative z-10 min-h-[calc(100vh-120px)] flex items-start justify-start px-8 py-16">
        <div className="max-w-7xl text-left">
          <div className="lg:w-1/2 xl:w-3/5 py-12 sm:py-16 lg:py-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[0.9] mb-6 sm:mb-8 text-white tracking-tight">
              About
              <br />
              Starlit Journals
            </h1>
            <div className="space-y-8 text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-6xl font-light">
              <p className="relative before:content-[''] before:absolute before:-left-4 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b from-transparent via-yellow-300 to-transparent">
                Step into the warm embrace of Starlit Journals, a sanctuary
                where storytelling weaves its magic! This platform was born from
                my own cherished childhood memories—those fleeting, heartwarming
                short stories that ignited my imagination when novels felt too
                vast. Here, you’re invited to explore a vibrant tapestry of
                tales penned by diverse authors and intimate journals shared by
                fellow dreamers, each one a cozy nook of inspiration waiting to
                welcome you.
              </p>
              <p className="relative before:content-[''] before:absolute before:-left-4 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b from-transparent via-pink-400 to-transparent">
                For me, short stories hold a special thrill that novels
                sometimes miss. While novels can entangle us in intricate
                details, anchoring even the wildest imaginations, our short
                stories set your creativity free. They offer a rush of emotion
                and adventure in just a few pages, inviting you to paint
                boundless worlds with your own hues. Whether it’s a gripping
                tale from a seasoned writer or a personal journal entry, every
                piece here sparks a connection that feels like a shared
                heartbeat.
              </p>
              <p className="relative before:content-[''] before:absolute before:-left-4 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b from-transparent via-teal-300 to-transparent">
                Imagine a place where you can lose yourself in the voices of
                others—stories that dance with life, journals that whisper
                personal truths. This is more than a platform; it’s a gathering
                of souls, a campfire circle under a starlit sky where every
                reader and writer finds kinship. Your imagination becomes the
                brush, and every story is a canvas, blending our dreams into a
                tapestry of warmth and wonder.
              </p>
              <p className="relative before:content-[''] before:absolute before:-left-4 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b from-transparent via-purple-300 to-transparent">
                So come, join this loving community! Whether you’re here to
                savor a quick tale or to share your own, Starlit Journals is
                your home. Let’s celebrate the joy of short stories that lift
                our spirits, connect our hearts, and remind us of the beauty in
                every fleeting moment. Together, we’ll keep the stars of
                imagination shining bright.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white border-opacity-10 py-8 px-8">
        <div className="max-w-7xl mx-auto text-left">
          <div className="mb-4">
            <div className="inline-block">
              <div className="text-lg tracking-[0.4em] opacity-40 mb-2">
                EST. 2025
              </div>
              <div className="text-xl font-light tracking-[0.2em] opacity-60">
                STARLIT JOURNALS
              </div>
              <div className="w-full h-px bg-white opacity-20 mt-2"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">
              Help
            </a>
            <a href="/aboutus" className="hover:text-white transition-colors">
              About
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms
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

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
