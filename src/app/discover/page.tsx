"use client";

import { useState } from "react";
import Link from "next/link";

type StepDef = {
  id: string;
  question: string;
  options: { value: string; label: string }[];
};

type Answers = Record<string, string>;

// Social route detection (L29, L30)
// Fires when Q1 = friends-or-family-round, OR when Q1 = winding-down AND Q2 = longer-session-with-others
function isSocialRoute(answers: Answers): boolean {
  return (
    answers.occasion === "Friends or family round" ||
    (answers.occasion === "Winding down" &&
      answers.duration === "Longer session with others")
  );
}

// Q4 options — solo routes (L24: four options including Take me somewhere)
const q4SoloOptions = [
  { value: "Stick with what I know", label: "Stick with what I know" },
  { value: "Something a bit different", label: "Something a bit different" },
  { value: "Take me somewhere", label: "Take me somewhere" },
  { value: "Surprise me", label: "Surprise me" },
];

// Q4 options — social routes (L29: variety vs theme)
const q4SocialOptions = [
  { value: "Something for everyone", label: "Something for everyone" },
  { value: "Something with a story", label: "Something with a story" },
];

// Q5 options — solo routes
const q5SoloOptions = [
  { value: "Great value", label: "Great value" },
  { value: "Worth treating yourself", label: "Worth treating yourself" },
  { value: "Best possible recommendation", label: "Best possible recommendation" },
];

// Q5 options — social routes (L30: per-head framing)
const q5SocialOptions = [
  { value: "About £3-4 a head", label: "About £3–4 a head" },
  { value: "About £5-6 a head", label: "About £5–6 a head" },
  { value: "Best we can do", label: "Best we can do" },
];

// Base steps — Q4 and Q5 options are overridden at render time based on isSocialRoute
const baseSteps: StepDef[] = [
  {
    id: "occasion",
    question: "What's the occasion?",
    options: [
      { value: "Winding down", label: "Winding down" },
      { value: "Celebrating something", label: "Celebrating something" },
      { value: "Friends or family round", label: "Friends or family round" },
      { value: "Buying a gift", label: "Buying a gift" },
      { value: "Treating myself", label: "Treating myself" },
    ],
  },
  {
    id: "duration",
    question: "One great beer or a longer session?",
    options: [
      { value: "Just the one - make it count", label: "Just the one - make it count" },
      { value: "Longer session with others", label: "Longer session with others" },
      { value: "Slowly savouring something special", label: "Slowly savouring something special" },
      { value: "Keeping it light", label: "Keeping it light" },
      { value: "Making a night of it", label: "Making a night of it" },
    ],
  },
  {
    id: "mood",
    question: "What feeling are you hoping for?",
    options: [
      { value: "Switch off and unwind", label: "Switch off and unwind" },
      { value: "Celebratory and upbeat", label: "Celebratory and upbeat" },
      { value: "Relaxed and sociable", label: "Relaxed and sociable" },
      { value: "Balanced and in control", label: "Balanced and in control" },
    ],
  },
  {
    id: "familiarity",
    question: "Something familiar or something new?",
    options: q4SoloOptions, // overridden at render if social route
  },
  {
    id: "budget",
    question: "What's most important?",
    options: q5SoloOptions, // overridden at render if social route
  },
];

function getActiveSteps(answers: Answers): StepDef[] {
  const social = isSocialRoute(answers);
  return baseSteps.map((step) => {
    if (step.id === "familiarity") {
      return { ...step, options: social ? q4SocialOptions : q4SoloOptions };
    }
    if (step.id === "budget") {
      return { ...step, options: social ? q5SocialOptions : q5SoloOptions };
    }
    return step;
  });
}

function DoneScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-cream pt-16 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="bg-amber-900 rounded-3xl px-8 py-12 mb-6 shadow-lg">
          <p className="text-5xl mb-5 select-none">🍺</p>
          <h2 className="text-amber-50 font-extrabold text-2xl mb-3 tracking-tight">
            You're all set.
          </h2>
          <p className="text-amber-300 text-sm leading-relaxed">
            Your recommendation is on its way. We'll be in touch at {email} shortly.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <DoneScreen email={email} />;

  const activeSteps = getActiveSteps(answers);
  const step = activeSteps[currentStep];
  const selected = answers[step.id];
  const isLast = currentStep === activeSteps.length - 1;
  const progressPct = ((currentStep + 1) / activeSteps.length) * 100;

  // Clear Q4/Q5 answers when social route status changes mid-flow
  // (handles the case where someone goes back and changes Q1 or Q2)
  function handleSelect(value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [step.id]: value };
      // If occasion or duration changes, clear familiarity and budget
      // so stale social/solo answers don't persist
      if (step.id === "occasion" || step.id === "duration") {
        delete next.familiarity;
        delete next.budget;
      }
      return next;
    });
  }

  async function handleNext() {
    if (!selected) return;
    if (isLast) {
      if (!email) return;
      setSubmitting(true);
      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            occasion: answers.occasion,
            duration: answers.duration,
            mood: answers.mood,
            familiarity: answers.familiarity,
            budget: answers.budget,
            email,
          }),
        });
      } finally {
        setSubmitting(false);
        setDone(true);
      }
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  return (
    <main className="min-h-screen bg-cream pt-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto py-10 sm:py-14">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide">
              Step {currentStep + 1} of {activeSteps.length}
            </p>
            <p className="text-stone-400 text-xs">
              {Math.round(progressPct)}% complete
            </p>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mb-7 tracking-tight leading-snug">
          {step.question}
        </h1>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {step.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all ${
                  isSelected
                    ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                    : "border-amber-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Email capture (last step only) */}
        {isLast && (
          <div className="mb-8">
            <label className="block text-amber-900 font-semibold text-sm mb-2">
              Where should we send your recommendation?
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-white text-stone-700 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-amber-700 hover:text-amber-950 font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || (isLast && (!email || submitting))}
            className="bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-amber-50 font-bold px-7 py-3 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : isLast ? "See my beer →" : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}
