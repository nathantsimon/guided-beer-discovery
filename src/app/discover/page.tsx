"use client";

import { useState } from "react";
import Link from "next/link";

type StepDef = {
  id: string;
  question: string;
  options: { value: string; label: string }[];
};

type Answers = Record<string, string>;

// Social route — fires when Q1 occasion is a group occasion
function isSocialRoute(answers: Answers): boolean {
  return answers.occasion === "Friends or family round";
}

// Q4 options — always shown (familiarity/provenance)
const q4Options = [
  { value: "Stick with what I know", label: "Stick with what I know" },
  { value: "Something a bit different", label: "Something a bit different" },
  { value: "Take me somewhere", label: "Take me somewhere" },
  { value: "Surprise me", label: "Surprise me" },
];

// Q5 options — solo routes
const q5SoloOptions = [
  { value: "Keep it everyday", label: "Keep it everyday" },
  { value: "A step up from the usual", label: "A step up from the usual" },
  { value: "Make it special", label: "Make it special" },
];

// Q5 options — social routes
const q5SocialOptions = [
  { value: "Good value all round", label: "Good value all round" },
  { value: "Worth doing it properly", label: "Worth doing it properly" },
  { value: "Pull out all the stops", label: "Pull out all the stops" },
];

// Base steps — Q5 options are overridden at render time based on isSocialRoute
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
    question: "What does this one need to feel like?",
    options: [
      { value: "Time to decompress", label: "Time to decompress" },
      { value: "Earned it", label: "Earned it" },
      { value: "Relaxed, nothing serious", label: "Relaxed, nothing serious" },
      { value: "Want to make the right choice", label: "Want to make the right choice" },
    ],
  },
  {
    id: "q3",
    question: "What do you want it to feel like?",
    options: [
      { value: "Relaxed and unfussy", label: "Relaxed and unfussy" },
      { value: "Fresh and uplifting", label: "Fresh and uplifting" },
      { value: "Warm and comforting", label: "Warm and comforting" },
      { value: "Soft and delicate", label: "Soft and delicate" },
      { value: "Easygoing but in between", label: "Easygoing but in between" },
    ],
  },
  {
    id: "familiarity",
    question: "Something familiar or something new?",
    options: q4Options,
  },
  {
    id: "q5",
    question: "What's most important?",
    options: q5SoloOptions, // overridden at render if social route
  },
];

function getActiveSteps(answers: Answers): StepDef[] {
  const social = isSocialRoute(answers);
  return baseSteps.map((step) => {
    if (step.id === "q5") {
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
          <p className="text-5xl mb-5 select-none">🍷</p>
          <h2 className="text-amber-50 font-extrabold text-2xl mb-3 tracking-tight">
            You&apos;re all set.
          </h2>
          <p className="text-amber-300 text-sm leading-relaxed">
            Your recommendation is on its way. We&apos;ll be in touch at {email} shortly.
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
  const [showFilters, setShowFilters] = useState(false);
  const [isColourFilter, setIsColourFilter] = useState<"none" | "no-red" | "no-white">("none");
  const [dietaryPref, setDietaryPref] = useState<"none" | "vegan" | "organic">("none");

  if (done) return <DoneScreen email={email} />;

  const activeSteps = getActiveSteps(answers);
  const totalSteps = activeSteps.length;

  // State machine signals — derived from answers
  const isRoséSignal = answers.q3 === "Easygoing but in between";
  const isPremiumBias = answers.q5 === "A step up from the usual" || answers.q5 === "Make it special";

  async function submitForm() {
    setSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: answers.occasion,
          duration: answers.duration,
          q3: answers.q3,
          familiarity: answers.familiarity,
          q5: answers.q5,
          email,
          colour_filter: isColourFilter,
          dietary_pref: dietaryPref,
          is_rose_signal: isRoséSignal,
          is_premium_bias: isPremiumBias,
        }),
      });
    } finally {
      setSubmitting(false);
      setDone(true);
    }
  }

  if (showFilters) {
    return (
      <main className="min-h-screen bg-cream pt-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto py-10 sm:py-14">

          {/* Progress — stays at Step 5 of 5 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide">
                Step {totalSteps} of {totalSteps}
              </p>
              <p className="text-stone-400 text-xs">100% complete</p>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mb-8 tracking-tight leading-snug">
            Before we go — anything to flag?
          </h1>

          {/* Colour preference */}
          <div className="mb-8">
            <p className="text-stone-600 font-semibold text-sm mb-3">Colour preference</p>
            <div className="flex flex-wrap gap-3">
              {(["none", "no-red", "no-white"] as const).map((val) => {
                const labels: Record<string, string> = {
                  none: "No preference",
                  "no-red": "No red wine",
                  "no-white": "No white wine",
                };
                const isSelected = isColourFilter === val;
                return (
                  <button
                    key={val}
                    onClick={() => setIsColourFilter(val)}
                    className={`px-5 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      isSelected
                        ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                        : "border-amber-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {labels[val]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary preference */}
          <div className="mb-10">
            <p className="text-stone-600 font-semibold text-sm mb-3">Dietary preference</p>
            <div className="flex flex-wrap gap-3">
              {(["vegan", "organic", "none"] as const).map((val) => {
                const labels: Record<string, string> = {
                  vegan: "Vegan wines only",
                  organic: "Organic or natural wines only",
                  none: "Neither",
                };
                const isSelected = dietaryPref === val;
                return (
                  <button
                    key={val}
                    onClick={() => setDietaryPref(val)}
                    className={`px-5 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      isSelected
                        ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                        : "border-amber-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {labels[val]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={submitForm}
              disabled={submitting}
              className="bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-amber-50 font-bold px-7 py-3 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Find my wine"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const step = activeSteps[currentStep];
  const selected = answers[step.id];
  const isLast = currentStep === totalSteps - 1;
  const progressPct = ((currentStep + 1) / totalSteps) * 100;

  function handleSelect(value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [step.id]: value };
      // Clear Q5 answer when Q3 changes so a stale social/solo answer doesn't persist
      if (step.id === "q3") {
        delete next.q5;
      }
      return next;
    });
  }

  function handleNext() {
    if (!selected) return;
    if (isLast) {
      if (!email) return;
      setShowFilters(true);
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
              Step {currentStep + 1} of {totalSteps}
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
            disabled={!selected || (isLast && !email)}
            className="bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-amber-50 font-bold px-7 py-3 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </main>
  );
}
