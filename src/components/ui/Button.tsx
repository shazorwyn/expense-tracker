import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  children,
  isLoading,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-secondary';
  return (
    <button className={clsx(variantClass, className)} disabled={disabled || isLoading} {...rest}>
      {isLoading ? 'Please wait…' : children}
    </button>
  );
}
