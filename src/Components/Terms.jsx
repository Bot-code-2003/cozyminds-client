  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            By accessing and using Cozy Minds, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            2. Use License
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on Cozy Minds's website for personal, non-commercial transitory viewing only.
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Modify or copy the materials
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Use the materials for any commercial purpose
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Attempt to decompile or reverse engineer any software contained on Cozy Minds's website
            </li>
            <li className="text-base text-[var(--text-secondary)] leading-relaxed">
              Remove any copyright or other proprietary notations from the materials
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            3. User Content
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            Users may post content as long as it isn't illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.
          </p>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            By posting content, you grant Cozy Minds the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-8 shadow-apple">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            4. Disclaimer
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            The materials on Cozy Minds's website are provided on an 'as is' basis. Cozy Minds makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>
      </div>
    </div>
  ); 