import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?(): void;
  className?: string;
}

export default function Button({
  children,
  onClick,
  className = '',
}: ButtonProps): JSX.Element {
  return (
    <a
      className={'inline-block rounded border border-brand bg-brand px-12 py-3 text-sm font-medium text-black hover:bg-transparent hover:text-brand focus:outline-none focus:ring active:text-brandAccent '.concat(
        className
      )}
      onClick={onClick}
      href="#"
    >
      {children}
    </a>
  );
}
