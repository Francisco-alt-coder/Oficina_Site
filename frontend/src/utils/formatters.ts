/**
 * Utilitários de formatação para a aplicação
 * Fornece funções para padronizar dados de entrada e saída
 */

 
// Formatação De Moeda
 

export const formatCurrency = (value: number, currency = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};


// Formatação De Data
 

export const formatDate = (date: Date | string, format = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', String(year))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

export const parseDate = (value: string): Date | null => {
  const [day, month, year] = value.split('/');
  if (!day || !month || !year) return null;

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return isNaN(date.getTime()) ? null : date;
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'agora mesmo';
  if (diffMin < 60) return `${diffMin}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return formatDate(dateObj, 'dd/MM/yyyy');
};

 
// Formatação De Números

export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${formatNumber(value * 100, decimals)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(2)} ${units[index]}`;
};


// Formatação De Documento

export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length !== 11) return cleaned;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  return remainder === parseInt(cleaned.substring(10, 11));
};

export const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length !== 14) return cleaned;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return cleaned;
};

export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length !== 8) return cleaned;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};


// Formatação De Texto

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const titleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const truncate = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

export const slug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};


// Formatação De Booleano E Estados

export const formatBoolean = (value: boolean): string => {
  return value ? 'Sim' : 'Não';
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    rejected: 'Rejeitado',
    approved: 'Aprovado',
  };

  return statusMap[status.toLowerCase()] || capitalize(status);
};

// Formatação De Arrays E Listas

export const formatList = (items: string[], separator = ', ', lastSeparator = ' e '): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]}${lastSeparator}${items[1]}`;

  return `${items.slice(0, -1).join(separator)}${lastSeparator}${items[items.length - 1]}`;
};

// Sanitização E Validação

export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const removeSpecialChars = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};
