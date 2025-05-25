import React from "react";
import { MailCheck, Lock } from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";

const HowItWorks = ({ setShowLoginModal }) => {
  const { darkMode } = useDarkMode();

  const sections = [
    {
      icon: <MailCheck size={36} className="text-[#4C5B5C]" />,
      title: "🧚‍♂️ Identity, Your Way",
      description: (
        <>
          No personal email needed. Sign in with a whimsical alias like{" "}
          <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-sm">
            batman@dc.com
          </code>{" "}
          or{" "}
          <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-sm">
            sunshine@cozyspace.co
          </code>
          . Stay anonymous, stay comfy — this space is yours.
        </>
      ),
      bgLight: "E0ECF8",
      bgDark: "1C1F2A",
    },
    {
      icon: <Lock size={36} className="text-[#4C5B5C]" />,
      title: "🔒 Private & Insightful",
      description: (
        <>
          Your words are yours alone. We gently analyze your journal to give
          personal insights — but never share a single word.
        </>
      ),
      bgLight: "D5E8D4",
      bgDark: "1F2924",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 text-[#1A1A1A] dark:text-[#F8F1E9]">
        The Magic Behind Cozy Minds
      </h2>

      <div className="grid gap-8 sm:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#F8F1E9] p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col gap-4 backdrop-blur-md"
            style={{
              backgroundColor: darkMode
                ? `#${section.bgDark}`
                : `#${section.bgLight}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/30 dark:bg-white/10 shadow-inner">
                {section.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] dark:text-[#F8F1E9]">
                {section.title}
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[#1A1A1A] dark:text-[#F8F1E9] opacity-90">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
