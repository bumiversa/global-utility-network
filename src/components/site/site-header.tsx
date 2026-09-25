import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950 hover:text-zinc-700 transition-colors">
          BUMIVERSA
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Tools</Link>
          <Link href="/about" className="hover:text-zinc-950 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-zinc-950 transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
