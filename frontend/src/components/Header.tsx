import React, { forwardRef, AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const headerVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border-b border-gray-200 shadow-sm',
        dark: 'bg-gray-900 border-b border-gray-800 shadow-lg',
        primary: 'bg-blue-600 border-b border-blue-700 shadow-lg',
        transparent: 'bg-transparent border-b border-gray-200',
      },
      sticky: {
        true: 'sticky top-0 z-40',
        false: '',
      },
      elevated: {
        true: 'shadow-lg',
        false: 'shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      sticky: true,
      elevated: false,
    },
  }
);

interface HeaderProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof headerVariants> {
  children: ReactNode;
}

interface HeaderContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface HeaderLogoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
}
interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

interface HeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, variant, sticky, elevated, children, ...props }, ref) => (
    <header
      ref={ref}
      className={clsx(
        headerVariants({ variant, sticky, elevated }),
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
);

Header.displayName = 'Header';

const HeaderContent = forwardRef<HTMLDivElement, HeaderContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

HeaderContent.displayName = 'HeaderContent';

const HeaderLogo = forwardRef<HTMLAnchorElement, HeaderLogoProps>(
  ({ className, children, href = '/', ...props }, ref) => (
    <a
      href={href}
      className={clsx(
        'flex items-center gap-2 text-lg font-bold no-underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </a>
  )
);

HeaderLogo.displayName = 'HeaderLogo';

const HeaderNav = forwardRef<HTMLElement, HeaderNavProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={clsx(
        'hidden md:flex items-center gap-1',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
);

HeaderNav.displayName = 'HeaderNav';

const HeaderNavItem = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement> & { href?: string; children: ReactNode }>(
  ({ className, children, href = '#', ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={clsx(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);

HeaderNavItem.displayName = 'HeaderNavItem';

const HeaderActions = forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-center gap-2 md:gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

HeaderActions.displayName = 'HeaderActions';

export {
  Header,
  HeaderContent,
  HeaderLogo,
  HeaderNav,
  HeaderNavItem,
  HeaderActions,
};
export default Header;