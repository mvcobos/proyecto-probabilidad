/**
 * naive-bayes.ts
 * -------------------------------------------------------------
 * Naive Bayes multinomial: clasificador probabilístico basado en el
 * teorema de Bayes que asume independencia entre palabras. Trabaja con
 * conteos de palabras y usa suavizado de Laplace para no anular
 * probabilidades de palabras no vistas en una clase.
 *
 * Se predice la clase c que maximiza:
 *   log P(c) + Σ  conteo(palabra) · log P(palabra | c)
 */
import { Vectorizador } from './preprocesamiento';
import { Clase, CLASES, Clasificador, Ejemplo } from './tipos';

export class NaiveBayes implements Clasificador {
  readonly nombre = 'Naive Bayes';

  private vec = new Vectorizador();
  private logPrior = new Map<Clase, number>();
  /** logProb[clase][col] = log P(palabra_col | clase) */
  private logProb = new Map<Clase, number[]>();
  private tamVocab = 0;

  entrenar(ejemplos: Ejemplo[]): void {
    this.vec.ajustar(ejemplos.map(e => e.texto));
    this.tamVocab = this.vec.tamanoVocabulario;

    // Conteo total de palabras por clase y conteo por palabra en cada clase.
    const totalPorClase = new Map<Clase, number>();
    const conteoPalabraClase = new Map<Clase, number[]>();
    const docsPorClase = new Map<Clase, number>();

    for (const c of CLASES) {
      conteoPalabraClase.set(c, new Array(this.tamVocab).fill(0));
      totalPorClase.set(c, 0);
      docsPorClase.set(c, 0);
    }

    for (const ej of ejemplos) {
      const arr = conteoPalabraClase.get(ej.etiqueta)!;
      let total = totalPorClase.get(ej.etiqueta)!;
      for (const [col, tf] of this.vec.contar(ej.texto)) {
        arr[col] += tf;
        total += tf;
      }
      totalPorClase.set(ej.etiqueta, total);
      docsPorClase.set(ej.etiqueta, docsPorClase.get(ej.etiqueta)! + 1);
    }

    // Prior: log( docs(c) / N )
    const N = ejemplos.length;
    for (const c of CLASES) {
      const docs = docsPorClase.get(c)!;
      // Si una clase no aparece, se le da probabilidad mínima para evitar log(0).
      this.logPrior.set(c, Math.log((docs + 1e-9) / N));
    }

    // Likelihood con suavizado de Laplace:
    //   P(palabra|c) = (conteo + 1) / (total_c + |V|)
    for (const c of CLASES) {
      const arr = conteoPalabraClase.get(c)!;
      const total = totalPorClase.get(c)!;
      const logs = new Array(this.tamVocab);
      const denom = total + this.tamVocab;
      for (let col = 0; col < this.tamVocab; col++) {
        logs[col] = Math.log((arr[col] + 1) / denom);
      }
      this.logProb.set(c, logs);
    }
  }

  predecir(texto: string): Clase {
    const conteo = this.vec.contar(texto);
    let mejorClase: Clase = CLASES[0];
    let mejorPuntaje = -Infinity;

    for (const c of CLASES) {
      let puntaje = this.logPrior.get(c)!;
      const logs = this.logProb.get(c)!;
      for (const [col, tf] of conteo) {
        puntaje += tf * logs[col];
      }
      if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        mejorClase = c;
      }
    }
    return mejorClase;
  }
}
