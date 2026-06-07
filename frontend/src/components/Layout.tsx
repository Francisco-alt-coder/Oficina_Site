import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const layoutVariants = cva(
  'flex transition-all duration-300',
  {
    variants: {
      direction: {
        row: 'flex-row',
        column: 'flex-col',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-2',
        sm: 'gap-3',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
        '2xl': 'gap-12',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      direction: 'column',
      gap: 'md',
      align: 'stretch',
      justify: 'start',
      wrap: false,
    },
  }
);

const containerVariants = cva(
  'w-full transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
      },
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-12',
      },
      centered: {
        true: 'mx-auto',
        false: '',
      },
    },
    defaultVariants: {
      size: 'full',
      padding: 'md',
      centered: true,
    },
  }
);

const gridVariants = cva(
  'grid transition-all duration-300',
  {
    variants: {
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-2',
        sm: 'gap-3',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      responsive: {
        true: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        false: '',
      },
    },
    defaultVariants: {
      columns: 1,
      gap: 'md',
      responsive: false,
    },
  }
);

interface LayoutProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof layoutVariants> {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  children: ReactNode;
}

interface GridProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  children: ReactNode;
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, direction, gap, align, justify, wrap, children, as: Component = 'div', ...props }, ref) => {
    const Element = Component as React.ElementType;
    return (
      <Element
        ref={ref}
        className={clsx(
          layoutVariants({ direction, gap, align, justify, wrap }),
          className
        )}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Layout.displayName = 'Layout';

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centered, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        containerVariants({ size, padding, centered }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Container.displayName = 'Container';

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns, gap, responsive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        gridVariants({ columns: responsive ? 3 : columns, gap, responsive }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Grid.displayName = 'Grid';

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, children, ...props }, ref) => (
    <section
      ref={ref}
      className={clsx('space-y-4', className)}
      {...props}
    >
      {title && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
);

Section.displayName = 'Section';

const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, children, sidebarPosition = 'left', sidebarWidth = 'md', ...props }, ref) => {
    const sidebarWidthMap = {
      sm: 'w-48',
      md: 'w-64',
      lg: 'w-80',
    };

    const isLeftSidebar = sidebarPosition === 'left';
    const flexOrder = isLeftSidebar ? 'flex-row' : 'flex-row-reverse';

    return (
      <div
        ref={ref}
        className={clsx('flex gap-6 w-full', flexOrder, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarLayout.displayName = 'SidebarLayout';

const Sidebar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode; width?: 'sm' | 'md' | 'lg' }>(
  ({ className, children, width = 'md', ...props }, ref) => {
    const widthMap = {
      sm: 'w-48',
      md: 'w-64',
      lg: 'w-80',
    };

    return (
      <aside
        ref={ref}
        className={clsx(
          widthMap[width],
          'flex-shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

const MainContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <main
      ref={ref}
      className={clsx('flex-1 min-w-0', className)}
      {...props}
    >
      {children}
    </main>
  )
);

MainContent.displayName = 'MainContent';

const Stack = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, direction = 'column', gap = 'md', children, ...props }, ref) => (
    <Layout
      ref={ref}
      direction={direction}
      gap={gap}
      className={className}
      {...props}
    >
      {children}
    </Layout>
  )
);

Stack.displayName = 'Stack';

const HStack = forwardRef<HTMLDivElement, Omit<LayoutProps, 'direction'>>(
  ({ className, gap = 'md', children, ...props }, ref) => (
    <Layout
      ref={ref}
      direction="row"
      gap={gap}
      align="center"
      className={className}
      {...props}
    >
      {children}
    </Layout>
  )
);

HStack.displayName = 'HStack';

const VStack = forwardRef<HTMLDivElement, Omit<LayoutProps, 'direction'>>(
  ({ className, gap = 'md', children, ...props }, ref) => (
    <Layout
      ref={ref}
      direction="column"
      gap={gap}
      className={className}
      {...props}
    >
      {children}
    </Layout>
  )
);

VStack.displayName = 'VStack';

export {
  Layout,
  Container,
  Grid,
  Section,
  SidebarLayout,
  Sidebar,
  MainContent,
  Stack,
  HStack,
  VStack,
};
export default Layout;