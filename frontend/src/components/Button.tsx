import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500',
        warning: 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 focus-visible:ring-amber-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'opacity-70 cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    icon,
    iconPosition = 'left',
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          buttonVariants({ variant, size, fullWidth, loading }),
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        )}
        {icon && iconPosition === 'left' && !loading && <span>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && !loading && <span>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 