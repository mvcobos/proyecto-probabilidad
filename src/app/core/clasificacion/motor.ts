/**
 * motor.ts
 * -------------------------------------------------------------
 * Orquesta todo el flujo de clasificación: recibe comentarios etiquetados,
 * divide en train/test, entrena y evalúa los 4 algoritmos sobre EXACTAMENTE
 * el mismo conjunto, mide su tiempo y arma el objeto ComparacionAlgoritmos
 * que consumen las vistas de Angular sin cambios.
 *
 * Las interfaces de salida (AlgoritmoEstadistica, MatrizConfusion,
 * ComparacionAlgoritmos) son las mismas que ya están definidas en
 * src/app/core/models/algoritmo-estadistica.model.ts.
 */
import { NaiveBayes } from './naive-bayes';
import { KNN } from './knn';
import { ArbolDecision } from './arbol-decision';
import { RegresionLogistica } from './regresion-logistica';
import {
  dividirEstratificado,
  matrizConfusion,
  calcularMetricas
} from './evaluacion';
import { Clase, CLASES, Clasificador, Ejemplo } from './tipos';
import type {
  AlgoritmoEstadistica,
  ResultadoComparacion
} from '../models/algoritmo-estadistica.model';

export type { ResultadoComparacion } from '../models/algoritmo-estadistica.model';

/** Número mínimo de comentarios para que la comparación sea confiable. */
export const MIN_COMENTARIOS = 30;

/**
 * Entrena y evalúa los 4 algoritmos sobre los comentarios dados.
 * @param materia   nombre de la materia analizada (para etiquetar el resultado)
 * @param ejemplos  comentarios etiquetados (texto + Positivo/Neutro/Negativo)
 */
export function compararAlgoritmos(
  materia: string,
  ejemplos: Ejemplo[]
): ResultadoComparacion {
  if (ejemplos.length < MIN_COMENTARIOS) {
    return { suficiente: false, totalComentarios: ejemplos.length, minimo: MIN_COMENTARIOS };
  }

  const { train, test } = dividirEstratificado(ejemplos, 0.3, 42);
  const reales = test.map(e => e.etiqueta);

  const modelos: Clasificador[] = [
    new NaiveBayes(),
    new RegresionLogistica(),
    new ArbolDecision(),
    new KNN()
  ];

  const algoritmos: AlgoritmoEstadistica[] = [];
  const matrices = new Map<string, number[][]>();

  for (const modelo of modelos) {
    const inicio = ahora();
    modelo.entrenar(train);
    const predichas = test.map(e => modelo.predecir(e.texto));
    const fin = ahora();

    const matriz = matrizConfusion(reales, predichas);
    const m = calcularMetricas(matriz);

    algoritmos.push({
      nombre: modelo.nombre,
      accuracy: redondear(m.accuracy),
      precision: redondear(m.precision),
      recall: redondear(m.recall),
      f1: redondear(m.f1),
      tiempoSegundos: +(((fin - inicio) / 1000).toFixed(4))
    });
    matrices.set(modelo.nombre, matriz);
  }

  // El "mejor" es el de mayor F1.
  const mejor = algoritmos.reduce((a, b) => (b.f1 > a.f1 ? b : a));

  return {
    suficiente: true,
    datos: {
      materia,
      totalComentarios: ejemplos.length,
      algoritmos,
      matrizMejor: {
        algoritmo: mejor.nombre,
        clases: [...CLASES],
        valores: matrices.get(mejor.nombre)!
      }
    }
  };
}

function redondear(x: number): number {
  return +x.toFixed(2);
}

/** performance.now si existe (navegador); si no, Date.now (Node). */
function ahora(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
