"use client";

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: "Write" },
    { number: 2, label: "Mood & Tags" },
    { number: 3, label: "Theme" },
  ];

  return (
    <>
      <style>
        {`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .pulse-active {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}
      </style>
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] shadow-[var(--shadow)] rounded-lg p-3">
        <div className="flex justify-center items-center gap-4 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentStep >= step.number
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--bg-secondary)]"
                } ${currentStep === step.number ? "pulse-active" : ""}`}
              />
              {currentStep === step.number && (
                <span className="mt-1.5 text-xs font-medium text-[var(--accent)]">
                  {step.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StepIndicator;
