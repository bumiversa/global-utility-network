import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-950">BUMIVERSA</h3>
            <p className="text-sm text-zinc-600">Global Utility Network</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-zinc-950 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/" className="hover:text-zinc-950 transition-colors">All Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-950 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/about" className="hover:text-zinc-950 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-950 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} BUMIVERSA. Built for the global web.
        </div>
      </div>
    </footer>
  );
}
