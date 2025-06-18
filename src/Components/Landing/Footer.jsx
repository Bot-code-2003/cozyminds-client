import React from "react";
import { Link } from "react-router-dom";
import FooterImg from "../../assets/footer2.webp";
import { Linkedin, Github } from "lucide-react";

const Footer = ({ darkMode, setShowLoginModal }) => {
  return (
    <>
      {/* Call-to-Action Section */}
      <section className="relative z-10 w-full max-w-7xl py-12 mb-12 mx-auto px-1 sm:px-6">
        <div className="border border-[var(--accent)] w-full rounded-3xl p-6 md:p-12 bg-[var(--bg-secondary)] shadow-2xl">
          <div className=" flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)]">
                Ready to Start Your Journey?
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-md">
                Join others in finding mental clarity with Starlit Journals,
                crafted for well-being.
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:bg-[var(--accent-hover)] transition-all duration-500 ease-in-out font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] text-sm md:text-base whitespace-nowrap"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl px-4 py-12 mx-auto border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-xl font-bold tracking-wider mb-4">
              <span className="text-[var(--accent)]">
                STARLIT
              </span>{" "}
              <span className="text-[var(--text-primary)]">JOURNALS</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs">
              A solo developer's passion project to bring mental clarity and
              well-being to all.
            </p>

            <div className="flex gap-4 mt-4 text-[var(--text-secondary)] text-sm max-w-xs">
              <Link className="hover:text-[var(--accent)] transition-colors duration-500 ease-in-out" to="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="hover:text-[var(--accent)] transition-colors duration-500 ease-in-out" to="/terms-of-service">
                Terms of Service
              </Link>
              <Link className="hover:text-[var(--accent)] transition-colors duration-500 ease-in-out" to="/cozyminds-blog">
                Our Blogs
              </Link>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              {
                icon: (
                  <Linkedin
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-500 ease-in-out"
                  />
                ),
                link: "https://www.linkedin.com/in/dharmadeep-madisetty-oct2003",
              },
              {
                icon: (
                  <Github
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-500 ease-in-out"
                  />
                ),
                link: "https://github.com/Bot-code-2003/",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-500 ease-in-out"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-12 pt-6 text-center">
          <p className="text-xs md:text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Starlit Journals • Built with care for
            your calm
          </p>
        </div>
      </footer>

      {/* Footer Image Decoration */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <div className="relative w-full h-32 md:h-80">
          <img
            src={FooterImg}
            alt="Footer Decoration"
            className="w-full h-full object-cover opacity-60 transition-opacity duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
        </div>
      </div>
    </>
  );
};

export default Footer;
