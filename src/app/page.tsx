import Link from "next/link";

const valueProps = [
  {
    num: "01",
    title: "Tell us your vibe",
    body: "Answer five quick questions about your occasion, mood, and budget. No beer knowledge needed.",
  },
  {
    num: "02",
    title: "We curate your match",
    body: "Our guided approach maps your answers to beers worth drinking — from classic lagers to bold craft ales.",
  },
  {
    num: "03",
    title: "Discover something new",
    body: "Leave with a recommendation you'll actually remember, and a story behind every glass.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-b from-amber-950 to-amber-900 flex items-center pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-2xl">
            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs font-semibold mb-6">
              Guided Beer Discovery
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-amber-50 leading-[1.05] mb-6 tracking-tight">
              We choose,
              <br />
              you cheers.
            </h1>
            <p className="text-amber-200 text-lg sm:text-xl leading-relaxed max-w-md mb-10">
              Tell us a little about tonight. We'll do the thinking so you can do the drinking.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-bold px-8 py-4 rounded-full text-base transition-colors"
            >
              Start your discovery
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="bg-cream py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-900 mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              Three steps. Two minutes. One great beer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {valueProps.map(({ num, title, body }) => (
              <div
                key={num}
                className="bg-white rounded-2xl p-7 border border-amber-100 shadow-sm"
              >
                <span className="text-amber-300 font-black text-4xl leading-none">{num}</span>
                <h3 className="text-amber-900 font-bold text-xl mt-4 mb-2">{title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-amber-950 py-20 px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-50 mb-3 tracking-tight">
            Ready to find your beer?
          </h2>
          <p className="text-amber-300 mb-8 text-base">
            Takes less than two minutes.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-bold px-8 py-4 rounded-full text-base transition-colors"
          >
            Start your discovery →
          </Link>
        </div>
      </section>
    </main>
  );
}
