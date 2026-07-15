/**
 * algoritmo-estadistica.model.ts
 * -------------------------------------------------------------
 * Modelos del módulo de Comparación de Algoritmos.
 * Ubicación: src/app/core/models/algoritmo-estadistica.model.ts
 *
 * Separamos los modelos por la misma razón que en Resultados: definen
 * la FORMA de los datos, independiente de su origen (hoy mock, mañana
 * API). Así los componentes no cambian cuando lleguen datos reales.
 */

/**
 * Métricas de un algoritmo de clasificación. Todas en escala 0–1
 * (se muestran como decimales 0.00–1.00). El tiempo va aparte porque
 * está en segundos, no en esa escala.
 */
export interface AlgoritmoEstadistica {
  /** Nombre del algoritmo (ej. "Naive Bayes"). */
  nombre: string;
  /** Proporción de predicciones correctas. */
  accuracy: number;
  /** Proporción de predicciones positivas que fueron correctas. */
  precision: number;
  /** Proporción de positivos reales correctamente identificados. */
  recall: number;
  /** Media armónica entre precision y recall. */
  f1: number;
  /** Tiempo de clasificación sobre el conjunto de prueba, en segundos. */
  tiempoSegundos: number;
}

/**
 * Matriz de confusión 3x3 para las clases Positivo / Neutro / Negativo.
 * Cada fila = clase REAL, cada columna = clase PREDICHA.
 * La diagonal (real == predicho) son los aciertos.
 */
export interface MatrizConfusion {
  /** Algoritmo al que pertenece esta matriz. */
  algoritmo: string;
  /** Orden de las clases, para etiquetar filas y columnas. */
  clases: string[];
  /**
   * Filas en el mismo orden que 'clases'. valores[i][j] = casos cuya
   * clase real es clases[i] y fueron predichos como clases[j].
   */
  valores: number[][];
}

/**
 * Paquete completo que el servicio entrega a la vista: la materia
 * analizada, la tabla de algoritmos y la matriz del mejor algoritmo.
 */
export interface ComparacionAlgoritmos {
  materia: string;
  totalComentarios: number;
  algoritmos: AlgoritmoEstadistica[];
  /** Matriz de confusión del algoritmo con mejor F1. */
  matrizMejor: MatrizConfusion;
}

/**
 * Resultado de intentar comparar los algoritmos para una materia: o hay
 * comentarios suficientes (comparación completa) o no los hay, y la vista
 * debe mostrar un aviso de "datos insuficientes" en vez de cifras.
 */
export type ResultadoComparacion =
  | { suficiente: true; datos: ComparacionAlgoritmos }
  | { suficiente: false; totalComentarios: number; minimo: number };