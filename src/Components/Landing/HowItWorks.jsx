import React from "react";
import { MailCheck, Lock, Leaf } from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";

const HowItWorks = ({ setShowLoginModal }) => {
  const { darkMode } = useDarkMode();

  const sections = [
    {
      icon: <MailCheck size={32} />,
      title: "🧚‍♂️ Identity Your Way",
      description:
        "No Gmail? No problem. Use a magical alias like `elf@elbaf.com` or `dreamer@moonmail.co`. Your space, your rules.",
      bgLight: "FDEEDC",
      bgDark: "2E2B2B",
    },
    {
      icon: <Lock size={32} />,
      title: "🔒 Built on Trust",
      description:
        "Your entries are just for you. We don’t analyze, sell, or track your thoughts. Everything is private, secure, and focused entirely on your well-being.",
      bgLight: "D5E8D4",
      bgDark: "1F2924",
    },
    {
      icon: <Leaf size={32} />,
      title: "🌱 Ready to Begin?",
      description: "Let’s build your cozy world — one entry at a time.",
      bgLight: "E2F0CB",
      bgDark: "263326",
      cta: {
        text: "Start Journaling",
        // link: "/journal", // replace with your actual route
      },
    },
  ];

  return (
    <section className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((s, i) => (
          <div
            key={i}
            className="p-6 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl flex flex-col justify-between"
            style={{
              backgroundColor: darkMode ? `#${s.bgDark}` : `#${s.bgLight}`,
            }}
          >
            <div className="mb-6 text-[#1A1A1A] dark:text-[#F8F1E9]">
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="opacity-80 whitespace-pre-line">{s.description}</p>
            </div>
            {s.cta && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-auto inline-block text-sm font-semibold px-4 py-2 border cursor-pointer border-[#1A1A1A] dark:border-[#F8F1E9] rounded-md"
              >
                {s.cta.text}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
