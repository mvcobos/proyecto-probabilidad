/**
 * tipos.ts
 * -------------------------------------------------------------
 * Tipos compartidos por el motor de clasificación.
 */

/** Las tres clases posibles de un comentario. */
export type Clase = 'Positivo' | 'Neutro' | 'Negativo';

/** Orden fijo de las clases (para matrices y métricas consistentes). */
export const CLASES: Clase[] = ['Positivo', 'Neutro', 'Negativo'];

/** Un ejemplo de entrenamiento: un texto y su etiqueta verdadera. */
export interface Ejemplo {
  texto: string;
  etiqueta: Clase;
}

/** Contrato que cumplen los 4 algoritmos. */
export interface Clasificador {
  readonly nombre: string;
  entrenar(ejemplos: Ejemplo[]): void;
  predecir(texto: string): Clase;
}
