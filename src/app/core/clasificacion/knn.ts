/**
 * knn.ts
 * -------------------------------------------------------------
 * K vecinos más cercanos. Representa cada comentario como un vector
 * TF-IDF normalizado y clasifica según la clase mayoritaria entre sus
 * k vecinos más cercanos. Como los vectores están normalizados en L2,
 * el producto punto equivale a la similitud coseno (mayor = más parecido).
 *
 * No hay "entrenamiento" real: KNN memoriza los ejemplos y todo el
 * trabajo ocurre al predecir (por eso suele ser el más lento).
 */
import { Vectorizador } from './preprocesamiento';
import { Clase, CLASES, Clasificador, Ejemplo } from './tipos';

export class KNN implements Clasificador {
  readonly nombre = 'KNN';

  private vec = new Vectorizador();
  private vectores: number[][] = [];
  private etiquetas: Clase[] = [];
  private k: number;

  constructor(k = 5) {
    this.k = k;
  }

  entrenar(ejemplos: Ejemplo[]): void {
    this.vec.ajustar(ejemplos.map(e => e.texto));
    this.vectores = ejemplos.map(e => this.vec.tfidf(e.texto));
    this.etiquetas = ejemplos.map(e => e.etiqueta);

    // k no puede superar el número de ejemplos; se fuerza impar para
    // reducir empates en la votación.
    this.k = Math.min(this.k, this.vectores.length);
    if (this.k % 2 === 0) this.k = Math.max(1, this.k - 1);
  }

  predecir(texto: string): Clase {
    const q = this.vec.tfidf(texto);

    // Similitud coseno con cada ejemplo memorizado.
    const sims = this.vectores.map((v, i) => ({
      sim: this.producto(q, v),
      etiqueta: this.etiquetas[i]
    }));

    // Los k más similares.
    sims.sort((a, b) => b.sim - a.sim);
    const vecinos = sims.slice(0, this.k);

    // Voto mayoritario ponderado por similitud (desempata mejor).
    const votos = new Map<Clase, number>();
    for (const c of CLASES) votos.set(c, 0);
    for (const vecino of vecinos) {
      votos.set(vecino.etiqueta, votos.get(vecino.etiqueta)! + (vecino.sim > 0 ? vecino.sim : 1e-6));
    }

    let mejor: Clase = CLASES[0];
    let max = -Infinity;
    for (const c of CLASES) {
      if (votos.get(c)! > max) {
        max = votos.get(c)!;
        mejor = c;
      }
    }
    return mejor;
  }

  /** Producto punto (= coseno porque los vectores están normalizados). */
  private producto(a: number[], b: number[]): number {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
}
