import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Hook para usar o contexto de autenticação
 * Garante que o contexto foi inicializado com AuthProvider
 *
 * @throws Erro se usado fora de um AuthProvider
 * @returns Objeto com estado e ações de autenticação
 *
 * @example
 * const { user, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um <AuthProvider>. ' +
      'Certifique-se de envolver sua aplicação com AuthProvider em App.tsx ou main.tsx.'
    );
  }

  return context;
}

/**
 * Hook para verificar se o usuário está autenticado
 * Conveniente para condicionales de renderização
 *
 * @example
 * const isAuth = useIsAuthenticated();
 * return isAuth ? <Dashboard /> : <Login />;
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook para obter os dados do usuário
 * Retorna null se não autenticado
 *
 * @example
 * const user = useAuthUser();
 */
export function useAuthUser() {
  const { user } = useAuth();
  return user;
}
