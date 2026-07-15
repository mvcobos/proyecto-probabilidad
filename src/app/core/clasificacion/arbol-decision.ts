/**
 * arbol-decision.ts
 * -------------------------------------------------------------
 * Árbol de decisión (tipo CART) para texto. Usa características binarias
 * de presencia de palabra (¿aparece o no la palabra en el comentario?)
 * y elige en cada nodo la palabra que mejor separa las clases según la
 * impureza de Gini. Crece de forma voraz hasta una profundidad máxima o
 * hasta que un nodo queda puro / muy pequeño.
 */
import { Vectorizador } from './preprocesamiento';
import { Clase, CLASES, Clasificador, Ejemplo } from './tipos';

interface Nodo {
  /** Índice de la palabra por la que se divide (null si es hoja). */
  columna: number | null;
  /** Rama para "la palabra NO aparece" (valor 0). */
  izquierda?: Nodo;
  /** Rama para "la palabra SÍ aparece" (valor 1). */
  derecha?: Nodo;
  /** Clase predicha si es hoja. */
  clase?: Clase;
}

export class ArbolDecision implements Clasificador {
  readonly nombre = 'Árbol decisión';

  private vec = new Vectorizador();
  private raiz: Nodo | null = null;
  private profundidadMax: number;
  private minMuestras: number;

  constructor(profundidadMax = 12, minMuestras = 3) {
    this.profundidadMax = profundidadMax;
    this.minMuestras = minMuestras;
  }

  entrenar(ejemplos: Ejemplo[]): void {
    this.vec.ajustar(ejemplos.map(e => e.texto));
    const X = ejemplos.map(e => this.vec.presencia(e.texto));
    const y = ejemplos.map(e => e.etiqueta);
    this.raiz = this.construir(X, y, 0);
  }

  predecir(texto: string): Clase {
    if (!this.raiz) return CLASES[0];
    const x = this.vec.presencia(texto);
    let nodo = this.raiz;
    while (nodo.columna !== null) {
      nodo = x[nodo.columna] === 1 ? nodo.derecha! : nodo.izquierda!;
    }
    return nodo.clase!;
  }

  // ----------------------------------------------------------------

  private construir(X: number[][], y: Clase[], profundidad: number): Nodo {
    // Condiciones de parada -> hoja con la clase mayoritaria.
    if (
      profundidad >= this.profundidadMax ||
      y.length < this.minMuestras ||
      this.gini(y) === 0
    ) {
      return { columna: null, clase: this.claseMayoritaria(y) };
    }

    const mejor = this.mejorDivision(X, y);
    if (!mejor) {
      return { columna: null, clase: this.claseMayoritaria(y) };
    }

    // Repartir ejemplos según la palabra elegida.
    const izqX: number[][] = [], izqY: Clase[] = [];
    const derX: number[][] = [], derY: Clase[] = [];
    for (let i = 0; i < X.length; i++) {
      if (X[i][mejor.columna] === 1) { derX.push(X[i]); derY.push(y[i]); }
      else { izqX.push(X[i]); izqY.push(y[i]); }
    }

    // Si la división no separa nada, es hoja.
    if (izqY.length === 0 || derY.length === 0) {
      return { columna: null, clase: this.claseMayoritaria(y) };
    }

    return {
      columna: mejor.columna,
      izquierda: this.construir(izqX, izqY, profundidad + 1),
      derecha: this.construir(derX, derY, profundidad + 1)
    };
  }

  /** Busca la palabra que minimiza la impureza de Gini ponderada. */
  private mejorDivision(X: number[][], y: Clase[]): { columna: number } | null {
    const numCols = X[0]?.length ?? 0;
    const giniActual = this.gini(y);
    let mejorCol = -1;
    let mejorGini = giniActual;

    for (let col = 0; col < numCols; col++) {
      const yIzq: Clase[] = [], yDer: Clase[] = [];
      for (let i = 0; i < X.length; i++) {
        (X[i][col] === 1 ? yDer : yIzq).push(y[i]);
      }
      if (yIzq.length === 0 || yDer.length === 0) continue;

      const ponderado =
        (yIzq.length / y.length) * this.gini(yIzq) +
        (yDer.length / y.length) * this.gini(yDer);

      if (ponderado < mejorGini) {
        mejorGini = ponderado;
        mejorCol = col;
      }
    }

    return mejorCol >= 0 ? { columna: mejorCol } : null;
  }

  /** Impureza de Gini de un conjunto de etiquetas. */
  private gini(y: Clase[]): number {
    if (y.length === 0) return 0;
    const conteo = new Map<Clase, number>();
    for (const c of y) conteo.set(c, (conteo.get(c) ?? 0) + 1);
    let suma = 0;
    for (const n of conteo.values()) {
      const p = n / y.length;
      suma += p * p;
    }
    return 1 - suma;
  }

  private claseMayoritaria(y: Clase[]): Clase {
    const conteo = new Map<Clase, number>();
    for (const c of CLASES) conteo.set(c, 0);
    for (const c of y) conteo.set(c, conteo.get(c)! + 1);
    let mejor: Clase = CLASES[0];
    let max = -1;
    for (const c of CLASES) {
      if (conteo.get(c)! > max) { max = conteo.get(c)!; mejor = c; }
    }
    return mejor;
  }
}
