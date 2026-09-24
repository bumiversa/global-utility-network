interface UtilityHeaderProps {
  title: string;
  description: string;
}

export default function UtilityHeader({ title, description }: UtilityHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-base leading-7 text-zinc-600">{description}</p>
    </div>
  );
}
