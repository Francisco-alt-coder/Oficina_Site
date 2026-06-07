import { useContext, useMemo } from 'react';
import { ThemeContext, ThemeContextType } from '../contexts/ThemeContext';

/**
 * Hook para usar o contexto de tema
 * Garante que o contexto foi inicializado com ThemeProvider
 *
 * @throws Erro se usado fora de um ThemeProvider
 * @returns Objeto com estado e ações de tema
 *
 * @example
 * const { theme, setTheme, isDark } = useTheme();
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme deve ser usado dentro de um <ThemeProvider>. ' +
      'Certifique-se de envolver sua aplicação com ThemeProvider em App.tsx ou main.tsx.'
    );
  }

  return context;
}

/**
 * Hook para verificar se o modo escuro está ativo
 * Conveniente para condicionales de renderização
 *
 * @example
 * const dark = useDarkMode();
 * return dark ? <MoonIcon /> : <SunIcon />;
 */
export function useDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Hook para obter as cores do tema atual
 * Memoizado para evitar objetos novos a cada render
 *
 * @example
 * const colors = useThemeColors();
 * return <div style={{ color: colors.primary }} />;
 */
export function useThemeColors() {
  const { colors } = useTheme();
  return useMemo(() => colors, [colors]);
}

/**
 * Hook para obter o tema resolvido (light ou dark)
 * Útil quando o tema é 'auto' e você precisa do valor real
 *
 * @example
 * const resolved = useResolvedTheme();
 * // 'light' ou 'dark'
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

/**
 * Hook para aplicar estilos dinamicamente baseado no tema
 *
 * @example
 * const bgColor = useThemeStyle('light' ? 'white' : 'bg-gray-900');
 */
export function useThemeStyle(
  lightClass: string,
  darkClass: string
): string {
  const { isDark } = useTheme();
  return isDark ? darkClass : lightClass;
}
