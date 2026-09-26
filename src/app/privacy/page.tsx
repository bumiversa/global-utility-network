export const metadata = {
  title: "Privacy Policy",
  description: "Understand how BUMIVERSA handles data, privacy, and service integrations.",
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
          <h2 className="text-xl font-semibold text-zinc-900">2. Client-Side Utilities</h2>
          <p className="mt-2">
            The core utility set is designed so that user-provided data (such as text, JSON, or images) is processed directly in your browser. These utilities do not require a BUMIVERSA server to perform their core transformations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">3. Analytics and Cookies</h2>
          <p className="mt-2">
            We use Google Analytics to understand how visitors interact with our utilities. This service may use cookies to collect anonymous usage data, such as page views and session duration. This helps us improve the Global Utility Network. You can opt-out of Google Analytics tracking through your browser settings or by using the Google Analytics Opt-out Browser Add-on.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">4. Future Services</h2>
          <p className="mt-2">
            In the future, we may integrate additional third-party services, such as advertising networks. If we do, we will update this policy to clearly disclose what data is collected, how it is used, and your rights regarding that data.
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