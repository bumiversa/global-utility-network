interface UtilityPageProps {
  children: React.ReactNode;
}

export default function UtilityPage({ children }: UtilityPageProps) {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </div>
    </main>
  );
}
