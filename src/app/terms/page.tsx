export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using BUMIVERSA Global Utility Network.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-zinc-500">Last updated: September 2026</p>
      
      <div className="mt-8 space-y-8 text-base leading-7 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing and using BUMIVERSA (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">2. Description of Services</h2>
          <p className="mt-2">
            BUMIVERSA provides a collection of web-based utilities designed to help users process, format, and inspect digital data. Many of these tools operate entirely within your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">3. Acceptable Use</h2>
          <p className="mt-2">
            You agree to use the Service only for lawful purposes. You must not use the Service to transmit malicious code, violate intellectual property rights, or attempt to disrupt the functionality of the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">4. No Warranty</h2>
          <p className="mt-2">
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that the utilities will be error-free, uninterrupted, or suitable for any specific purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">5. Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, BUMIVERSA shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the Service, including data loss or business interruption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">6. Intellectual Property</h2>
          <p className="mt-2">
            The design, code, and original content of BUMIVERSA are our intellectual property. You may not copy, modify, or distribute our source code or branding without explicit permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">7. Changes to Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">8. Contact</h2>
          <p className="mt-2">
            For questions regarding these Terms, please visit our <a href="/contact" className="text-zinc-900 underline hover:text-zinc-700">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
