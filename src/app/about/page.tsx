export const metadata = {
  title: "About",
  description: "Learn about the principles and mission behind BUMIVERSA Global Utility Network.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">About BUMIVERSA</h1>
      
      <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">What is BUMIVERSA?</h2>
          <p className="mt-2">
            BUMIVERSA is a curated collection of practical web utilities designed to help people work with everyday digital data. 
            We build tools that are useful, clear, and transparent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Our Core Values</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Useful:</strong> Tools should solve real problems efficiently.</li>
            <li><strong>Privacy-conscious:</strong> We prioritize client-side processing whenever possible.</li>
            <li><strong>Transparent:</strong> We clearly state what a tool does and, just as importantly, what it does not do.</li>
            <li><strong>Practical:</strong> We avoid unnecessary complexity and marketing fluff.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">How We Build</h2>
          <p className="mt-2">
            Our engineering is guided by two principles: <strong>Reality before Model</strong> and <strong>Evidence before Narrative</strong>. 
            This means our tools do exactly what they claim, our documentation reflects actual behavior, limitations are made explicit, 
            and we avoid over-promising on capabilities we have not rigorously tested.
          </p>
        </section>
      </div>
    </div>
  );
}
