import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-6xl mb-6 select-none">🍻</p>
        <h1 className="text-3xl font-extrabold text-amber-900 mb-3 tracking-tight">
          About us
        </h1>
        <p className="text-stone-500 text-base leading-relaxed mb-8">
          We're building a better way to discover beer — guided, personal, and without the pretension.
          More coming soon.
        </p>
        <Link
          href="/"
          className="text-amber-700 hover:text-amber-950 font-medium text-sm transition-colors underline underline-offset-4"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
