import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 py-10 px-6 md:px-16 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-white text-lg font-semibold mb-2">
            Starlit Journals
          </h2>
          <p className="text-sm">
            A quiet place to reflect, write, and grow — one journal at a time.
          </p>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-2">Explore</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/public" className="hover:text-white">
                Public Journals
              </a>
            </li>
            <li>
              <a href="/stories" className="hover:text-white">
                Stories
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-2">Connect</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="mailto:support@starlitjournals.com"
                className="hover:text-white"
              >
                Contact Support
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/starlitjournals"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/starlitjournals"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
        © {year} Starlit Journals. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
