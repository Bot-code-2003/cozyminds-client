"use client";

import { useEffect } from "react";
import {
  Globe,
  FileText,
  BookText,
  Shield,
  Copyright,
  RefreshCw,
  Mail,
  Calendar,
} from "lucide-react";

const Terms = ({ darkMode }) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Globe size={24} />,
      title: "User Eligibility",
      content:
        "You must be at least 13 years old to use Starlit Journals. Users under 18 require parental guidance. By accessing the platform, you confirm compliance with these age requirements.",
    },
    {
      icon: <FileText size={24} />,
      title: "User Conduct",
      content:
        "Use Starlit Journals for lawful, personal, and non-commercial purposes only. Avoid posting illegal, harmful, or abusive content, and refrain from disrupting or exploiting the platform. You are accountable for your content and interactions.",
    },
    {
      icon: <BookText size={24} />,
      title: "Content Ownership",
      content:
        "You retain ownership of your journal entries. Public journals are visible to all users and may be indexed by search engines. Posting public content grants Starlit Journals a license to display and promote it within the platform. Avoid personal details in public entries.",
    },
    {
      icon: <Shield size={24} />,
      title: "Content Moderation",
      content:
        "We may moderate, remove, or restrict content violating guidelines, laws, or user reports. Report issues via the platform or email. We address valid reports with urgency.",
    },
    {
      icon: <Copyright size={24} />,
      title: "Copyright Compliance",
      content:
        "Report copyright infringements with detailed notices. We comply with DMCA and will remove infringing content upon valid requests.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Disclaimers",
      content:
        "Starlit Journals is provided 'as-is' without warranties. We are not liable for user content, data loss, or damages from platform use. Proceed at your own risk.",
    },
    {
      icon: <Shield size={24} />,
      title: "Service Availability",
      content:
        "We aim for consistent service but cannot guarantee uninterrupted access. Features may be modified or discontinued at our discretion.",
    },
    {
      icon: <Mail size={24} />,
      title: "Third-Party Services",
      content:
        "Third-party providers support hosting, analytics, and email. They are contractually bound to protect your data and use it only as needed.",
    },
    {
      icon: <Shield size={24} />,
      title: "Jurisdiction",
      content:
        "These terms are governed by Indian law. Disputes will be resolved in Hyderabad courts. Using the platform implies consent to this jurisdiction.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Terms Updates",
      content:
        "Terms may be updated periodically. Significant changes will be notified via the platform or email. Continued use post-updates indicates acceptance.",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#F9FBFC] text-[#1A1A1A] font-sans transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-[#A3BFFA]/30 to-transparent opacity-50 dark:opacity-20 transition-opacity duration-300"></div>
      <div className="relative z-10 max-w-5xl mx-auto p-6 sm:p-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg text-sm font-semibold uppercase tracking-wide">
            Legal Agreement
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
            <span className="relative inline-block">
              Terms of
              <span className="text-[#4A90E2]"> Service</span>
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
            Welcome to <strong>Starlit Journals</strong>. These terms outline
            your responsibilities and rights while using our platform.
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
            For questions or assistance, feel free to reach out.
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

export default Terms;
