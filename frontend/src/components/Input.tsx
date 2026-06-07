import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const inputVariants = cva(
  'w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-10',
        outline: 'border-gray-400 focus-visible:border-gray-600',
      },
      size: {
        sm: 'text-sm h-8',
        md: 'text-base h-10',
        lg: 'text-lg h-12',
      },
      state: {
        default: 'bg-white text-gray-900 placeholder-gray-400 border-gray-300 hover:border-gray-400',
        error: 'bg-red-50 text-gray-900 border-red-500 focus-visible:border-red-600 focus-visible:ring-red-500 focus-visible:ring-opacity-10',
        success: 'bg-green-50 text-gray-900 border-green-500 focus-visible:border-green-600 focus-visible:ring-green-500 focus-visible:ring-opacity-10',
        warning: 'bg-amber-50 text-gray-900 border-amber-500 focus-visible:border-amber-600 focus-visible:ring-amber-500 focus-visible:ring-opacity-10',
        disabled: 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      fullWidth: true,
    },
  }
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  warning?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    label,
    hint,
    error,
    success,
    warning,
    icon,
    iconPosition = 'left',
    helperText,
    required,
    disabled,
    id,
    type = 'text',
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    let state: 'default' | 'error' | 'success' | 'warning' | 'disabled' = 'default';
    
    if (disabled) state = 'disabled';
    else if (error) state = 'error';
    else if (success) state = 'success';
    else if (warning) state = 'warning';

    return (
      <div className={clsx('w-full', !fullWidth && 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium mb-2 text-gray-700',
              required && "after:content-['*'] after:ml-1 after:text-red-600"
            )}
          >
            {label}
          </label>
        )}

        {hint && !error && !success && !warning && (
          <p className="text-xs text-gray-500 mb-1">{hint}</p>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none flex items-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(
              inputVariants({ variant, size, state, fullWidth }),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            required={required}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none flex items-center">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}

        {success && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span>✓</span> {success}
          </p>
        )}

        {warning && (
          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
            <span>!</span> {warning}
          </p>
        )}

        {helperText && !error && !success && !warning && (
          <p id={`${inputId}-helper`} className="text-xs text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;