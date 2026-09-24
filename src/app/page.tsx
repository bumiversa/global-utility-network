export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-2xl text-center space-y-8">
        {/* Brand */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            BUMIVERSA
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Global Utility Network
          </p>
        </div>

        {/* Value Proposition */}
        <div className="space-y-5">
          <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
            Building privacy-first, browser-based utilities for the world.
          </p>
          <ul className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> No Uploads
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> No Tracking
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> 100% Client-Side
            </li>
          </ul>
        </div>

        {/* Coming Soon Badge */}
        <div className="pt-6">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-slate-400 dark:text-slate-600">
        <p>&copy; {new Date().getFullYear()} BUMIVERSA.</p>
      </footer>
    </main>
  );
}
