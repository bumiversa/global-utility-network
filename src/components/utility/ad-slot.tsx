interface AdSlotProps {
  placement?: 'top' | 'sidebar' | 'bottom';
}

export default function AdSlot({ placement = 'bottom' }: AdSlotProps) {
  const heightClass = placement === 'sidebar' ? 'h-[600px]' : 'h-[90px]';
  const widthClass = placement === 'sidebar' ? 'w-full max-w-[300px]' : 'w-full max-w-[728px]';

  return (
    <div className="mt-8 flex justify-center">
      <div className={`${widthClass} ${heightClass} flex items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400`}>
        Advertisement Slot ({placement})
      </div>
    </div>
  );
}
