  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
          About Cozy Minds
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Your personal space for reflection and growth
        </p>
      </div>

      <div className="space-y-12">
        {/* Mission Section */}
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#F8F1E9] dark:bg-[#3A3A3A] rounded-apple">
              <Heart className="w-6 h-6 text-[#E68A41]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Our Mission
              </h2>
              <p className="text-base text-[var(--text-secondary)] mt-1">
                Empowering personal growth through mindful journaling
              </p>
            </div>
          </div>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            At Cozy Minds, we believe in the transformative power of journaling. Our mission is to create a safe, intuitive space where you can express yourself freely, track your personal growth, and develop a deeper understanding of yourself through the practice of mindful writing.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#F8F1E9] dark:bg-[#3A3A3A] rounded-apple">
              <Sparkles className="w-6 h-6 text-[#E68A41]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                What We Offer
              </h2>
              <p className="text-base text-[var(--text-secondary)] mt-1">
                Features designed for your journey
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)]">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Private Journaling
              </h3>
              <p className="text-base text-[var(--text-secondary)]">
                A secure space for your personal thoughts and reflections
              </p>
            </div>
            <div className="p-6 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)]">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Mood Tracking
              </h3>
              <p className="text-base text-[var(--text-secondary)]">
                Monitor your emotional well-being over time
              </p>
            </div>
            <div className="p-6 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)]">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Writing Prompts
              </h3>
              <p className="text-base text-[var(--text-secondary)]">
                Thoughtful prompts to inspire your journaling
              </p>
            </div>
            <div className="p-6 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)]">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Progress Insights
              </h3>
              <p className="text-base text-[var(--text-secondary)]">
                Track your growth and writing habits
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#F8F1E9] dark:bg-[#3A3A3A] rounded-apple">
              <Users className="w-6 h-6 text-[#E68A41]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Our Team
              </h2>
              <p className="text-base text-[var(--text-secondary)] mt-1">
                Passionate about mental wellness
              </p>
            </div>
          </div>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
            We are a team of mental health advocates, writers, and technologists dedicated to creating tools that support emotional well-being. Our diverse backgrounds and shared passion for mental health drive us to continuously improve Cozy Minds.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-3 bg-[#E68A41] text-white rounded-apple font-medium hover:bg-[#D67A31] transition-colors duration-200 shadow-apple hover:shadow-apple-hover"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  ); 