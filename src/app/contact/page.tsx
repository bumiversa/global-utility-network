export const metadata = {
  title: "Contact",
  description: "Get in touch with the BUMIVERSA team for feedback, corrections, or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Contact Us</h1>
      
      <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600">
        <p>
          We welcome feedback, bug reports, corrections, and partnership inquiries. 
          Keeping communication simple helps us maintain focus on building useful tools.
        </p>
        
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Reach Out</h2>
          <p className="mt-2">
            For general inquiries, please reach out via our designated contact channels. 
            (Contact details will be updated here as our network grows).
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            <em>Note: We do not currently operate a public contact form to minimize data collection and spam. 
            Please check our <a href="/privacy" className="text-zinc-900 underline">Privacy Policy</a> for more information on how we handle communications.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
