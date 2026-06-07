import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

/**
 * AuthLayout - Componente layout para páginas de autenticação
 * Oferece uma estrutura consistente e responsiva para formulários de login/registro
 * 
 * @param children - Conteúdo interno do layout (formulário, etc)
 * @param title - Título exibido no cabeçalho (padrão: "Autenticação")
 * @param subtitle - Subtítulo opcional
 * @param showLogo - Exibir logo/marca (padrão: true)
 */
export default function AuthLayout({
  children,
  title = 'Autenticação',
  subtitle,
  showLogo = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com Logo */}
        {showLogo && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <span className="text-xl font-bold text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {children ? (
            children
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhum conteúdo fornecido</p>
            </div>
          )}
        </div>

        {/* Footer com Links */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Sistema Oficina. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}