import Link from 'next/link';
import { UTILITIES, type UtilityCategory } from '@/config/utilities';

// Helper untuk mendapatkan warna badge berdasarkan kategori
function getCategoryColor(category: UtilityCategory) {
  switch (category) {
    case 'developer': return 'bg-blue-50 text-blue-700 ring-blue-700/10';
    case 'text': return 'bg-emerald-50 text-emerald-700 ring-emerald-700/10';
    case 'image': return 'bg-purple-50 text-purple-700 ring-purple-700/10';
    case 'calculator': return 'bg-amber-50 text-amber-700 ring-amber-700/10';
    case 'generator': return 'bg-pink-50 text-pink-700 ring-pink-700/10';
    default: return 'bg-zinc-100 text-zinc-700 ring-zinc-700/10';
  }
}

export default function Home() {
  // Hanya tampilkan utility yang statusnya 'live'
  const liveUtilities = Object.values(UTILITIES).filter((u) => u.status === 'live');

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            BUMIVERSA
          </h1>
          <p className="mt-3 text-xl font-medium text-zinc-600">
            Global Utility Network
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-500">
            A curated collection of privacy-first, browser-based utilities. 
            No uploads, no tracking, 100% client-side processing.
          </p>
        </div>

        {/* Utilities Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {liveUtilities.map((utility) => (
            <Link 
              key={utility.id} 
              href={`/tools/${utility.id}`}
              className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryColor(utility.category)}`}>
                  {utility.category.charAt(0).toUpperCase() + utility.category.slice(1)}
                </span>
                <svg className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-zinc-900">
                {utility.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
                {utility.description}
              </p>

              <div className="mt-4 flex items-center text-sm font-medium text-zinc-900">
                Open Utility
              </div>
            </Link>
          ))}
        </div>

        {/* Footer / Privacy Baseline */}
        <div className="mt-16 border-t border-zinc-100 pt-8 text-center">
          <div className="mx-auto flex max-w-md items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Privacy-first Architecture</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                All tools process data locally in your browser. We do not upload, store, or transmit your data to any server.
              </p>
            </div>
          </div>
          <p className="mt-8 text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} BUMIVERSA. Built for the global web.
          </p>
        </div>

      </div>
    </main>
  );
}
