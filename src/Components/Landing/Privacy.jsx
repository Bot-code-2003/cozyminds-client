"use client";

import { useEffect } from "react";
import {
  Database,
  User,
  BarChart3,
  UserCheck,
  Shield,
  Cookie,
  Mail,
  Calendar,
  RefreshCw,
} from "lucide-react";

const Privacy = ({ darkMode }) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Database size={24} />,
      title: "Data Collection",
      content:
        "We collect only the data you voluntarily provide during signup, including an anonymous nickname, password, and optionally age or gender. Your journal entries, whether public or private, are securely stored. No real names or email addresses are required for account creation. If you opt for third-party logins, we may receive minimal profile data from those services.",
    },
    {
      icon: <User size={24} />,
      title: "Data Usage",
      content:
        "Your data is used to deliver and enhance the Starlit Journals experience, personalize features such as mood tracking and rewards, and maintain platform security. Public journal entries are accessible to all users and may be indexed by search engines, while private entries remain exclusive to you.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Public Content",
      content:
        "Public journals are visible to all platform users and may be shared, commented on, or featured. They may also be indexed by search engines and are not considered private. Avoid including personal details in public entries. You retain the ability to delete your public journals at any time.",
    },
    {
      icon: <UserCheck size={24} />,
      title: "User Rights",
      content:
        "You may access, correct, export, or delete your data at any time via your profile settings. Account deletion removes all associated data. For data export requests or further assistance, contact us at the email provided below. We adhere to global privacy standards, including GDPR and India’s DPDP Act.",
    },
    {
      icon: <Shield size={24} />,
      title: "Content Moderation",
      content:
        "We reserve the right to moderate, remove, or restrict content that violates our community guidelines, is illegal, or is reported. Report inappropriate content through the platform or email. We prioritize user safety and respond promptly to valid reports.",
    },
    {
      icon: <Cookie size={24} />,
      title: "Cookies & Analytics",
      content:
        "Cookies are used for login sessions, rewards, and essential functionality. Anonymized analytics (e.g., Google Analytics) help us understand usage patterns and improve the platform. We do not sell data or use it for advertising purposes.",
    },
    {
      icon: <Mail size={24} />,
      title: "Third-Party Services",
      content:
        "Third-party providers assist with hosting, analytics, and email delivery. These partners are bound by contracts to safeguard your data and use it solely for service provision.",
    },
    {
      icon: <Shield size={24} />,
      title: "Data Security",
      content:
        "We employ industry-standard encryption for data in transit and at rest. Your information is never sold or shared with advertisers. In case of a data breach, affected users will be notified promptly.",
    },
    {
      icon: <User size={24} />,
      title: "Age Restrictions",
      content:
        "Starlit Journals is designed for users aged 13 and above. Users under 18 should use the platform with parental oversight. We do not collect data from children under 13. Parents may request data deletion by contacting us.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Policy Updates",
      content:
        "This Privacy Policy may be updated periodically. Significant changes will be communicated via the platform or email. Continued use after updates signifies acceptance of the revised policy.",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#F9FBFC] text-[#1A1A1A] font-sans transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-[#A3BFFA]/30 to-transparent opacity-50 dark:opacity-20 transition-opacity duration-300"></div>
      <div className="relative z-10 max-w-5xl mx-auto p-6 sm:p-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg text-sm font-semibold uppercase tracking-wide">
            Privacy Commitment
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
            <span className="relative inline-block">
              Privacy
              <span className="text-[#4A90E2]"> Policy</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-1.5 text-[#4A90E2]"
                viewBox="0 0 100 5"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,2.5 Q25,0 50,2.5 T100,2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
          <p className="text-base sm:text-lg opacity-80 font-medium max-w-3xl mx-auto">
            At <strong>Starlit Journals</strong>, we prioritize your privacy as
            the foundation of a secure and trustworthy experience.
          </p>
        </div>

        <div className="space-y-10 mb-20">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 rounded-xl p-6 sm:p-8 bg-white/70 dark:bg-[#2A2A2A]/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#4A90E2]/10 dark:bg-[#4A90E2]/20 rounded-lg">
                    {section.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 tracking-tight">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="text-sm sm:text-base opacity-90 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 rounded-2xl p-8 mb-12 bg-[#4A90E2]/10 dark:bg-[#4A90E2]/5 text-center">
          <div className="mb-6">
            <div className="inline-flex p-3 border-2 border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 rounded-xl">
              <Mail size={24} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base opacity-90 mb-6 max-w-lg mx-auto">
            For inquiries or support, please reach out to our team.
          </p>
          <a
            href="mailto:madisettydharmadeep@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:bg-opacity-90 transition-all rounded-lg font-medium"
          >
            <Mail size={16} />
            madisettydharmadeep@gmail.com
          </a>
        </div>

        <div className="text-center border border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 opacity-70">
            <div className="p-1.5 border-2 border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 rounded-lg">
              <Calendar size={14} />
            </div>
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              Last Updated: May 4, 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
