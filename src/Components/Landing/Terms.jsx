import React from "react";

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to <strong>Cozy Minds</strong>. These terms govern your use of
        our platform. By accessing or using the app, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Using Cozy Minds</h2>
      <p className="mb-4">
        Cozy Minds is a journaling and self-reflection app designed for personal
        use. You agree not to misuse, disrupt, or exploit the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Content Ownership</h2>
      <p className="mb-4">
        Your journal entries and data belong to you. We don’t claim ownership
        over anything you write or upload to your account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Service Availability
      </h2>
      <p className="mb-4">
        We do our best to keep Cozy Minds running smoothly, but we can't
        guarantee perfect uptime or bug-free experiences. Features may evolve or
        change over time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Updates to Terms</h2>
      <p className="mb-4">
        These terms may be updated occasionally. If we make significant changes,
        we’ll try to notify you. Continuing to use the app means you accept any
        updates.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h2>
      <p className="mb-4">
        Questions? We’re here to help. Reach out at{" "}
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

export default Terms;
