import api, {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from './api';

/**
 * 
 * Interfaces
 * 
 */

export type StatusOrdem =
  | 'Aberta'
  | 'Pendente'
  | 'Em andamento'
  | 'Aguardando peça'
  | 'Concluída'
  | 'Finalizada'
  | 'Cancelada';

export interface OrdemServico {
  id: string;
  clienteId: string;
  carroId: string;
  clienteNome?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  quilometragem?: number;
  descricao: string;
  status: StatusOrdem;
  valor: number;
  dataEntrada: string;
  dataSaida?: string;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarOrdemPayload {
  clienteId: string;
  carroId: string;
  descricao: string;
  valor: number;
  observacoes?: string;
}

export interface AtualizarOrdemPayload {
  descricao?: string;
  status?: StatusOrdem;
  valor?: number;
  dataSaida?: string;
  observacoes?: string;
}

export interface FiltroOrdem {
  status?: StatusOrdem;
  clienteId?: string;
  carroId?: string;
  dataInicio?: string;
  dataFim?: string;
}

/**
 * 
 * Url Base
 * 
 */

const BASE_URL = '/ordens';

/**
 * 
 * Validadores
 * 
 */

function validarValor(valor: number): boolean {
  return valor >= 0;
}

function validarDescricao(descricao: string): boolean {
  return descricao.trim().length >= 10;
}

function validarStatus(status: StatusOrdem): boolean {
  return [
    'Pendente',
    'Em andamento',
    'Concluída',
    'Cancelada',
  ].includes(status);
}

function validarCriacao(payload: CriarOrdemPayload) {
  if (!payload.clienteId) {
    throw new Error('Cliente é obrigatório.');
  }

  if (!payload.carroId) {
    throw new Error('Carro é obrigatório.');
  }

  if (!validarDescricao(payload.descricao)) {
    throw new Error(
      'Descrição deve possuir no mínimo 10 caracteres.'
    );
  }

  if (!validarValor(payload.valor)) {
    throw new Error('Valor inválido.');
  }
}

/**
 * 
 * Crud Ordens
 * 
 */

/**
 * Buscar Todas As Ordens
 */
export async function listarOrdens(): Promise<OrdemServico[]> {
  try {
    return await apiGet<OrdemServico[]>(`${BASE_URL}/`);
  } catch (error) {
    console.error('Erro ao listar ordens:', error);
    throw error;
  }
}

/**
 * Buscar Ordem Por ID
 */
export async function buscarOrdemPorId(
  id: string
): Promise<OrdemServico> {
  try {
    return await apiGet<OrdemServico>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar ordem ID ${id}:`, error);
    throw error;
  }
}

/**
 * Criar Ordem
 */
export async function criarOrdem(
  payload: CriarOrdemPayload
): Promise<OrdemServico> {
  try {
    validarCriacao(payload);

    return await apiPost<OrdemServico, CriarOrdemPayload>(
      `${BASE_URL}/`,
      payload
    );
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    throw error;
  }
}

/**
 * Atualizar Ordem
 */
export async function atualizarOrdem(
  id: string,
  payload: AtualizarOrdemPayload
): Promise<OrdemServico> {
  try {
    if (
      payload.descricao &&
      !validarDescricao(payload.descricao)
    ) {
      throw new Error(
        'Descrição deve possuir no mínimo 10 caracteres.'
      );
    }

    if (
      payload.status &&
      !validarStatus(payload.status)
    ) {
      throw new Error('Status inválido.');
    }

    if (
      payload.valor !== undefined &&
      !validarValor(payload.valor)
    ) {
      throw new Error('Valor inválido.');
    }

    return await apiPut<OrdemServico, AtualizarOrdemPayload>(
      `${BASE_URL}/${id}`,
      payload
    );
  } catch (error) {
    console.error(`Erro ao atualizar ordem ID ${id}:`, error);
    throw error;
  }
}

/**
 * Atualização Parcial
 */
export async function atualizarParcialOrdem(
  id: string,
  payload: Partial<AtualizarOrdemPayload>
): Promise<OrdemServico> {
  try {
    return await apiPatch<OrdemServico, Partial<AtualizarOrdemPayload>>(
      `${BASE_URL}/${id}`,
      payload
    );
  } catch (error) {
    console.error(`Erro PATCH ordem ID ${id}:`, error);
    throw error;
  }
}

/**
 * Remover Ordem
 */
export async function removerOrdem(id: string): Promise<void> {
  try {
    await apiDelete<void>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao remover ordem ID ${id}:`, error);
    throw error;
  }
}

/**
 * 
 * Filtros
 * 
 */

/**
 * Filtrar Ordens
 */
export async function filtrarOrdens(
  filtros: FiltroOrdem
): Promise<OrdemServico[]> {
  try {
    const params = new URLSearchParams();

    if (filtros.status) {
      params.append('status', filtros.status);
    }

    if (filtros.clienteId) {
      params.append('clienteId', filtros.clienteId.toString());
    }

    if (filtros.carroId) {
      params.append('carroId', filtros.carroId.toString());
    }

    if (filtros.dataInicio) {
      params.append('dataInicio', filtros.dataInicio);
    }

    if (filtros.dataFim) {
      params.append('dataFim', filtros.dataFim);
    }

    const query = params.toString();

    return await apiGet<OrdemServico[]>(
      `${BASE_URL}?${query}`
    );
  } catch (error) {
    console.error('Erro ao filtrar ordens:', error);
    throw error;
  }
}

/**
 * 
 * Utilitários
 * 
 */

/**
 * Formatar Valor Monetário
 */
export function formatarValor(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formatar Data
 */
export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR');
}

/**
 * Status colorido
 */
export function obterCorStatus(status: StatusOrdem): string {
  switch (status) {
    case 'Pendente':
      return 'yellow';

    case 'Em andamento':
      return 'blue';

    case 'Concluída':
      return 'green';

    case 'Cancelada':
      return 'red';

    default:
      return 'gray';
  }
}

/**
 * Verificar Atraso
 */
export function ordemAtrasada(
  dataEntrada: string,
  status: StatusOrdem
): boolean {
  if (status === 'Concluída') {
    return false;
  }

  const entrada = new Date(dataEntrada);
  const hoje = new Date();

  const diferencaDias = Math.floor(
    (hoje.getTime() - entrada.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return diferencaDias > 7;
}

/**
 * 
 * Estatísticas
 * 
 */

export async function obterResumoOrdens() {
  try {
    return await apiGet<{
      pendentes: number;
      andamento: number;
      concluidas: number;
      canceladas: number;
      faturamento: number;
    }>(`${BASE_URL}/resumo`);
  } catch (error) {
    console.error('Erro ao obter resumo ordens:', error);
    throw error;
  }
}

/**
 * 
 * Verificação
 * 
 */

export async function verificarApiOrdens(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('Erro conexão API ordens:', error);
    return false;
  }
}

/**
 * 
 * Exportar Padrão
 * 
 */

const ordemService = {
  listarOrdens,
  buscarOrdemPorId,
  criarOrdem,
  atualizarOrdem,
  atualizarParcialOrdem,
  removerOrdem,
  filtrarOrdens,
  formatarValor,
  formatarData,
  obterCorStatus,
  ordemAtrasada,
  obterResumoOrdens,
  verificarApiOrdens,
};

export default ordemService;
