const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: "Write" },
    { number: 2, label: "Mood & Tags" },
    { number: 3, label: "Theme" },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-1 text-xs ${
                  currentStep === step.number
                    ? "font-medium text-[var(--accent)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-10 h-0.5 mx-1 ${
                  currentStep > step.number
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
