/* 
   Types Globais
   Sistema Oficina Pro
 */

/* 
   Tipos Genéricos
*/

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = number | string;

export type Timestamp = string;

export type Status =
  | 'ativo'
  | 'inativo'
  | 'pendente'
  | 'cancelado';

export type ThemeMode = 'light' | 'dark';

/* 
   Usuário
*/

export interface Usuario {
  id: ID;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  cargo?: string;
  status: Status;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  usuario: Usuario;
}

/* 
   Clientes
*/

export interface Cliente {
  id: ID;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  status: Status;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface ClienteFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
}

/* 
    Carros
*/

export interface Carro {
  id: ID;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  clienteId: ID;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CarroFormData {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  clienteId: ID;
}

/* 
   Ordens De Serviço
*/

export type OrdemStatus =
  | 'pendente'
  | 'em_andamento'
  | 'concluida'
  | 'cancelada';

export interface OrdemServico {
  id: ID;
  clienteId: ID;
  carroId: ID;
  descricao: string;
  status: OrdemStatus;
  valor: number;
  observacoes?: string;
  dataEntrada: Timestamp;
  dataSaida?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface OrdemServicoFormData {
  clienteId: ID;
  carroId: ID;
  descricao: string;
  valor: number;
  observacoes?: string;
}

/* 
   API
*/

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

/* 
   Filtros
*/

export interface ClienteFiltro {
  nome?: string;
  email?: string;
  cidade?: string;
  estado?: string;
}

export interface CarroFiltro {
  marca?: string;
  modelo?: string;
  placa?: string;
  ano?: number;
}

export interface OrdemFiltro {
  status?: OrdemStatus;
  clienteId?: ID;
  carroId?: ID;
  dataInicio?: Timestamp;
  dataFim?: Timestamp;
}

/* 
   Componentes
*/

export interface ButtonProps {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'outline';
  onClick?: () => void;
}

export interface InputProps {
  label?: string;
  name: string;
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

/* 
   Dashboard
*/

export interface DashboardCard {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

export interface DashboardResumo {
  totalClientes: number;
  totalCarros: number;
  totalOrdens: number;
  faturamentoMensal: number;
}

/* 
    Notificações
*/

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Timestamp;
}

/* 
   Configurações
*/

export interface AppConfig {
  appName: string;
  version: string;
  apiUrl: string;
  environment: 'development' | 'production';
}

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
}

/* 
   Utilitários
*/

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type AsyncFunction<T = void> = () => Promise<T>;

export type VoidFunction = () => void;

/* 
    Exportar Padrão
*/

export default {};