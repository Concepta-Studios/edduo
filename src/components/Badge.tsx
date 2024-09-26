interface BadgeProps {
  label: string;
  className?: string;
}

export default function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={'whitespace-nowrap rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-700 '.concat(
        className ?? ''
      )}
    >
      {label}
    </span>
  );
}
