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

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarClientePayload {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
}

export interface AtualizarClientePayload {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

export interface FiltroCliente {
  nome?: string;
  email?: string;
  cidade?: string;
  estado?: string;
}

/**
 * 
 * Url Base
 * 
 */

const BASE_URL = '/clientes';

/**
 * 
 * Validações
 * 
 */

function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');

  return cpfLimpo.length === 11;
}

function validarTelefone(telefone: string): boolean {
  const telefoneLimpo = telefone.replace(/\D/g, '');

  return telefoneLimpo.length >= 10;
}

function validarCliente(payload: CriarClientePayload) {
  if (!payload.nome.trim()) {
    throw new Error('Nome é obrigatório.');
  }

  if (!validarEmail(payload.email)) {
    throw new Error('Email inválido.');
  }

  if (!validarCPF(payload.cpf)) {
    throw new Error('CPF inválido.');
  }

  if (!validarTelefone(payload.telefone)) {
    throw new Error('Telefone inválido.');
  }

  if (!payload.endereco.trim()) {
    throw new Error('Endereço é obrigatório.');
  }

  if (!payload.cidade.trim()) {
    throw new Error('Cidade é obrigatória.');
  }

  if (!payload.estado.trim()) {
    throw new Error('Estado é obrigatório.');
  }
}

/**
 * 
 *  Crud Clientes
 * 
 */

/**
 * Buscar Todos Os Clientes
 */
export async function listarClientes(): Promise<Cliente[]> {
  try {
    return await apiGet<Cliente[]>(BASE_URL);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    throw error;
  }
}

/**
 * Buscar cliente por ID
 */
export async function buscarClientePorId(
  id: number
): Promise<Cliente> {
  try {
    return await apiGet<Cliente>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar cliente ID ${id}:`, error);
    throw error;
  }
}

/**
 * Criar Cliente
 */
export async function criarCliente(
  payload: CriarClientePayload
): Promise<Cliente> {
  try {
    validarCliente(payload);

    return await apiPost<Cliente, CriarClientePayload>(
      BASE_URL,
      payload
    );
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

/**
 * Atualizar Cliente
 */
export async function atualizarCliente(
  id: number,
  payload: AtualizarClientePayload
): Promise<Cliente> {
  try {
    if (payload.email && !validarEmail(payload.email)) {
      throw new Error('Email inválido.');
    }

    if (payload.cpf && !validarCPF(payload.cpf)) {
      throw new Error('CPF inválido.');
    }

    if (
      payload.telefone &&
      !validarTelefone(payload.telefone)
    ) {
      throw new Error('Telefone inválido.');
    }

    return await apiPut<Cliente, AtualizarClientePayload>(
      `${BASE_URL}/${id}`,
      payload
    );
  } catch (error) {
    console.error(`Erro ao atualizar cliente ID ${id}:`, error);
    throw error;
  }
}

/**
 * Atualização Parcial Do Cliente
 */
export async function atualizarParcialCliente(
  id: number,
  payload: Partial<AtualizarClientePayload>
): Promise<Cliente> {
  try {
    return await apiPatch<Cliente, Partial<AtualizarClientePayload>>(
      `${BASE_URL}/${id}`,
      payload
    );
  } catch (error) {
    console.error(`Erro PATCH cliente ID ${id}:`, error);
    throw error;
  }
}

/**
 * Remover Cliente
 */
export async function removerCliente(id: number): Promise<void> {
  try {
    await apiDelete<void>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao remover cliente ID ${id}:`, error);
    throw error;
  }
}

/**
 * 
 * Filtros
 * 
 */

/**
 * Buscar Clientes Filtrados
 */
export async function filtrarClientes(
  filtros: FiltroCliente
): Promise<Cliente[]> {
  try {
    const params = new URLSearchParams();

    if (filtros.nome) {
      params.append('nome', filtros.nome);
    }

    if (filtros.email) {
      params.append('email', filtros.email);
    }

    if (filtros.cidade) {
      params.append('cidade', filtros.cidade);
    }

    if (filtros.estado) {
      params.append('estado', filtros.estado);
    }

    const query = params.toString();

    return await apiGet<Cliente[]>(
      `${BASE_URL}?${query}`
    );
  } catch (error) {
    console.error('Erro ao filtrar clientes:', error);
    throw error;
  }
}

/**
 * 
 * Formatadores
 * 
 */

/**
 * Formatar CPF
 */
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, '');

  return cpfLimpo.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  );
}

/**
 * Formatar Telefone
 */
export function formatarTelefone(
  telefone: string
): string {
  const telefoneLimpo = telefone.replace(/\D/g, '');

  if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    );
  }

  return telefoneLimpo.replace(
    /(\d{2})(\d{4})(\d{4})/,
    '($1) $2-$3'
  );
}

/**
 * Nome Abreviado
 */
export function abreviarNome(nome: string): string {
  const partes = nome.split(' ');

  if (partes.length <= 2) {
    return nome;
  }

  return `${partes[0]} ${partes[partes.length - 1]}`;
}

/**
 * 
 * Verificação
 * 
 */

export async function verificarApiClientes(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('Erro conexão API clientes:', error);
    return false;
  }
}

/**
 * 
 * Exportar Padrão
 * 
 */

const clienteService = {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  atualizarParcialCliente,
  removerCliente,
  filtrarClientes,
  verificarApiClientes,
  formatarCPF,
  formatarTelefone,
  abreviarNome,
};

export default clienteService;
