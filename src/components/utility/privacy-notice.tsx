export default function PrivacyNotice() {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">Privacy-first</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Your data is processed entirely in your browser. We do not upload, store, or transmit your data to any server.
        </p>
      </div>
    </div>
  );
}
