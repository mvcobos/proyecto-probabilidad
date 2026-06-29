/**
 * resultado.model.ts
 * -------------------------------------------------------------
 * Modelos base del módulo de Resultados de Percepción Estudiantil.
 *
 * Ubicación: src/app/core/models/resultado.model.ts
 *
 * ¿Por qué un modelo base "SentimientoStats"?
 * Los tres valores (positivo / neutro / negativo) y el total aparecen
 * en TODOS los niveles del dashboard: global, por grupo y por materia.
 * En lugar de repetir esos campos en cada interfaz, los definimos una
 * sola vez aquí y los reutilizamos (principio DRY).
 */

/**
 * Distribución de sentimiento en PORCENTAJES (0–100).
 * positivo + neutro + negativo debe sumar 100.
 */
export interface SentimientoStats {
  /** % de comentarios clasificados como Positivos */
  positivo: number;
  /** % de comentarios clasificados como Neutros */
  neutro: number;
  /** % de comentarios clasificados como Negativos */
  negativo: number;
  /** Número absoluto de comentarios/respuestas que respaldan esos % */
  totalRespuestas: number;
}

/** Etiquetas de sentimiento como tipo cerrado (evita strings sueltos). */
export type Sentimiento = 'positivo' | 'neutro' | 'negativo';