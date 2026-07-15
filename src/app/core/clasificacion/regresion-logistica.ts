/**
 * regresion-logistica.ts
 * -------------------------------------------------------------
 * Regresión logística multiclase (softmax). Modelo lineal que estima la
 * probabilidad de que un comentario pertenezca a cada clase. Se entrena
 * minimizando la entropía cruzada mediante descenso de gradiente, con una
 * pequeña regularización L2 para evitar sobreajuste.
 *
 * Entrada: vectores TF-IDF normalizados.
 * Parámetros: una matriz de pesos [numClases x numPalabras] + sesgos.
 */
import { Vectorizador } from './preprocesamiento';
import { Clase, CLASES, Clasificador, Ejemplo } from './tipos';

export class RegresionLogistica implements Clasificador {
  readonly nombre = 'Reg. Logística';

  private vec = new Vectorizador();
  private pesos: number[][] = [];   // [clase][palabra]
  private sesgos: number[] = [];    // [clase]
  private numPalabras = 0;

  private tasaAprendizaje: number;
  private iteraciones: number;
  private lambda: number; // fuerza de la regularización L2

  constructor(tasaAprendizaje = 0.5, iteraciones = 300, lambda = 0.01) {
    this.tasaAprendizaje = tasaAprendizaje;
    this.iteraciones = iteraciones;
    this.lambda = lambda;
  }

  entrenar(ejemplos: Ejemplo[]): void {
    this.vec.ajustar(ejemplos.map(e => e.texto));
    this.numPalabras = this.vec.tamanoVocabulario;

    const X = ejemplos.map(e => this.vec.tfidf(e.texto));
    const yIdx = ejemplos.map(e => CLASES.indexOf(e.etiqueta));
    const K = CLASES.length;
    const n = X.length;

    // Inicializar pesos y sesgos en cero.
    this.pesos = Array.from({ length: K }, () => new Array(this.numPalabras).fill(0));
    this.sesgos = new Array(K).fill(0);

    // Descenso de gradiente (batch completo).
    for (let iter = 0; iter < this.iteraciones; iter++) {
      const gradW = Array.from({ length: K }, () => new Array(this.numPalabras).fill(0));
      const gradB = new Array(K).fill(0);

      for (let i = 0; i < n; i++) {
        const probs = this.softmax(this.puntajes(X[i]));
        for (let c = 0; c < K; c++) {
          // Derivada de la entropía cruzada: (prob - objetivo)
          const objetivo = yIdx[i] === c ? 1 : 0;
          const error = probs[c] - objetivo;
          const xi = X[i];
          for (let j = 0; j < this.numPalabras; j++) {
            if (xi[j] !== 0) gradW[c][j] += error * xi[j];
          }
          gradB[c] += error;
        }
      }

      // Actualizar parámetros (promediando el gradiente + término L2).
      for (let c = 0; c < K; c++) {
        for (let j = 0; j < this.numPalabras; j++) {
          const g = gradW[c][j] / n + this.lambda * this.pesos[c][j];
          this.pesos[c][j] -= this.tasaAprendizaje * g;
        }
        this.sesgos[c] -= this.tasaAprendizaje * (gradB[c] / n);
      }
    }
  }

  predecir(texto: string): Clase {
    const x = this.vec.tfidf(texto);
    const probs = this.softmax(this.puntajes(x));
    let mejor = 0;
    for (let c = 1; c < probs.length; c++) {
      if (probs[c] > probs[mejor]) mejor = c;
    }
    return CLASES[mejor];
  }

  /** Puntaje lineal (logit) de cada clase para un vector x. */
  private puntajes(x: number[]): number[] {
    const K = CLASES.length;
    const z = new Array(K).fill(0);
    for (let c = 0; c < K; c++) {
      let s = this.sesgos[c];
      const w = this.pesos[c];
      for (let j = 0; j < x.length; j++) {
        if (x[j] !== 0) s += w[j] * x[j];
      }
      z[c] = s;
    }
    return z;
  }

  /** Softmax numéricamente estable (resta el máximo). */
  private softmax(z: number[]): number[] {
    const max = Math.max(...z);
    const exp = z.map(v => Math.exp(v - max));
    const suma = exp.reduce((a, b) => a + b, 0);
    return exp.map(v => v / suma);
  }
}
