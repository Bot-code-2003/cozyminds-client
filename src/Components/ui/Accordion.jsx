import { useState } from "react";

/**
 * Apple-style Accordion for FAQ dropdowns, with glassmorphism, icons, and SEO-friendly markup.
 * @param {Object[]} items - Array of { question, answer } objects.
 * @param {boolean} [singleOpen=true] - Only one open at a time if true.
 */
export default function Accordion({ items, singleOpen = true }) {
  const [openIndex, setOpenIndex] = useState(singleOpen ? null : []);

  const handleToggle = (idx) => {
    if (singleOpen) {
      setOpenIndex(openIndex === idx ? null : idx);
    } else {
      setOpenIndex((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    }
  };

  return (
    <dl className="backdrop-blur-xl bg-gradient-to-br from-white/70 to-[#f3f6fa]/80 dark:from-[#23272f]/80 dark:to-[#181a1b]/80 border border-[#e5e7eb] dark:border-[#23272f] rounded-3xl shadow-2xl overflow-hidden divide-y divide-[#e5e7eb] dark:divide-[#23272f] font-sans">
      {items.map((item, idx) => {
        const isOpen = singleOpen ? openIndex === idx : openIndex.includes(idx);
        return (
          <div key={idx} as="div" className={`transition-all duration-400 ${isOpen ? "z-10 relative scale-[1.025] shadow-xl" : ""}`}> 
            <dt>
              <button
                className={`w-full flex justify-between items-center px-8 py-7 md:py-8 text-xl md:text-2xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5999a8] transition-all duration-200 bg-transparent group ${isOpen ? "bg-white/60 dark:bg-[#23272f]/60" : "hover:bg-[#f3f9fc]/70 dark:hover:bg-[#23272f]/40"}`}
                onClick={() => handleToggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                id={`faq-header-${idx}`}
              >
                <span className="flex items-center gap-4">
                  <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-[#e0e7ef] to-[#b2e0e6] dark:from-[#23272f] dark:to-[#5999a8]/30 flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#b2e0e6" strokeWidth="2" />
                      <circle cx="10" cy="10" r="5" fill="#b2e0e6" fillOpacity="0.13" />
                    </svg>
                  </span>
                  <span className="text-[#222] dark:text-[#f3f6fa] text-left leading-snug">{item.question}</span>
                </span>
                <span className={`ml-6 transition-transform duration-400 ease-in-out text-[#5999a8] dark:text-[#b2e0e6] group-hover:scale-125 ${isOpen ? "rotate-90 scale-125" : "rotate-0"}`} aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </dt>
            <dd
              id={`faq-panel-${idx}`}
              role="region"
              aria-labelledby={`faq-header-${idx}`}
              className={`px-8 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] will-change-[max-height,opacity,transform] text-lg md:text-xl text-[#444] dark:text-[#c7d0db] ${isOpen ? "max-h-96 opacity-100 py-5 translate-y-0" : "max-h-0 opacity-0 overflow-hidden py-0 -translate-y-2"}`}
              style={{
                transitionProperty: "max-height, opacity, padding, transform",
              }}
            >
              <div className="leading-relaxed">
                {item.answer}
              </div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
} 