/**
 * Gerador de CPF válido para uso em testes automatizados.
 *
 * O CPF tem 11 dígitos: 9 da base + 2 dígitos verificadores.
 * Os dígitos verificadores são calculados pelo algoritmo Módulo 11,
 * conforme as regras da Receita Federal.
 *
 * Por que isso existe?
 * Igual ao CNPJ: CPF fixo no teste cria dependência de dado,
 * que pode ser bloqueado, duplicado ou inválido em diferentes ambientes.
 */

import { randInt } from './utils.js';

function calcularDigito(base, pesoInicial) {
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * (pesoInicial - i);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Gera um CPF válido.
 * @param {Object} options
 * @param {boolean} [options.formatted=true] - true retorna "XXX.XXX.XXX-XX", false retorna só os 11 dígitos
 * @returns {string}
 *
 * @example
 * generateCPF()             // "123.456.789-09"
 * generateCPF({ formatted: false }) // "12345678909"
 */
export function generateCPF({ formatted = true } = {}) {
  const base = Array.from({ length: 9 }, () => randInt(0, 9)).join('');

  const digito1 = calcularDigito(base, 10);
  const digito2 = calcularDigito(base + digito1, 11);

  const cpfCompleto = base + digito1 + digito2;

  if (!formatted) return cpfCompleto;

  return cpfCompleto.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}
