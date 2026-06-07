import React, { forwardRef, HTMLAttributes, ReactNode, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const sidebarVariants = cva(
  'transition-all duration-300 flex flex-col overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-white border-r border-gray-200 shadow-sm',
        dark: 'bg-gray-900 border-r border-gray-800 shadow-lg',
        elevated: 'bg-white border-r border-gray-200 shadow-lg',
        glass: 'bg-white/80 backdrop-blur-md border-r border-gray-200/50 shadow-sm',
      },
      width: {
        sm: 'w-48',
        md: 'w-64',
        lg: 'w-80',
        xl: 'w-96',
      },
      collapsible: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      width: 'md',
      collapsible: true,
    },
  }
);

const sidebarItemVariants = cva(
  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        dark: 'text-gray-300 hover:bg-gray-800 active:bg-gray-700',
        active: 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3',
        activeDark: 'bg-blue-900/20 text-blue-400 border-l-4 border-blue-400 pl-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface SidebarProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  children: ReactNode;
  collapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

interface SidebarBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface SidebarItemProps extends HTMLAttributes<HTMLAnchorElement>, VariantProps<typeof sidebarItemVariants> {
  children: ReactNode;
  icon?: ReactNode;
  isActive?: boolean;
  isDark?: boolean;
  href?: string;
  badge?: string | number;
}

interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, width, collapsible, collapsed = false, onSidebarToggle, children, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);

    const handleToggle = () => {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      onSidebarToggle?.(newState);
    };

    return (
      <div
        ref={ref}
        className={clsx(
          sidebarVariants({ variant, width, collapsible }),
          isCollapsed && 'w-20',
          className
        )}
        {...props}
      >
        {collapsible && (
          <button
            onClick={handleToggle}
            className={clsx(
              'p-2 hover:bg-gray-100 transition-colors',
              variant === 'dark' && 'hover:bg-gray-800',
              'self-end m-2'
            )}
            aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}

        <div className={clsx('flex-1 overflow-y-auto', isCollapsed && 'hidden')}>
          {children}
        </div>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, closable, onClose, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-200',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {closable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  )
);

SidebarHeader.displayName = 'SidebarHeader';

const SidebarBody = forwardRef<HTMLDivElement, SidebarBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('px-3 py-4 space-y-2 flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
);

SidebarBody.displayName = 'SidebarBody';

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 py-4 border-t border-gray-200 mt-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

SidebarFooter.displayName = 'SidebarFooter';

const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({
    className,
    variant: variantProp,
    children,
    icon,
    isActive = false,
    isDark = false,
    href = '#',
    badge,
    ...props
  }, ref) => {
    let variant = variantProp;
    if (isActive) {
      variant = isDark ? 'activeDark' : 'active';
    } else {
      variant = isDark ? 'dark' : 'default';
    }

    return (
      <a
        ref={ref}
        href={href}
        className={clsx(
          sidebarItemVariants({ variant }),
          'no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 truncate">{children}</span>
        {badge && (
          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
            {badge}
          </span>
        )}
      </a>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, children, title, collapsible = false, defaultOpen = true, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div ref={ref} className={clsx('space-y-2', className)} {...props}>
        {title && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors',
              collapsible && 'cursor-pointer'
            )}
            disabled={!collapsible}
          >
            <span>{title}</span>
            {collapsible && (
              <span className={clsx('transition-transform', !isOpen && 'rotate-180')}>
                ▼
              </span>
            )}
          </button>
        )}
        {(!collapsible || isOpen) && (
          <div className="space-y-1">{children}</div>
        )}
      </div>
    );
  }
);

SidebarGroup.displayName = 'SidebarGroup';

const SidebarDivider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('my-2 border-t border-gray-200', className)}
      {...props}
    />
  )
);

SidebarDivider.displayName = 'SidebarDivider';

export {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarItem,
  SidebarGroup,
  SidebarDivider,
};
export default Sidebar;