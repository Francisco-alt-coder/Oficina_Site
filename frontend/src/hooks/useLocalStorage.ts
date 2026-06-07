import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar estado sincronizado com localStorage
 * Sincroniza automaticamente entre abas e persiste dados
 *
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial se chave não existe
 * @returns Tupla [valor, setter]
 *
 * @example
 * const [user, setUser] = useLocalStorage('currentUser', null);
 * setUser({ id: 1, name: 'João' }); // Persiste automaticamente
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;

      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      return JSON.parse(item);
    } catch (error) {
      console.warn(`Erro ao ler localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  /**
   * Função para setar valor no estado e localStorage
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // Dispara evento customizado para sincronização entre abas
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: JSON.stringify(valueToStore),
              oldValue: JSON.stringify(storedValue),
              storageArea: localStorage,
              url: window.location.href,
            })
          );
        }
      } catch (error) {
        console.warn(`Erro ao salvar localStorage[${key}]:`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Listener para mudanças de outras abas
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Erro ao sincronizar localStorage[${key}]:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook para limpar um item do localStorage
 *
 * @example
 * const clearAuth = useLocalStorageClear('auth_token');
 * clearAuth(); // Remove do localStorage
 */
export function useLocalStorageClear(key: string): () => void {
  return useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);

        // Dispara evento de sincronização
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            oldValue: localStorage.getItem(key),
            storageArea: localStorage,
            url: window.location.href,
          })
        );
      }
    } catch (error) {
      console.warn(`Erro ao limpar localStorage[${key}]:`, error);
    }
  }, [key]);
}

/**
 * Hook para limpar todo o localStorage
 *
 * @example
 * const clearAll = useLocalStorageClearAll();
 * clearAll(); // Remove tudo
 */
export function useLocalStorageClearAll(): () => void {
  return useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.warn('Erro ao limpar todo localStorage:', error);
    }
  }, []);
}
