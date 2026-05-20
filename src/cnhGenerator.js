/**
 * Gerador de CNH válida para uso em testes automatizados.
 *
 * A CNH tem 11 dígitos: 9 da base + 2 dígitos verificadores.
 * O algoritmo é definido pelo DENATRAN e tem uma particularidade:
 * se o primeiro dígito verificador for >= 10, ele vira 0 e
 * um ajuste de -2 é aplicado no cálculo do segundo dígito.
 * Esse detalhe é ignorado na maioria das implementações que circulam
 * na internet — e gera CNHs inválidas silenciosamente.
 *
 * Por que isso existe?
 * Sistemas de frota e logística validam CNH de condutores com frequência.
 * Um número inválido quebra o teste no lugar errado,
 * dificultando o diagnóstico da falha real.
 */

import { randInt } from './utils.js';

/**
 * Gera um número de CNH válido.
 * @returns {string} 11 dígitos sem formatação (CNH não tem máscara oficial)
 *
 * @example
 * generateCNH() // "12345678900"
 */
export function generateCNH() {
  const base = Array.from({ length: 9 }, () => randInt(0, 9));

  // Primeiro dígito verificador: pesos decrescentes de 9 a 1
  let soma1 = 0;
  for (let i = 0, peso = 9; i < 9; i++, peso--) {
    soma1 += base[i] * peso;
  }
  let dv1 = soma1 % 11;
  let ajuste = 0;
  if (dv1 >= 10) {
    dv1 = 0;
    ajuste = -2; // ajuste DENATRAN aplicado ao segundo dígito
  }

  // Segundo dígito verificador: pesos crescentes de 1 a 9, com ajuste
  let soma2 = 0;
  for (let i = 0, peso = 1; i < 9; i++, peso++) {
    soma2 += base[i] * peso;
  }
  let dv2 = (soma2 % 11) + ajuste;
  if (dv2 < 0) dv2 += 11;
  if (dv2 >= 10) dv2 = 0;

  return [...base, dv1, dv2].join('');
}
