/**
 * Configuração centralizada de variáveis de ambiente
 * Valida automaticamente as variáveis no tempo de compilação
 */

interface EnvConfig {
  // API
  API_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;

  // App
  APP_NAME: string;
  APP_VERSION: string;
  APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  APP_DEBUG: boolean;

  // Auth
  AUTH_TOKEN_KEY: string;
  AUTH_REFRESH_ENDPOINT: string;
  AUTH_LOGOUT_ENDPOINT: string;

  // Features
  ENABLE_ANALYTICS: boolean;
  ENABLE_SENTRY: boolean;
  ENABLE_DEV_TOOLS: boolean;

  // URLs
  BASE_URL: string;
  APP_URL: string;
}

/**
 * Valida se uma variável de ambiente existe e é válida
 */
function getEnvVariable(key: keyof EnvConfig, defaultValue?: string | number | boolean): string | number | boolean {
  const value = import.meta.env[`VITE_${key}`] ?? defaultValue;

  if (value === undefined) {
    console.warn(`⚠️ Variável de ambiente VITE_${key} não definida`);
  }

  return value ?? '';
}

/**
 * Valida o tipo e valor das variáveis de ambiente
 */
function validateEnv(config: Partial<EnvConfig>): EnvConfig {
  const errors: string[] = [];

  // Validações críticas
  if (!config.API_URL) {
    errors.push('API_URL é obrigatória');
  }

  if (!config.APP_NAME) {
    errors.push('APP_NAME é obrigatória');
  }

  if (config.APP_ENVIRONMENT && !['development', 'staging', 'production'].includes(config.APP_ENVIRONMENT)) {
    errors.push(`APP_ENVIRONMENT inválida: ${config.APP_ENVIRONMENT}`);
  }

  if (config.API_TIMEOUT && config.API_TIMEOUT < 1000) {
    errors.push('API_TIMEOUT deve ser >= 1000ms');
  }

  if (errors.length > 0) {
    const message = `Erro de configuração:\n${errors.map((e) => `  • ${e}`).join('\n')}`;
    if (config.APP_ENVIRONMENT === 'production') {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }

  return config as EnvConfig;
}

/**
 * Configuração de ambiente processada e validada
 */
export const env = validateEnv({
  // API
  API_URL: String(getEnvVariable('API_URL', 'http://localhost:3000/api')),
  API_TIMEOUT: Number(getEnvVariable('API_TIMEOUT', 30000)),
  API_RETRY_ATTEMPTS: Number(getEnvVariable('API_RETRY_ATTEMPTS', 3)),

  // App
  APP_NAME: String(getEnvVariable('APP_NAME', 'Sistema Oficina')),
  APP_VERSION: String(getEnvVariable('APP_VERSION', '1.0.0')),
  APP_ENVIRONMENT: (getEnvVariable('APP_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production'),
  APP_DEBUG: getEnvVariable('APP_DEBUG', import.meta.env.DEV ? true : false) === true || getEnvVariable('APP_DEBUG') === 'true',

  // Auth
  AUTH_TOKEN_KEY: String(getEnvVariable('AUTH_TOKEN_KEY', 'auth_token')),
  AUTH_REFRESH_ENDPOINT: String(getEnvVariable('AUTH_REFRESH_ENDPOINT', '/auth/refresh')),
  AUTH_LOGOUT_ENDPOINT: String(getEnvVariable('AUTH_LOGOUT_ENDPOINT', '/auth/logout')),

  // Features
  ENABLE_ANALYTICS: getEnvVariable('ENABLE_ANALYTICS', 'production' === 'production') === true,
  ENABLE_SENTRY: getEnvVariable('ENABLE_SENTRY', 'production' === 'production') === true,
  ENABLE_DEV_TOOLS: getEnvVariable('ENABLE_DEV_TOOLS', 'development' === 'development') === true,

  // URLs
  BASE_URL: String(getEnvVariable('BASE_URL', import.meta.env.BASE_URL || '/')),
  APP_URL: String(getEnvVariable('APP_URL', import.meta.env.DEV ? 'http://localhost:5173' : window.location.origin)),
});

/**
 * Helper para checar se está em desenvolvimento
 */
export const isDevelopment = env.APP_ENVIRONMENT === 'development';

/**
 * Helper para checar se está em produção
 */
export const isProduction = env.APP_ENVIRONMENT === 'production';

/**
 * Helper para checar se está em staging
 */
export const isStaging = env.APP_ENVIRONMENT === 'staging';

/**
 * Log de configuração (apenas em desenvolvimento)
 */
if (isDevelopment) {
  console.group('🔧 Configuração de Ambiente');
  console.log('App Name:', env.APP_NAME);
  console.log('Environment:', env.APP_ENVIRONMENT);
  console.log('API URL:', env.API_URL);
  console.log('Debug:', env.APP_DEBUG);
  console.groupEnd();
}
