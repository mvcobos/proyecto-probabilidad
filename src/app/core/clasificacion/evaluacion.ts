/**
 * evaluacion.ts
 * -------------------------------------------------------------
 * Herramientas para medir el desempeño de un clasificador:
 *  - división estratificada train/test (mantiene la proporción de clases)
 *  - matriz de confusión
 *  - accuracy, precision, recall y F1 (promedio macro)
 *
 * El promedio "macro" trata a las tres clases por igual, sin importar
 * cuántos ejemplos tenga cada una. Es lo adecuado cuando las clases están
 * desbalanceadas (ej. muchos comentarios positivos y pocos negativos),
 * situación habitual en este tipo de encuestas.
 */
import { Clase, CLASES, Ejemplo } from './tipos';

export interface Metricas {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

/** Generador pseudoaleatorio determinista (misma semilla -> mismo split). */
function rng(seed: number): () => number {
  let estado = seed % 2147483647;
  if (estado <= 0) estado += 2147483646;
  return () => {
    estado = (estado * 16807) % 2147483647;
    return (estado - 1) / 2147483646;
  };
}

/** Baraja una copia del arreglo con Fisher-Yates y semilla fija. */
function barajar<T>(arr: T[], aleatorio: () => number): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * División estratificada. Para cada clase, separa una fracción para
 * prueba, de modo que ambos subconjuntos conserven la mezcla de clases.
 */
export function dividirEstratificado(
  ejemplos: Ejemplo[],
  fraccionPrueba = 0.3,
  semilla = 42
): { train: Ejemplo[]; test: Ejemplo[] } {
  const aleatorio = rng(semilla);
  const train: Ejemplo[] = [];
  const test: Ejemplo[] = [];

  for (const c of CLASES) {
    const deClase = barajar(ejemplos.filter(e => e.etiqueta === c), aleatorio);
    const nTest = Math.round(deClase.length * fraccionPrueba);
    test.push(...deClase.slice(0, nTest));
    train.push(...deClase.slice(nTest));
  }

  return { train, test };
}

/** Matriz de confusión: filas = clase real, columnas = clase predicha. */
export function matrizConfusion(reales: Clase[], predichas: Clase[]): number[][] {
  const idx = new Map<Clase, number>(CLASES.map((c, i) => [c, i]));
  const m = CLASES.map(() => CLASES.map(() => 0));
  for (let i = 0; i < reales.length; i++) {
    m[idx.get(reales[i])!][idx.get(predichas[i])!]++;
  }
  return m;
}

/** Calcula accuracy y precision/recall/F1 macro a partir de la matriz. */
export function calcularMetricas(matriz: number[][]): Metricas {
  const K = CLASES.length;
  let totalCorrectos = 0;
  let total = 0;

  const precisiones: number[] = [];
  const recalls: number[] = [];
  const f1s: number[] = [];

  for (let c = 0; c < K; c++) {
    const tp = matriz[c][c];
    let filaSuma = 0;   // reales de la clase c
    let colSuma = 0;    // predichos como clase c
    for (let j = 0; j < K; j++) {
      filaSuma += matriz[c][j];
      colSuma += matriz[j][c];
      total += matriz[c][j];
    }
    totalCorrectos += tp;

    const prec = colSuma === 0 ? 0 : tp / colSuma;
    const rec = filaSuma === 0 ? 0 : tp / filaSuma;
    const f1 = prec + rec === 0 ? 0 : (2 * prec * rec) / (prec + rec);

    precisiones.push(prec);
    recalls.push(rec);
    f1s.push(f1);
  }

  const promedio = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;

  return {
    accuracy: total === 0 ? 0 : totalCorrectos / total,
    precision: promedio(precisiones),
    recall: promedio(recalls),
    f1: promedio(f1s)
  };
}
