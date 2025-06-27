import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Testimonials = ({ darkMode }) => {
  const testimonials = [
    {
      quote:
        "It's lovely. The messages feel warm and personal. I use it every evening with my tea.",
      author: "Mom",
      role: "Lifelong Encourager",
      rating: 5,
      avatar: "M",
      highlight: true,
    },
    {
      quote:
        "Proud of what you've built. It's clean, simple, and feels like a quiet corner on the internet.",
      author: "Dad",
      role: "Supportive Dad",
      rating: 5,
      avatar: "D",
      highlight: false,
    },
    {
      quote:
        "I've actually started journaling because of this — and I never journal. The daily rewards are fun too.",
      author: "Brother",
      role: "Reluctant Tester Turned Fan",
      rating: 5,
      avatar: "B",
      highlight: false,
    },
  ];

  return (
    <section className="z-10 w-full max-w-7xl py-24 px-1 sm:px-6 relative">
      {/* Background decorative elements */}
      <div className="absolute bottom-12 left-0 w-12 h-12 border-2 border-[var(--border)] z-0"></div>

      <div className="text-center mb-16 relative">
        <div className="inline-block rounded-2xl mb-4 px-3 py-1 border-2 border-[var(--border)] text-xs font-medium tracking-wider">
          TESTIMONIALS
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          See why they love it
        </h2>
        <p className="text-lg opacity-70 max-w-xl mx-auto">Join today!</p>

        {/* Large quote icon */}
        {/* <Quote
          size={120}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  -z-10"
        /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`relative border-2 ${
              testimonial.highlight
                ? "border-[var(--accent)]"
                : "border-[var(--border)]"
            } ${
              darkMode ? "bg-[var(--card-bg)]" : "bg-[var(--card-bg)]"
            } transition-all duration-300 hover:-translate-y-1 hover:shadow-apple-hover rounded-apple group backdrop-blur-sm`}
          >
            {testimonial.highlight && (
              <div className="absolute -top-3 rounded-apple -right-3 px-4 py-1.5 bg-[var(--accent)] text-white text-xs font-bold tracking-wide">
                FEATURED
              </div>
            )}

            <div className="p-8">
              {/* Quote icon */}
              <Quote
                size={28}
                className={`mb-6 ${
                  testimonial.highlight
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-primary)]/20 dark:text-[var(--text-primary)]/20"
                }`}
              />

              {/* Rating */}
              <div className="flex mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-[var(--accent)] fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg mb-8 min-h-[120px] leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center mt-auto">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    testimonial.highlight
                      ? "bg-[var(--accent)] text-white"
                      : darkMode
                      ? "bg-[var(--card-bg)] text-[var(--text-primary)]"
                      : "bg-[var(--text-primary)] text-white"
                  }`}
                >
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm opacity-70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      {/* <div className="text-center mt-16">
        <Link
          to="/testimonials"
          className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline group"
        >
          Read more testimonials
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div> */}
    </section>
  );
};

export default Testimonials;
