/**
 * Validators - Sistema Oficina Pro
 * Módulo centralizado de validações com tipagem forte e mensagens customizadas
 */

import type {
  Cliente,
  ClienteFormData,
  Carro,
  CarroFormData,
  OrdemServico,
  OrdemServicoFormData,
  LoginPayload,
  RegisterPayload,
  Usuario,
} from '../types';

/* 
   Tipos de Validação
*/

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidatorRule<T> {
  validate: (value: T) => ValidationResult | Promise<ValidationResult>;
  message?: string;
}

export type ValidatorFunction<T> = (value: T) => ValidationResult | Promise<ValidationResult>;

/* 
   Padrões de Validação
*/

const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  telefone: /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
  cep: /^\d{5}-?\d{3}$/,
  placa: /^[A-Z]{3}-\d{4}|[A-Z]{3}\d[A-Z]\d{2}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
} as const;

const MESSAGES = {
  required: 'Este campo é obrigatório',
  email: 'Email inválido',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  cpf: 'CPF inválido',
  telefone: 'Telefone inválido',
  cep: 'CEP inválido',
  placa: 'Placa de veículo inválida',
  number: 'Deve ser um número',
  positive: 'Deve ser um número positivo',
  passwordMismatch: 'Senhas não correspondem',
  ano: 'Ano deve estar entre 1900 e ano atual',
  quilometragem: 'Quilometragem deve ser um número positivo',
  url: 'URL inválida',
} as const;

/* 
   Validadores Básicos
*/

export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value != null;
};

export const isEmail = (email: string): boolean => {
  return PATTERNS.email.test(email);
};

export const isCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  let sum = 0;
  let remainder: number;

  if (cleaned === '00000000000') return false;

  for (let i = 1; i <= 9; i++)
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

export const isTelefone = (telefone: string): boolean => {
  return PATTERNS.telefone.test(telefone.replace(/\s/g, ''));
};

export const isCEP = (cep: string): boolean => {
  return PATTERNS.cep.test(cep);
};

export const isPlaca = (placa: string): boolean => {
  return PATTERNS.placa.test(placa.toUpperCase());
};

export const isURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return PATTERNS.url.test(url);
  }
};

export const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
};

export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/*
   Validadores Compostos
*/

export const validateString = (
  value: any,
  { minLength, maxLength }: { minLength?: number; maxLength?: number } = {}
): ValidationResult => {
  if (!isRequired(value)) {
    return { isValid: false, errors: { value: MESSAGES.required } };
  }

  const str = String(value).trim();

  if (minLength && str.length < minLength) {
    return {
      isValid: false,
      errors: { value: MESSAGES.minLength(minLength) },
    };
  }

  if (maxLength && str.length > maxLength) {
    return {
      isValid: false,
      errors: { value: MESSAGES.maxLength(maxLength) },
    };
  }

  return { isValid: true, errors: {} };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!isRequired(email)) {
    return { isValid: false, errors: { email: MESSAGES.required } };
  }

  if (!isEmail(email)) {
    return { isValid: false, errors: { email: MESSAGES.email } };
  }

  return { isValid: true, errors: {} };
};

export const validateCPF = (cpf: string): ValidationResult => {
  if (!isRequired(cpf)) {
    return { isValid: false, errors: { cpf: MESSAGES.required } };
  }

  if (!isCPF(cpf)) {
    return { isValid: false, errors: { cpf: MESSAGES.cpf } };
  }

  return { isValid: true, errors: {} };
};

export const validateTelefone = (telefone: string): ValidationResult => {
  if (!isRequired(telefone)) {
    return { isValid: false, errors: { telefone: MESSAGES.required } };
  }

  if (!isTelefone(telefone)) {
    return { isValid: false, errors: { telefone: MESSAGES.telefone } };
  }

  return { isValid: true, errors: {} };
};

export const validateCEP = (cep: string): ValidationResult => {
  if (!isRequired(cep)) {
    return { isValid: false, errors: { cep: MESSAGES.required } };
  }

  if (!isCEP(cep)) {
    return { isValid: false, errors: { cep: MESSAGES.cep } };
  }

  return { isValid: true, errors: {} };
};

export const validatePlaca = (placa: string): ValidationResult => {
  if (!isRequired(placa)) {
    return { isValid: false, errors: { placa: MESSAGES.required } };
  }

  if (!isPlaca(placa)) {
    return { isValid: false, errors: { placa: MESSAGES.placa } };
  }

  return { isValid: true, errors: {} };
};

export const validatePassword = (
  password: string,
  minLength = 8
): ValidationResult => {
  if (!isRequired(password)) {
    return { isValid: false, errors: { password: MESSAGES.required } };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      errors: { password: MESSAGES.minLength(minLength) },
    };
  }

  return { isValid: true, errors: {} };
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errors: { confirmPassword: MESSAGES.passwordMismatch },
    };
  }

  return { isValid: true, errors: {} };
};

export const validateYear = (year: number): ValidationResult => {
  if (!isRequired(year)) {
    return { isValid: false, errors: { ano: MESSAGES.required } };
  }

  if (!isValidYear(year)) {
    return { isValid: false, errors: { ano: MESSAGES.ano } };
  }

  return { isValid: true, errors: {} };
};

export const validateQuilometragem = (km: any): ValidationResult => {
  if (!isRequired(km)) {
    return {
      isValid: false,
      errors: { quilometragem: MESSAGES.required },
    };
  }

  if (!isPositiveNumber(km)) {
    return {
      isValid: false,
      errors: { quilometragem: MESSAGES.quilometragem },
    };
  }

  return { isValid: true, errors: {} };
};

/*
   Validadores de Forma
*/

export const validateLoginPayload = (
  payload: unknown
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: { form: 'Dados inválidos' },
    };
  }

  const data = payload as Partial<LoginPayload>;

  const emailValidation = validateEmail(data.email || '');
  if (!emailValidation.isValid) {
    Object.assign(errors, emailValidation.errors);
  }

  const passwordValidation = validatePassword(data.senha || '');
  if (!passwordValidation.isValid) {
    Object.assign(errors, passwordValidation.errors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
};

export const validateRegisterPayload = (
  payload: unknown
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: { form: 'Dados inválidos' },
    };
  }

  const data = payload as Partial<RegisterPayload>;

  const nomeValidation = validateString(data.nome, { minLength: 3, maxLength: 120 });
  if (!nomeValidation.isValid) {
    errors.nome = nomeValidation.errors.value || MESSAGES.required;
  }

  const emailValidation = validateEmail(data.email || '');
  if (!emailValidation.isValid) {
    Object.assign(errors, emailValidation.errors);
  }

  const senhaValidation = validatePassword(data.senha || '');
  if (!senhaValidation.isValid) {
    errors.senha = senhaValidation.errors.password || MESSAGES.required;
  }

  const senhaMatchValidation = validatePasswordMatch(
    data.senha || '',
    data.confirmarSenha || ''
  );
  if (!senhaMatchValidation.isValid) {
    Object.assign(errors, senhaMatchValidation.errors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
};

export const validateClienteFormData = (
  data: unknown
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { form: 'Dados inválidos' } };
  }

  const formData = data as Partial<ClienteFormData>;

  const nomeVal = validateString(formData.nome, { minLength: 3, maxLength: 150 });
  if (!nomeVal.isValid) errors.nome = nomeVal.errors.value || MESSAGES.required;

  const emailVal = validateEmail(formData.email || '');
  if (!emailVal.isValid) Object.assign(errors, emailVal.errors);

  const telefoneVal = validateTelefone(formData.telefone || '');
  if (!telefoneVal.isValid) Object.assign(errors, telefoneVal.errors);

  const cpfVal = validateCPF(formData.cpf || '');
  if (!cpfVal.isValid) Object.assign(errors, cpfVal.errors);

  const enderecoVal = validateString(formData.endereco, { minLength: 5, maxLength: 255 });
  if (!enderecoVal.isValid) errors.endereco = enderecoVal.errors.value || MESSAGES.required;

  const cidadeVal = validateString(formData.cidade, { minLength: 2, maxLength: 100 });
  if (!cidadeVal.isValid) errors.cidade = cidadeVal.errors.value || MESSAGES.required;

  const estadoVal = validateString(formData.estado, { minLength: 2, maxLength: 2 });
  if (!estadoVal.isValid) errors.estado = estadoVal.errors.value || MESSAGES.required;

  if (formData.cep) {
    const cepVal = validateCEP(formData.cep);
    if (!cepVal.isValid) Object.assign(errors, cepVal.errors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
};

export const validateCarroFormData = (
  data: unknown
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { form: 'Dados inválidos' } };
  }

  const formData = data as Partial<CarroFormData>;

  const marcaVal = validateString(formData.marca, { minLength: 2, maxLength: 100 });
  if (!marcaVal.isValid) errors.marca = marcaVal.errors.value || MESSAGES.required;

  const modeloVal = validateString(formData.modelo, { minLength: 2, maxLength: 100 });
  if (!modeloVal.isValid) errors.modelo = modeloVal.errors.value || MESSAGES.required;

  const anoVal = validateYear(formData.ano || 0);
  if (!anoVal.isValid) Object.assign(errors, anoVal.errors);

  const placaVal = validatePlaca(formData.placa || '');
  if (!placaVal.isValid) Object.assign(errors, placaVal.errors);

  const corVal = validateString(formData.cor, { minLength: 2, maxLength: 50 });
  if (!corVal.isValid) errors.cor = corVal.errors.value || MESSAGES.required;

  const kmVal = validateQuilometragem(formData.quilometragem);
  if (!kmVal.isValid) Object.assign(errors, kmVal.errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
};

export const validateOrdemServicoFormData = (
  data: unknown
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { form: 'Dados inválidos' } };
  }

  const formData = data as Partial<OrdemServicoFormData>;

  if (!isRequired(formData.clienteId)) {
    errors.clienteId = MESSAGES.required;
  }

  if (!isRequired(formData.carroId)) {
    errors.carroId = MESSAGES.required;
  }

  const descVal = validateString(formData.descricao, { minLength: 5, maxLength: 500 });
  if (!descVal.isValid) errors.descricao = descVal.errors.value || MESSAGES.required;

  if (!isRequired(formData.valor)) {
    errors.valor = MESSAGES.required;
  } else if (!isPositiveNumber(formData.valor)) {
    errors.valor = MESSAGES.positive;
  }

  if (formData.observacoes) {
    const obsVal = validateString(formData.observacoes, { maxLength: 1000 });
    if (!obsVal.isValid) errors.observacoes = obsVal.errors.value;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
};

/* 
   Utilitários
*/

export const getFirstError = (validationResult: ValidationResult): string | null => {
  return validationResult.firstError || null;
};

export const hasError = (
  validationResult: ValidationResult,
  fieldName: string
): boolean => {
  return fieldName in validationResult.errors;
};

export const getError = (
  validationResult: ValidationResult,
  fieldName: string
): string | null => {
  return validationResult.errors[fieldName] || null;
};

export default {
  validateLoginPayload,
  validateRegisterPayload,
  validateClienteFormData,
  validateCarroFormData,
  validateOrdemServicoFormData,
};
