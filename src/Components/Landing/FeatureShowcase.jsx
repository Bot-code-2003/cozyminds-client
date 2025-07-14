import React from "react";

const FeatureShowcase = () => {
  return (
    <section className="w-full max-w-4xl mx-auto my-16 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Discover What Makes Us Special</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Cozy Mind is a place to express, reflect, and connect. Here’s what you can do in our vibrant community:
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Public Journals Feature */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center transition-transform hover:scale-[1.03]">
          <span className="text-5xl mb-4" role="img" aria-label="Journal">📓</span>
          <h3 className="text-2xl font-semibold mb-2">Public Journals</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your thoughts, feelings, and experiences anonymously. Public journals let you connect with others, inspire, and be inspired—without fear or judgment. Every entry is a chance to be heard and to help someone else feel less alone.
          </p>
        </div>
        {/* Public Stories Feature */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center transition-transform hover:scale-[1.03]">
          <span className="text-5xl mb-4" role="img" aria-label="Story">🌟</span>
          <h3 className="text-2xl font-semibold mb-2">Public Stories</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unleash your creativity! Write and share stories that move, entertain, or provoke thought. Our stories section is a showcase of imagination—where every voice matters and every story can find its audience.
          </p>
        </div>
      </div>
      <div className="mt-16 text-center text-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-xl py-8 px-4 shadow-inner max-w-3xl mx-auto">
        <strong className="block text-2xl mb-2">Why share publicly?</strong>
        <span>
          Our public feed is always fresh—see trending topics, join active discussions, and get inspired by the creativity of our community. Your story could be featured next!
        </span>
      </div>
    </section>
  );
};

export default FeatureShowcase;
