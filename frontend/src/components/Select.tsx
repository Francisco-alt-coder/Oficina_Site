import React, { forwardRef, SelectHTMLAttributes, ReactNode, OptionHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const selectVariants = cva(
  'w-full px-3 py-2 rounded-lg border-2 appearance-none cursor-pointer transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 bg-no-repeat',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-10',
        outline: 'border-gray-400 focus-visible:border-gray-600',
      },
      size: {
        sm: 'text-sm h-8 pr-8',
        md: 'text-base h-10 pr-10',
        lg: 'text-lg h-12 pr-12',
      },
      state: {
        default: 'bg-white text-gray-900 border-gray-300 hover:border-gray-400',
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

interface OptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface OptionGroupData {
  label: string;
  options: OptionData[];
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, VariantProps<typeof selectVariants> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  options?: OptionData[];
  optionGroups?: OptionGroupData[];
  icon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
    helperText,
    placeholder,
    options,
    optionGroups,
    required,
    disabled,
    id,
    icon,
    children,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    let state: 'default' | 'error' | 'success' | 'warning' | 'disabled' = 'default';

    if (disabled) state = 'disabled';
    else if (error) state = 'error';
    else if (success) state = 'success';
    else if (warning) state = 'warning';

    return (
      <div className={clsx('w-full', !fullWidth && 'w-auto')}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              selectVariants({ variant, size, state, fullWidth }),
              'appearance-none pr-10',
              className
            )}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {optionGroups && optionGroups.length > 0 ? (
              optionGroups.map((group, idx) => (
                <optgroup key={idx} label={group.label} disabled={group.options?.every(opt => opt.disabled)}>
                  {group.options.map((opt, optIdx) => (
                    <option
                      key={optIdx}
                      value={opt.value}
                      disabled={opt.disabled}
                      className={clsx(opt.disabled && 'text-gray-400')}
                    >
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : options && options.length > 0 ? (
              options.map((opt, idx) => (
                <option
                  key={idx}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={clsx(opt.disabled && 'text-gray-400')}
                >
                  {opt.label}
                </option>
              ))
            ) : null}

            {children}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 flex items-center">
            {icon || (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-600 mt-1 flex items-center gap-1">
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
          <p id={`${selectId}-helper`} className="text-xs text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;