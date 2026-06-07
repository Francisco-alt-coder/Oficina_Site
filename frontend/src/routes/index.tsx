import { Link } from 'react-router-dom';
import { memo } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  Car,
  Wrench,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Bell,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  readonly id: number;
  readonly titulo: string;
  readonly descricao: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly ariaLabel?: string;
}

interface StatCard {
  readonly label: string;
  readonly value: number;
  readonly icon: LucideIcon;
  readonly color: 'blue' | 'purple' | 'green' | 'red';
  readonly ariaLabel?: string;
}

const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 1,
    titulo: 'Dashboard',
    descricao: 'Visualize métricas e indicadores do sistema.',
    href: '/dashboard',
    icon: LayoutDashboard,
    ariaLabel: 'Ir para Dashboard',
  },
  {
    id: 2,
    titulo: 'Ordens de Serviço',
    descricao: 'Gerencie ordens abertas, concluídas e pendentes.',
    href: '/ordens',
    icon: ClipboardList,
    ariaLabel: 'Ir para Ordens de Serviço',
  },
  {
    id: 3,
    titulo: 'Clientes',
    descricao: 'Cadastre e acompanhe informações dos clientes.',
    href: '/clientes',
    icon: Users,
    ariaLabel: 'Ir para Clientes',
  },
  {
    id: 4,
    titulo: 'Veículos',
    descricao: 'Controle veículos cadastrados no sistema.',
    href: '/veiculos',
    icon: Car,
    ariaLabel: 'Ir para Veículos',
  },
  {
    id: 5,
    titulo: 'Serviços',
    descricao: 'Gerencie serviços executados pela oficina.',
    href: '/servicos',
    icon: Wrench,
    ariaLabel: 'Ir para Serviços',
  },
  {
    id: 6,
    titulo: 'Configurações',
    descricao: 'Personalize preferências e parâmetros do sistema.',
    href: '/configuracoes',
    icon: Settings,
    ariaLabel: 'Ir para Configurações',
  },
] as const;

const STAT_CARDS: readonly StatCard[] = [
  {
    label: 'Ordens Ativas',
    value: 128,
    icon: ClipboardList,
    color: 'blue',
    ariaLabel: 'Ordens de serviço ativas: 128',
  },
  {
    label: 'Clientes',
    value: 542,
    icon: Users,
    color: 'purple',
    ariaLabel: 'Total de clientes: 542',
  },
  {
    label: 'Serviços',
    value: 87,
    icon: Wrench,
    color: 'green',
    ariaLabel: 'Serviços cadastrados: 87',
  },
  {
    label: 'Notificações',
    value: 12,
    icon: Bell,
    color: 'red',
    ariaLabel: 'Notificações pendentes: 12',
  },
] as const;

const COLOR_MAP = {
  blue: { text: 'text-blue-600', bg: 'text-blue-200' },
  purple: { text: 'text-purple-600', bg: 'text-purple-200' },
  green: { text: 'text-green-600', bg: 'text-green-200' },
  red: { text: 'text-red-600', bg: 'text-red-200' },
} as const;

const FEATURES = [
  'Controle completo de ordens de serviço.',
  'Cadastro inteligente de clientes e veículos.',
  'Relatórios administrativos e financeiros.',
  'Interface moderna e responsiva.',
] as const;

const StatCardComponent = memo(({ card }: { card: StatCard }) => {
  const Icon = card.icon;
  const colors = COLOR_MAP[card.color];

  return (
    <div
      className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
      role="region"
      aria-label={card.ariaLabel}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{card.label}</p>
          <h3 className={`mt-2 text-4xl font-bold ${colors.text}`}>
            {card.value}
          </h3>
        </div>
        <Icon className={`h-12 w-12 ${colors.bg}`} aria-hidden="true" />
      </div>
    </div>
  );
});

StatCardComponent.displayName = 'StatCardComponent';

const MenuCardComponent = memo(({ menu }: { menu: MenuItem }) => {
  const Icon = menu.icon;

  return (
    <Link
      to={menu.href}
      className="group rounded-3xl bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
      aria-label={menu.ariaLabel}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:scale-110">
        <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
      </div>

      <h3 className="text-2xl font-bold text-gray-800">{menu.titulo}</h3>
      <p className="mt-3 leading-relaxed text-gray-500">{menu.descricao}</p>

      <div className="mt-6 flex items-center gap-2 font-semibold text-blue-600 transition group-hover:gap-4">
        Acessar módulo
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </div>
    </Link>
  );
});

MenuCardComponent.displayName = 'MenuCardComponent';

const FeatureItem = memo(({ feature }: { feature: string }) => (
  <li className="flex items-start gap-3">
    <span
      className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"
      aria-hidden="true"
    />
    <span className="text-gray-600">{feature}</span>
  </li>
));

FeatureItem.displayName = 'FeatureItem';

export default function RoutesIndex() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <header className="mb-10 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
              Sistema Oficina Pro
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-500">
              Plataforma moderna para gerenciamento completo de oficinas,
              ordens de serviço, clientes, veículos e métricas operacionais.
            </p>
          </div>

          <div
            className="flex items-center gap-4 rounded-2xl bg-blue-50 px-6 py-4"
            role="img"
            aria-label="Sistema com proteção de dados"
          >
            <ShieldCheck
              className="h-10 w-10 text-blue-600"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-bold text-gray-800">Sistema Seguro</h2>
              <p className="text-sm text-gray-500">
                Dados protegidos e monitorados.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section
        className="mb-10 grid gap-6 md:grid-cols-4"
        aria-label="Estatísticas do sistema"
      >
        {STAT_CARDS.map((card) => (
          <StatCardComponent key={card.label} card={card} />
        ))}
      </section>

      <section>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Navegação do Sistema
            </h2>
            <p className="mt-2 text-gray-500">
              Acesse rapidamente os módulos principais da aplicação.
            </p>
          </div>

          <div className="hidden items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-md md:flex">
            <BarChart3 className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <span className="font-medium text-gray-700">
              Gestão Inteligente
            </span>
          </div>
        </div>

        <div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          role="navigation"
        >
          {MENU_ITEMS.map((menu) => (
            <MenuCardComponent key={menu.id} menu={menu} />
          ))}
        </div>
      </section>

      <section
        className="mt-12 grid gap-6 md:grid-cols-2"
        aria-label="Recursos e informações do sistema"
      >
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-800">
            Recursos do Sistema
          </h3>
          <ul className="mt-6 space-y-4">
            {FEATURES.map((feature) => (
              <FeatureItem key={feature} feature={feature} />
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold">Performance e Segurança</h3>
          <p className="mt-4 leading-relaxed text-blue-100">
            Desenvolvido com Node.js, TypeScript e Tailwind CSS para oferecer
            alta performance, segurança avançada e experiência profissional.
          </p>
          <button className="mt-8 rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Ver documentação
          </button>
        </div>
      </section>

      <footer className="mt-14 border-t border-gray-300 pt-6 text-center">
        <p className="text-sm text-gray-500">
          © 2026 Sistema Oficina • Todos os direitos reservados.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Desenvolvido com Node.js, TypeScript e Tailwind CSS.
        </p>
      </footer>
    </main>
  );
}
