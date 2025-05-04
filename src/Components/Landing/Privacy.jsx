import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>Cozy Minds</strong>, your privacy is important to us. We're
        all about creating a safe, calming space — and that includes respecting
        your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data We Collect</h2>
      <p className="mb-4">
        We do <strong>not</strong> collect any personal identifying information
        unless you choose to provide it via email or feedback. Your journal
        entries are yours alone — stored securely and never shared or sold.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Analytics</h2>
      <p className="mb-4">
        We use basic analytics tools (like Google Analytics) to understand how
        people use Cozy Minds — which pages are visited, how long users stay,
        and where they came from. This data is anonymized and helps us improve
        the app.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
      <p className="mb-4">
        Cozy Minds uses cookies to keep you logged in and ensure daily rewards
        and features work correctly. Nothing sneaky, just the cozy essentials.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You can request to view, edit, or delete your data anytime. Just reach
        out to us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p className="mb-4">
        Questions or concerns? Drop us an email at{" "}
        <a
          href="mailto:dharmadeepmadisetty@gmail.com"
          className="text-blue-600 underline"
        >
          dharmadeepmadisetty@gmail.com
        </a>
        .
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: May 4, 2025</p>
    </div>
  );
};

export default Privacy;
