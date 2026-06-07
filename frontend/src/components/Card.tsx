import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const cardVariants = cva(
  'rounded-lg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
        elevated: 'bg-white shadow-lg hover:shadow-xl',
        flat: 'bg-gray-50 border border-gray-100',
        outline: 'bg-white border-2 border-gray-300',
        danger: 'bg-red-50 border border-red-200',
        success: 'bg-green-50 border border-green-200',
        warning: 'bg-amber-50 border border-amber-200',
        info: 'bg-blue-50 border border-blue-200',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:border-gray-400 active:shadow-inner',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: ReactNode;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        cardVariants({ variant, padding, interactive }),
        className
      )}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-b border-gray-200 pb-4 mb-4', className)}
      {...props}
    >
      {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('text-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-t border-gray-200 pt-4 mt-4 flex gap-2 justify-end', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export default Card;