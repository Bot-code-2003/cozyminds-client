import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // linear gradient from bottom to top. bottom black and top white
    <footer className=" bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">
              Starlit Journals
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              A quiet place to reflect, write, and grow — one journal at a time.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-medium text-white text-sm mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/public"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Public Journals
                </a>
              </li>
              <li>
                <a
                  href="/stories"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Stories
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium text-white text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="font-medium text-white text-sm mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@starlitjournals.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://www.pinterest.com/starlitjournals_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Pinterest
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/starlit.journals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">
            © {year} Starlit Journals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
