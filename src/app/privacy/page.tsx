export const metadata = {
  title: "Privacy Policy",
  description: "Understand how BUMIVERSA handles data, privacy, and future service integrations.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-zinc-500">Last updated: September 2026</p>
      
      <div className="mt-8 space-y-8 text-base leading-7 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">1. Introduction</h2>
          <p className="mt-2">
            BUMIVERSA (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and utilities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">2. Current State: Client-Side Utilities</h2>
          <p className="mt-2">
            The current utility set is designed so that user-provided data is processed directly in the browser. These utilities do not require a BUMIVERSA server to perform their core transformations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">3. Future Services and Data Collection</h2>
          <p className="mt-2">
            Please note that the specific data handling of each service may differ. In the future, we may integrate third-party services such as analytics platforms, advertising networks, or server-side features. 
            If we do, we will update this policy to clearly disclose what data is collected, how it is used, and your rights regarding that data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">4. Cookies and Local Storage</h2>
          <p className="mt-2">
            Currently, we do not use tracking cookies. Any future use of cookies for analytics or advertising will be disclosed here and managed via a consent mechanism where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">5. Contact Us</h2>
          <p className="mt-2">
            If you have any questions or concerns about this Privacy Policy, please reach out to us via our <a href="/contact" className="text-zinc-900 underline hover:text-zinc-700">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
