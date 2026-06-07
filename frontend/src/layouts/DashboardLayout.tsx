import React, { ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarItem,
  SidebarGroup,
} from '../components/Sidebar';
import {
  Header,
  HeaderContent,
  HeaderLogo,
  HeaderActions,
} from '../components/Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  logo?: ReactNode;
  showSidebar?: boolean;
  sidebarVariant?: 'default' | 'dark' | 'elevated' | 'glass';
  headerVariant?: 'default' | 'dark' | 'primary' | 'transparent';
  onLogout?: () => void;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: string | number;
  onClick?: () => void;
}

/**
 * DashboardLayout - Layout principal para páginas de dashboard
 * Fornece estrutura consistente com header, sidebar e área de conteúdo
 * 
 * @param children - Conteúdo principal do dashboard
 * @param title - Título exibido no header
 * @param logo - Logo/ícone do sistema
 * @param showSidebar - Controlar visibilidade da sidebar (padrão: true)
 * @param sidebarVariant - Variação visual da sidebar
 * @param headerVariant - Variação visual do header
 * @param onLogout - Callback para logout
 * @param user - Informações do usuário logado
 */
export default function DashboardLayout({
  children,
  title = 'Dashboard',
  logo,
  showSidebar = true,
  sidebarVariant = 'default',
  headerVariant = 'default',
  onLogout,
  user,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header */}
      <Header variant={headerVariant} sticky>
        <HeaderContent>
          <div className="flex items-center gap-2 flex-1">
            {logo && (
              <div className="text-2xl font-bold text-blue-600">
                {logo}
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>

          <HeaderActions>
            {user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fazer logout"
              >
                Sair
              </button>
            )}
          </HeaderActions>
        </HeaderContent>
      </Header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            variant={sidebarVariant}
            width="md"
            collapsible
            collapsed={sidebarCollapsed}
            onSidebarToggle={setSidebarCollapsed}
            className={clsx(
              'border-r',
              sidebarVariant === 'dark'
                ? 'border-gray-800'
                : 'border-gray-200'
            )}
          >
            <SidebarHeader closable={false}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  O
                </div>
                <div className={clsx(!sidebarCollapsed && 'hidden')}>
                  <p className="text-sm font-bold text-gray-900">Oficina</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarBody>
              <DefaultSidebarNav sidebarCollapsed={sidebarCollapsed} />
            </SidebarBody>

            <SidebarFooter>
              <div className="text-xs text-gray-500 text-center py-2">
                <p>v1.0.0</p>
                <p className="mt-1">© 2025 Sistema</p>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <main className={clsx(
            'h-full transition-all duration-300',
            sidebarCollapsed ? 'p-4' : 'p-6'
          )}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente padrão de navegação sidebar
 * Pode ser customizado ou substituído com uma própria
 */
function DefaultSidebarNav({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const navItems: SidebarNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '/',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: '👥',
      href: '/clientes',
    },
    {
      id: 'carros',
      label: 'Carros',
      icon: '🚗',
      href: '/carros',
      badge: 5,
    },
    {
      id: 'ordens',
      label: 'Ordens de Serviço',
      icon: '📋',
      href: '/ordens',
      badge: 3,
    },
  ];

  return (
    <SidebarGroup title={sidebarCollapsed ? '' : 'Menu'} collapsible={false}>
      {navItems.map((item) => (
        <SidebarItem
          key={item.id}
          href={item.href}
          icon={item.icon}
          badge={item.badge}
          title={sidebarCollapsed ? item.label : ''}
        >
          {!sidebarCollapsed && item.label}
        </SidebarItem>
      ))}
    </SidebarGroup>
  );
}

export type { DashboardLayoutProps };
