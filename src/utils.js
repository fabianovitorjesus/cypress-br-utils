/**
 * Gera um número inteiro aleatório entre min e max (inclusive).
 * Usada internamente pelos geradores de documentos.
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
