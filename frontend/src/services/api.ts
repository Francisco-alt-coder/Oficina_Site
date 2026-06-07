import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { env, isDevelopment } from '@/config/env';

// ============================================================================
// Logger Estruturado
// ============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  attempt?: number;
  delayMs?: number;
  error?: string;
}

class ApiLogger {
  private shouldLog: boolean;

  constructor() {
    this.shouldLog = isDevelopment || env.APP_DEBUG;
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [API] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog) console.debug(this.formatLog('debug', message, context));
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog) console.info(this.formatLog('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog('warn', message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatLog('error', message, context));
  }
}

const logger = new ApiLogger();

// ============================================================================
// Erros Tipados
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Usuário não autenticado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflito no servidor') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Erro interno do servidor') {
    super(message, 500);
    this.name = 'ServerError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Erro de conexão com o servidor') {
    super(message);
    this.name = 'NetworkError';
  }
}

// ============================================================================
// Tipos
// ============================================================================

interface ApiErrorResponse {
  message: string;
  status?: number;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

interface RequestOptions extends AxiosRequestConfig {
  token?: string;
  signal?: AbortSignal;
}

// ============================================================================
// Instância Axios
// ============================================================================

const api: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Retry Logic com Exponential Backoff
// ============================================================================

const RETRY_CONFIG = {
  maxRetries: env.API_RETRY_ATTEMPTS,
  backoffMultiplier: 3,
  initialDelayMs: 300,
};

function shouldRetry(error: AxiosError, attemptCount: number): boolean {
  if (attemptCount >= RETRY_CONFIG.maxRetries) return false;

  const status = error.response?.status;

  // Retry em 5xx, 429 ou erros de conexão
  if (status && status >= 500) return true;
  if (status === 429) return true;
  if (!error.response) return true; // Sem resposta = erro de conexão

  return false;
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}

function getBackoffDelay(attemptCount: number): number {
  return (
    RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attemptCount)
  );
}

// ============================================================================
// Interceptadores
// ============================================================================

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem(env.AUTH_TOKEN_KEY) : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      logger.debug('Requisição iniciada', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });

      return config;
    } catch (error) {
      logger.error('Erro ao preparar requisição', {
        error: error instanceof Error ? error.message : String(error),
      });
      return config;
    }
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor com Retry
let retryCount = 0;

api.interceptors.response.use(
  (response: AxiosResponse) => {
    retryCount = 0;
    const duration = response.config.headers['x-request-start']
      ? Date.now() - parseInt(response.config.headers['x-request-start'] as string)
      : undefined;

    logger.debug('Requisição bem-sucedida', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      duration,
    });

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    if (shouldRetry(error, retryCount)) {
      const delay = getBackoffDelay(retryCount);
      retryCount++;

      logger.warn('Retentando requisição', {
        status: error.response?.status,
        attempt: retryCount,
        delayMs: delay,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api.request(error.config as AxiosRequestConfig);
    }

    retryCount = 0;

    // Mapear erro para tipo específico
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      const logContext: LogContext = {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status,
        error: message,
      };

      switch (status) {
        case 401:
          logger.error('Usuário não autenticado', logContext);
          return Promise.reject(new UnauthorizedError(message));

        case 403:
          logger.error('Acesso negado', logContext);
          return Promise.reject(new ForbiddenError(message));

        case 404:
          logger.error('Recurso não encontrado', logContext);
          return Promise.reject(new NotFoundError(message));

        case 409:
          logger.error('Conflito no servidor', logContext);
          return Promise.reject(new ConflictError(message));

        case 500:
        case 502:
        case 503:
        case 504:
          logger.error('Erro do servidor', logContext);
          return Promise.reject(new ServerError(message));

        default:
          logger.error('Erro na API', logContext);
          return Promise.reject(new ApiError(message, status, error));
      }
    } else {
      logger.error('Erro de conexão', {
        error: error.message,
      });
      return Promise.reject(new NetworkError(error.message));
    }
  }
);

// ============================================================================
// Métodos HTTP Genéricos
// ============================================================================

/**
 * Requisição GET genérica
 * @template T Tipo de dados retornado
 */
export async function apiGet<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    // Adicionar timestamp para logging
    if (!config.headers) config.headers = {};
    config.headers['x-request-start'] = String(startTime);

    const response: AxiosResponse<T | ApiResponse<T>> = await api.get(url, config);
    const responseData = response.data as unknown;

    return isApiResponse<T>(responseData) ? (responseData.data as T) : (responseData as T);
  } catch (error) {
    throw error;
  }
}

/**
 * Requisição POST genérica
 * @template T Tipo de dados retornado
 * @template D Tipo de dados enviados
 */
export async function apiPost<T, D = unknown>(
  url: string,
  data?: D,
  options?: RequestOptions
): Promise<T> {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    if (!config.headers) config.headers = {};
    config.headers['x-request-start'] = String(startTime);

    const response: AxiosResponse<T | ApiResponse<T>> = await api.post(
      url,
      data,
      config
    );
    const responseData = response.data as unknown;

    return isApiResponse<T>(responseData) ? (responseData.data as T) : (responseData as T);
  } catch (error) {
    throw error;
  }
}

/**
 * Requisição PUT genérica
 * @template T Tipo de dados retornado
 * @template D Tipo de dados enviados
 */
export async function apiPut<T, D = unknown>(
  url: string,
  data?: D,
  options?: RequestOptions
): Promise<T> {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    if (!config.headers) config.headers = {};
    config.headers['x-request-start'] = String(startTime);

    const response: AxiosResponse<T | ApiResponse<T>> = await api.put(url, data, config);
    const responseData = response.data as unknown;

    return isApiResponse<T>(responseData) ? (responseData.data as T) : (responseData as T);
  } catch (error) {
    throw error;
  }
}

/**
 * Requisição PATCH genérica
 * @template T Tipo de dados retornado
 * @template D Tipo de dados enviados
 */
export async function apiPatch<T, D = unknown>(
  url: string,
  data?: D,
  options?: RequestOptions
): Promise<T> {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    if (!config.headers) config.headers = {};
    config.headers['x-request-start'] = String(startTime);

    const response: AxiosResponse<T | ApiResponse<T>> = await api.patch(
      url,
      data,
      config
    );
    const responseData = response.data as unknown;

    return isApiResponse<T>(responseData) ? (responseData.data as T) : (responseData as T);
  } catch (error) {
    throw error;
  }
}

/**
 * Requisição DELETE genérica
 * @template T Tipo de dados retornado
 */
export async function apiDelete<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    if (!config.headers) config.headers = {};
    config.headers['x-request-start'] = String(startTime);

    const response: AxiosResponse<T | ApiResponse<T>> = await api.delete(url, config);
    const responseData = response.data as unknown;

    return isApiResponse<T>(responseData) ? (responseData.data as T) : (responseData as T);
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// Serviços de Exemplo
// ============================================================================

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

/** Login do Sistema */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginPayload>('/auth/login', payload);
}

/** Buscar Usuários */
export async function buscarUsuarios(): Promise<Usuario[]> {
  return apiGet<Usuario[]>('/usuarios');
}

/** Buscar Usuário Por ID */
export async function buscarUsuarioPorId(id: number): Promise<Usuario> {
  return apiGet<Usuario>(`/usuarios/${id}`);
}

/** Criar Usuário */
export async function criarUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
  return apiPost<Usuario, Partial<Usuario>>('/usuarios', usuario);
}

/** Atualizar Usuário */
export async function atualizarUsuario(
  id: number,
  usuario: Partial<Usuario>
): Promise<Usuario> {
  return apiPut<Usuario, Partial<Usuario>>(`/usuarios/${id}`, usuario);
}

/** Remover Usuário */
export async function removerUsuario(id: number): Promise<void> {
  return apiDelete<void>(`/usuarios/${id}`);
}

export default api;
