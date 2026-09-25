import Image from 'next/image';
import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/bumiversa-logo.png" 
            alt="BUMIVERSA" 
            width={120} 
            height={40}
            className="h-8 w-auto"
            priority
          />
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
