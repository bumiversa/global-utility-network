import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo / Brand */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            BUMIVERSA
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Global Utility Network
          </p>
        </div>

        {/* Value Proposition */}
        <div className="space-y-4">
          <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
            Building privacy-first, browser-based utilities for the world.
          </p>
          <ul className="flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-1">
              <span className="text-green-500">✓</span> No Uploads
            </li>
            <li className="flex items-center gap-1">
              <span className="text-green-500">✓</span> No Tracking
            </li>
            <li className="flex items-center gap-1">
              <span className="text-green-500">✓</span> 100% Client-Side
            </li>
          </ul>
        </div>

        {/* Call to Action / Node #01 Link */}
        <div className="pt-4">
          <Link
            href="https://jsondiff.bumiversa.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Preview Node #01: JSON Diff (Live Experiment)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Our first utility is currently in global observation phase.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-slate-400 dark:text-slate-600">
        <p>&copy; {new Date().getFullYear()} BUMIVERSA. All rights reserved.</p>
        <div className="mt-1 space-x-2">
          <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-400">
            Terms
          </Link>
        </div>
      </footer>
    </main>
  );
}
