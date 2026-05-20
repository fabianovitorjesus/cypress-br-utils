/**
 * Gerador de CNPJ válido para uso em testes automatizados.
 *
 * O CNPJ tem 14 dígitos: 8 da empresa + 4 da filial + 2 dígitos verificadores.
 * Os dígitos verificadores são calculados pelo algoritmo Módulo 11,
 * conforme as regras da Receita Federal.
 *
 * Por que isso existe?
 * Hardcodar um CNPJ fixo nos testes causa falhas quando o sistema
 * detecta duplicidade ou bloqueia documentos já cadastrados.
 * Este gerador cria um CNPJ novo e matematicamente válido a cada execução.
 */

import { randInt } from './utils.js';

function calcularDigito(sequencia, pesos) {
  let soma = 0;
  for (let i = 0; i < sequencia.length; i++) {
    soma += parseInt(sequencia[i]) * pesos[i];
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Gera um CNPJ válido.
 * @param {Object} options
 * @param {boolean} [options.formatted=true] - true retorna "XX.XXX.XXX/XXXX-XX", false retorna só os 14 dígitos
 * @returns {string}
 *
 * @example
 * generateCNPJ()             // "12.345.678/0001-90"
 * generateCNPJ({ formatted: false }) // "12345678000190"
 */
export function generateCNPJ({ formatted = true } = {}) {
  const base = Array.from({ length: 8 }, () => randInt(0, 9)).join('');
  const filial = '0001'; // filial padrão para testes
  const cnpjBase = base + filial;

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digito1 = calcularDigito(cnpjBase, pesos1);

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digito2 = calcularDigito(cnpjBase + digito1, pesos2);

  const cnpjCompleto = cnpjBase + digito1 + digito2;

  if (!formatted) return cnpjCompleto;

  return cnpjCompleto.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}
