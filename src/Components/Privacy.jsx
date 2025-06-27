"use client";

import { useState } from "react";
import { Lock, Globe, Users, Save } from "lucide-react";

const Privacy = () => {
  const [privacy, setPrivacy] = useState("private");

  const handleSave = async () => {
    try {
      // TODO: Implement save functionality
      // console.log("Saving privacy settings:", privacy);
    } catch (error) {
      console.error("Error saving privacy settings:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Privacy Settings Section */}
      <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6">
          Journal Privacy Settings
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] cursor-pointer transition-all duration-200"
               onClick={() => setPrivacy("private")}>
            <div className={`p-2 rounded-full ${privacy === "private" ? "bg-[var(--accent)]/10" : "bg-[var(--bg-hover)]"}`}>
              <Lock className={`w-5 h-5 ${privacy === "private" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-primary)]">Private</h3>
              <p className="text-sm text-[var(--text-secondary)]">Only you can see your journal entries</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${privacy === "private" ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)]"}`} />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] cursor-pointer transition-all duration-200"
               onClick={() => setPrivacy("public")}>
            <div className={`p-2 rounded-full ${privacy === "public" ? "bg-[var(--accent)]/10" : "bg-[var(--bg-hover)]"}`}>
              <Globe className={`w-5 h-5 ${privacy === "public" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-primary)]">Public</h3>
              <p className="text-sm text-[var(--text-secondary)]">Anyone can view your journal entries</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${privacy === "public" ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)]"}`} />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] cursor-pointer transition-all duration-200"
               onClick={() => setPrivacy("followers")}>
            <div className={`p-2 rounded-full ${privacy === "followers" ? "bg-[var(--accent)]/10" : "bg-[var(--bg-hover)]"}`}>
              <Users className={`w-5 h-5 ${privacy === "followers" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-primary)]">Followers Only</h3>
              <p className="text-sm text-[var(--text-secondary)]">Only your followers can see your journal entries</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${privacy === "followers" ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)]"}`} />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          <Save className="w-5 h-5" />
          <span>Save Privacy Settings</span>
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            1. Information We Collect
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            We collect information that you provide directly to us, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Account information (name, email address, password)
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Profile information (bio, preferences, settings)
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Journal entries and related content
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Communication preferences
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Provide, maintain, and improve our services
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Process and complete transactions
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Send you technical notices and support messages
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Communicate with you about products, services, and events
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            3. Information Sharing
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            We do not share your personal information with third parties except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              With your consent
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              To comply with legal obligations
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              To protect our rights and prevent fraud
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              With service providers who assist in our operations
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            4. Data Security
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>
      </div>
    </div>
  ); 
}

export default Privacy; 