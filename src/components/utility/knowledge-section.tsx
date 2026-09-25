interface KnowledgeSectionProps {
  introduction: string;
  sections: { title: string; content: string }[];
}

export default function KnowledgeSection({ introduction, sections }: KnowledgeSectionProps) {
  return (
    <section className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Understanding this Utility</h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">{introduction}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-semibold text-zinc-900">{section.title}</h3>
            <p className="text-sm leading-6 text-zinc-600">{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
