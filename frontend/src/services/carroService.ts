import api, {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from './api';

/**
 * Classes de Erro Customizadas
 */
export class CarroServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'CarroServiceError';
  }
}

/**
 * Tipos e Interfaces
 */
export interface Carro {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  clienteId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarCarroPayload {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  clienteId: number;
}

export interface AtualizarCarroPayload {
  marca?: string;
  modelo?: string;
  ano?: number;
  placa?: string;
  cor?: string;
  quilometragem?: number;
}

export interface FiltroCarro {
  marca?: string;
  modelo?: string;
  placa?: string;
  ano?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Constantes de Configuração
 */
const BASE_URL = '/carros' as const;
const HEALTH_CHECK_URL = '/health' as const;

const VALIDATION_RULES = {
  PLACA_REGEX: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i,
  ANO_MIN: 1950,
  ANO_MAX_OFFSET: 1,
  QUILOMETRAGEM_MIN: 0,
  STRING_MIN_LENGTH: 1,
} as const;

/**
 * Validadores com Tratamento de Erro Detalhado
 */
function validarPlaca(placa: string): boolean {
  return VALIDATION_RULES.PLACA_REGEX.test(placa);
}

function validarAno(ano: number): boolean {
  const anoAtual = new Date().getFullYear();
  const anoMax = anoAtual + VALIDATION_RULES.ANO_MAX_OFFSET;
  return ano >= VALIDATION_RULES.ANO_MIN && ano <= anoMax;
}

function validarQuilometragem(quilometragem: number): boolean {
  return Number.isInteger(quilometragem) && quilometragem >= VALIDATION_RULES.QUILOMETRAGEM_MIN;
}

function validarMarcaModelo(valor: string, campo: string): void {
  if (!valor?.trim()) {
    throw new CarroServiceError(
      `${campo} é obrigatório.`,
      'REQUIRED_FIELD',
      400
    );
  }
}

/**
 * Valida todos os dados antes de criar um carro
 * @param payload Dados do carro a validar
 * @throws CarroServiceError com detalhes específicos da falha
 */
function validarDadosCarro(payload: CriarCarroPayload): void {
  const erros: ValidationError[] = [];

  validarMarcaModelo(payload.marca, 'Marca');
  validarMarcaModelo(payload.modelo, 'Modelo');

  if (!validarAno(payload.ano)) {
    erros.push({
      field: 'ano',
      message: `Ano deve estar entre ${VALIDATION_RULES.ANO_MIN} e ${new Date().getFullYear() + VALIDATION_RULES.ANO_MAX_OFFSET}.`,
    });
  }

  if (!validarPlaca(payload.placa)) {
    erros.push({
      field: 'placa',
      message: 'Placa deve seguir o formato brasileiro: XXX0X00',
    });
  }

  if (!validarQuilometragem(payload.quilometragem)) {
    erros.push({
      field: 'quilometragem',
      message: 'Quilometragem deve ser um número inteiro não negativo.',
    });
  }

  if (erros.length > 0) {
    const mensagem = erros.map(e => `${e.field}: ${e.message}`).join('\n');
    throw new CarroServiceError(mensagem, 'VALIDATION_ERROR', 400);
  }
}

/**
 * Serviços Principais
 */

/**
 * Lista todos os carros cadastrados
 * @returns Promise<Carro[]> Array com todos os carros
 * @throws CarroServiceError em caso de falha na requisição
 */
export async function listarCarros(): Promise<Carro[]> {
  try {
    return await apiGet<Carro[]>(BASE_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar carros';
    console.error('Erro ao listar carros:', error);
    throw new CarroServiceError(message, 'LIST_CARS_ERROR');
  }
}

/**
 * Busca um carro específico por ID
 * @param id ID do carro
 * @returns Promise<Carro> Dados do carro encontrado
 * @throws CarroServiceError se o carro não existir ou falhar a requisição
 */
export async function buscarCarroPorId(id: number): Promise<Carro> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new CarroServiceError('ID inválido. Deve ser um número positivo.', 'INVALID_ID', 400);
  }

  try {
    return await apiGet<Carro>(`${BASE_URL}/${id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : `Erro ao buscar carro ID ${id}`;
    console.error(`Erro ao buscar carro ID ${id}:`, error);
    throw new CarroServiceError(message, 'GET_CAR_ERROR');
  }
}

/**
 * Cria um novo carro no sistema
 * @param payload Dados do novo carro
 * @returns Promise<Carro> Carro criado com ID atribuído
 * @throws CarroServiceError se há erros de validação ou falha na requisição
 */
export async function criarCarro(payload: CriarCarroPayload): Promise<Carro> {
  try {
    validarDadosCarro(payload);

    return await apiPost<Carro, CriarCarroPayload>(BASE_URL, payload);
  } catch (error) {
    if (error instanceof CarroServiceError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Erro ao criar carro';
    console.error('Erro ao criar carro:', error);
    throw new CarroServiceError(message, 'CREATE_CAR_ERROR');
  }
}

/**
 * Atualiza um carro existente (PUT - substitui todos os campos)
 * @param id ID do carro a atualizar
 * @param payload Novos dados do carro
 * @returns Promise<Carro> Carro atualizado
 * @throws CarroServiceError se há erros de validação ou falha na requisição
 */
export async function atualizarCarro(
  id: number,
  payload: AtualizarCarroPayload
): Promise<Carro> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new CarroServiceError('ID inválido. Deve ser um número positivo.', 'INVALID_ID', 400);
  }

  try {
    const erros: ValidationError[] = [];

    if (payload.placa && !validarPlaca(payload.placa)) {
      erros.push({
        field: 'placa',
        message: 'Placa deve seguir o formato brasileiro: XXX0X00',
      });
    }

    if (payload.ano && !validarAno(payload.ano)) {
      erros.push({
        field: 'ano',
        message: `Ano deve estar entre ${VALIDATION_RULES.ANO_MIN} e ${new Date().getFullYear() + VALIDATION_RULES.ANO_MAX_OFFSET}.`,
      });
    }

    if (
      payload.quilometragem !== undefined &&
      !validarQuilometragem(payload.quilometragem)
    ) {
      erros.push({
        field: 'quilometragem',
        message: 'Quilometragem deve ser um número inteiro não negativo.',
      });
    }

    if (erros.length > 0) {
      const mensagem = erros.map(e => `${e.field}: ${e.message}`).join('\n');
      throw new CarroServiceError(mensagem, 'VALIDATION_ERROR', 400);
    }

    return await apiPut<Carro, AtualizarCarroPayload>(`${BASE_URL}/${id}`, payload);
  } catch (error) {
    if (error instanceof CarroServiceError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : `Erro ao atualizar carro ID ${id}`;
    console.error(`Erro ao atualizar carro ID ${id}:`, error);
    throw new CarroServiceError(message, 'UPDATE_CAR_ERROR');
  }
}

/**
 * Atualiza parcialmente um carro (PATCH - atualiza apenas os campos informados)
 * @param id ID do carro a atualizar
 * @param payload Campos a atualizar (todos opcionais)
 * @returns Promise<Carro> Carro atualizado
 * @throws CarroServiceError em caso de falha na requisição
 */
export async function atualizarParcialCarro(
  id: number,
  payload: Partial<AtualizarCarroPayload>
): Promise<Carro> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new CarroServiceError('ID inválido. Deve ser um número positivo.', 'INVALID_ID', 400);
  }

  try {
    return await apiPatch<Carro, Partial<AtualizarCarroPayload>>(
      `${BASE_URL}/${id}`,
      payload
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : `Erro ao atualizar parcialmente carro ID ${id}`;
    console.error(`Erro PATCH carro ID ${id}:`, error);
    throw new CarroServiceError(message, 'PATCH_CAR_ERROR');
  }
}

/**
 * Remove um carro do sistema
 * @param id ID do carro a remover
 * @returns Promise<void>
 * @throws CarroServiceError em caso de falha na requisição
 */
export async function removerCarro(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new CarroServiceError('ID inválido. Deve ser um número positivo.', 'INVALID_ID', 400);
  }

  try {
    await apiDelete<void>(`${BASE_URL}/${id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : `Erro ao remover carro ID ${id}`;
    console.error(`Erro ao remover carro ID ${id}:`, error);
    throw new CarroServiceError(message, 'DELETE_CAR_ERROR');
  }
}

/**
 * Filtros e Busca
 */

/**
 * Busca carros aplicando filtros
 * @param filtros Critérios de filtro (todos opcionais)
 * @returns Promise<Carro[]> Array com carros que correspondem aos filtros
 * @throws CarroServiceError em caso de falha na requisição
 */
export async function filtrarCarros(filtros: FiltroCarro): Promise<Carro[]> {
  try {
    const params = new URLSearchParams();

    const filtrosCleaned = Object.entries(filtros).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    );

    filtrosCleaned.forEach(([key, value]) => {
      params.append(key, String(value));
    });

    const query = params.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;

    return await apiGet<Carro[]>(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao filtrar carros';
    console.error('Erro ao filtrar carros:', error);
    throw new CarroServiceError(message, 'FILTER_CARS_ERROR');
  }
}

/**
 * Utilitários de Formatação
 */

/**
 * Formata uma placa removendo caracteres especiais e convertendo para maiúscula
 * @param placa Placa a formatar
 * @returns Placa formatada
 */
export function formatarPlaca(placa: string): string {
  if (!placa) return '';
  return placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Formata quilometragem para exibição localizada
 * @param valor Quilometragem em km
 * @returns String formatada com separador de milhares
 */
export function formatarQuilometragem(valor: number): string {
  if (!Number.isInteger(valor) || valor < 0) {
    return '0 km';
  }
  return `${valor.toLocaleString('pt-BR')} km`;
}

/**
 * Verifica se um veículo é considerado antigo (20+ anos)
 * @param ano Ano do veículo
 * @returns true se o veículo tem 20 ou mais anos
 */
export function carroAntigo(ano: number): boolean {
  const anoAtual = new Date().getFullYear();
  const idade = anoAtual - ano;
  return idade >= 20;
}

/**
 * Verifica a Saúde da API
 */

/**
 * Verifica se a API está disponível e respondendo
 * @returns Promise<boolean> true se a API está online
 */
export async function verificarStatusApi(): Promise<boolean> {
  try {
    await api.get(HEALTH_CHECK_URL);
    return true;
  } catch (error) {
    console.error('API offline:', error);
    return false;
  }
}

/**
 * 
 * Exportar Padrão
 * 
 */

const carroService = {
  listarCarros,
  buscarCarroPorId,
  criarCarro,
  atualizarCarro,
  atualizarParcialCarro,
  removerCarro,
  filtrarCarros,
  verificarStatusApi,
  formatarPlaca,
  formatarQuilometragem,
  carroAntigo,
};

export default carroService;
