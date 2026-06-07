'use client';

import { type ReactNode, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home, RefreshCcw, Loader2 } from 'lucide-react';

// Tipos
interface NavLink {
  label: string;
  href: string;
}

interface Reason {
  id: string;
  text: string;
}

// Constantes
const REASONS: Reason[] = [
  { id: '1', text: 'O link acessado pode estar quebrado.' },
  { id: '2', text: 'A página pode ter sido removida do sistema.' },
  { id: '3', text: 'Você pode não possuir permissão para acessar este conteúdo.' },
  { id: '4', text: 'O endereço URL pode ter sido digitado incorretamente.' },
];

const QUICK_LINKS: NavLink[] = [
  { label: 'Ir para Login', href: '/login' },
  { label: 'Ir para Dashboard', href: '/dashboard' },
  { label: 'Ir para Perfil', href: '/perfil' },
];

const BUTTON_STYLES = {
  primary: 'flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary: 'flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 transition duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  dark: 'flex items-center justify-center gap-2 rounded-2xl bg-gray-800 px-6 py-4 font-semibold text-white transition duration-200 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2',
  success: 'rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
  ghost: 'block rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
};

// Components
function ReasonItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-1 h-2 w-2 rounded-full bg-red-500 flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-gray-600">{text}</span>
    </li>
  );
}

function NavButton({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link to={href} className={BUTTON_STYLES.ghost} aria-label={label}>
      {label}
    </Link>
  );
}

function NotFoundPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      try {
        window.location.reload();
      } catch (error) {
        console.error('Erro ao recarregar página:', error);
        setIsLoading(false);
      }
    }
  }, []);

  const handleContactSupport = useCallback(() => {
    window.location.href = 'mailto:suporte@example.com?subject=Problema na página 404';
  }, []);

  useEffect(() => {
    document.title = '404 - Página não encontrada | Sistema Profissional';
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-10">
        <section className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-2xl">
          {/* Header */}
          <header className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle
                className="h-12 w-12 text-red-500"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-7xl font-extrabold tracking-tight text-gray-800">
              404
            </h1>

            <h2 className="mt-4 text-3xl font-bold text-gray-700">
              Página não encontrada
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-gray-500">
              A página que você está procurando não existe, foi removida ou o
              endereço digitado está incorreto.
            </p>
          </header>

          {/* Info Card */}
          <section className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              O que pode ter acontecido?
            </h3>

            <ul className="space-y-3" role="list">
              {REASONS.map((reason) => (
                <ReasonItem key={reason.id} text={reason.text} />
              ))}
            </ul>
          </section>

          {/* Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/"
              className={BUTTON_STYLES.primary}
              aria-label="Ir para página inicial"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              <span>Página Inicial</span>
            </Link>

            <button
              onClick={handleGoBack}
              disabled={isLoading}
              className={BUTTON_STYLES.secondary}
              aria-label="Voltar para página anterior"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>Voltar</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={BUTTON_STYLES.dark}
              aria-label="Recarregar página"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>Recarregando...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="h-5 w-5" aria-hidden="true" />
                  <span>Recarregar</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <hr className="my-10 border-gray-200" aria-hidden="true" />

          {/* Additional Help */}
          <section className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 p-6 transition duration-200 hover:shadow-md">
              <h4 className="mb-3 text-lg font-bold text-gray-700">
                Precisa de ajuda?
              </h4>

              <p className="mb-4 text-gray-500">
                Entre em contato com nossa equipe de suporte para resolver o
                problema rapidamente.
              </p>

              <button
                onClick={handleContactSupport}
                className={BUTTON_STYLES.success}
                aria-label="Entrar em contato com suporte"
              >
                Contatar suporte
              </button>
            </article>

            <article className="rounded-2xl border border-gray-200 p-6 transition duration-200 hover:shadow-md">
              <h4 className="mb-3 text-lg font-bold text-gray-700">
                Navegação rápida
              </h4>

              <nav className="space-y-3" aria-label="Links de navegação rápida">
                {QUICK_LINKS.map((link) => (
                  <NavButton
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={null}
                  />
                ))}
              </nav>
            </article>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2026 Sistema Profissional. Todos os direitos reservados.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Desenvolvido com Node.js + Tailwind CSS
            </p>
          </footer>
        </section>
      </main>
  );
}

export default NotFoundPage;
