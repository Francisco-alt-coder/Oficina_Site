import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

/**
 * Tipos de temas suportados
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Configurações de cores para cada tema
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

/**
 * Interface para o contexto de tema
 */
export interface ThemeContextType {
  // Estado
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;

  // Ações
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Temas predefinidos com paleta de cores
 */
export const THEME_COLORS: Record<'light' | 'dark', ThemeColors> = {
  light: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    foreground: '#000000',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#f1f5f9',
    ring: '#3b82f6',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#a78bfa',
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#cbd5e1',
    border: '#334155',
    input: '#1e293b',
    ring: '#60a5fa',
  },
};

/**
 * Valor padrão do contexto
 */
const defaultValue: ThemeContextType = {
  theme: 'auto',
  resolvedTheme: 'light',
  isDark: false,
  colors: THEME_COLORS.light,
  setTheme: () => {
    throw new Error('ThemeContext.setTheme não foi inicializado. Use ThemeProvider.');
  },
  toggleTheme: () => {
    throw new Error('ThemeContext.toggleTheme não foi inicializado. Use ThemeProvider.');
  },
};

/**
 * Contexto de tema
 * ⚠️ Use o ThemeProvider para envolver sua aplicação
 */
export const ThemeContext = createContext<ThemeContextType>(defaultValue);

/**
 * Props para o ThemeProvider
 */
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  forcedTheme?: Theme;
}

/**
 * Detecta o tema preferido do sistema operacional
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Provider de tema com suporte a light/dark mode e persistência
 */
export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = 'theme-preference',
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(forcedTheme || defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  /**
   * Inicializa o tema ao montar
   * Recupera do localStorage se disponível
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored && ['light', 'dark', 'auto'].includes(stored)) {
        setThemeState(stored);
      }
    } catch {
      console.warn('Erro ao recuperar tema do localStorage');
    } finally {
      setMounted(true);
    }
  }, [storageKey]);

  /**
   * Resolve o tema final (light ou dark) baseado na preferência
   */
  useEffect(() => {
    const resolved = theme === 'auto' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);

    // Atualiza a classe no elemento html para CSS
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);

      // Atualiza o atributo data-theme para Tailwind
      document.documentElement.setAttribute('data-theme', resolved);
    }

    // Atualiza meta tag theme-color
    if (typeof document !== 'undefined') {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          THEME_COLORS[resolved].primary
        );
      }
    }
  }, [theme]);

  /**
   * Listener para mudanças de preferência do sistema
   */
  useEffect(() => {
    if (theme !== 'auto' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    // addEventListener em vez de addListener para melhor compatibilidade
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  /**
   * Define o tema e persiste no localStorage
   */
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      if (!forcedTheme) {
        localStorage.setItem(storageKey, newTheme);
      }
    } catch {
      console.warn('Erro ao salvar tema no localStorage');
    }
  }, [forcedTheme, storageKey]);

  /**
   * Alterna entre light e dark
   */
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Evita flash de tema incorreto no carregamento
  if (!mounted) {
    return <>{children}</>;
  }

  const value: ThemeContextType = {
    theme: forcedTheme || theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    colors: THEME_COLORS[resolvedTheme],
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
