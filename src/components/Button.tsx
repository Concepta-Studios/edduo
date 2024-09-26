import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?(): void;
  round?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  round = false,
  className = '',
}: ButtonProps): JSX.Element {
  const roundedClasses = round
    ? 'rounded-full py-3 px-4'
    : 'rounded px-12 py-3';
  return (
    <button
      className={`${roundedClasses} inline-block border border-brand bg-brand text-sm font-medium text-black hover:bg-transparent hover:text-brand focus:outline-none focus:ring active:text-brandAccent `.concat(
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
