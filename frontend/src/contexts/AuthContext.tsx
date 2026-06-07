import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { env } from '../config/env';

/**
 * Interface para usuário autenticado
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  permissions?: string[];
}

/**
 * Interface para o contexto de autenticação
 */
export interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

/**
 * Valor padrão do contexto
 */
const defaultValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {
    throw new Error('AuthContext.login não foi inicializado. Use AuthProvider.');
  },
  logout: async () => {
    throw new Error('AuthContext.logout não foi inicializado. Use AuthProvider.');
  },
  refreshToken: async () => {
    throw new Error('AuthContext.refreshToken não foi inicializado. Use AuthProvider.');
  },
  clearError: () => {
    throw new Error('AuthContext.clearError não foi inicializado. Use AuthProvider.');
  },
};

/**
 * Contexto de autenticação
 * ⚠️ Use o AuthProvider para envolver sua aplicação
 */
export const AuthContext = createContext<AuthContextType>(defaultValue);

/**
 * Provider de autenticação com gerenciamento de estado completo
 */
export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicializa a autenticação ao montar o componente
   * Verifica token armazenado no localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(env.AUTH_TOKEN_KEY);
        if (token) {
          // Aqui você buscaria os dados do usuário da API
          // const response = await api.get('/auth/me');
          // setUser(response.data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao inicializar autenticação';
        setError(message);
        localStorage.removeItem(env.AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Faz login do usuário
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Aqui você faria a chamada à API
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      // localStorage.setItem(env.AUTH_TOKEN_KEY, token);
      // setUser(user);

      // Placeholder para desenvolvimento
      console.warn('⚠️ Login não está implementado - conecte à API');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Faz logout do usuário
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Aqui você chamaria a API para invalidar o token
      // await api.post(env.AUTH_LOGOUT_ENDPOINT);

      localStorage.removeItem(env.AUTH_TOKEN_KEY);
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza o token de autenticação
   */
  const refreshToken = useCallback(async () => {
    try {
      // Aqui você faria a chamada à API
      // const response = await api.post(env.AUTH_REFRESH_ENDPOINT);
      // const { token } = response.data;
      // localStorage.setItem(env.AUTH_TOKEN_KEY, token);

      console.warn('⚠️ Refresh token não está implementado - conecte à API');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar token';
      setError(message);
      localStorage.removeItem(env.AUTH_TOKEN_KEY);
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Limpa o erro exibido
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
