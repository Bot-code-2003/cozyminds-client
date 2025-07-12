"use client";

import {
  Edit3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";
import { useState } from "react";

const HowItWorks = ({ setShowLoginModal }) => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      icon: BookOpen,
      title: 'Choose Your Path',
      text: 'Start with a Journal or a Story',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Edit3,
      title: "Write What's Real",
      text: 'Use our cozy editor to express or create',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      icon: Heart,
      title: 'Share or Keep Private',
      text: 'Choose who sees it — stay anonymous forever',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <h2 className="text-5xl sm:text-6xl font-thin text-gray-900 dark:text-white mb-6 tracking-tight">
          How It Works
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto">
          Three simple steps to start your creative journey
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 h-full flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 transform transition-all duration-300 ${hoveredStep === idx ? 'scale-110 rotate-3' : ''}`}>
                  <IconComponent className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                
                {/* Step Number */}
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 tracking-wider">
                  STEP {idx + 1}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-light">
                  {step.text}
                </p>
                
                {/* Connecting Arrow (hidden on last step) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                      <ArrowRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Subtle background glow on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
            </div>
          );
        })}
      </div>
      
      {/* CTA Section */}
      <div className="text-center mt-16">
        <button
          onClick={() => setShowLoginModal?.(true)}
          className="inline-flex items-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Get Started
          <Sparkles className="ml-2 w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;