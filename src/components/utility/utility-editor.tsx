interface UtilityEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  actionButton?: React.ReactNode;
}

export default function UtilityEditor({ label, actionButton, className = '', ...props }: UtilityEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        {actionButton}
      </div>

      <textarea
        className={`min-h-72 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 placeholder:opacity-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 ${className}`}
        spellCheck={false}
        {...props}
      />
    </div>
  );
}
