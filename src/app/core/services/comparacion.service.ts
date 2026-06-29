/**
 * comparacion.service.ts
 * -------------------------------------------------------------
 * Fuente de datos del módulo de Comparación de Algoritmos.
 * Ubicación: src/app/core/services/comparacion.service.ts
 *
 * Hoy devuelve datos SIMULADOS (los mismos del mockup validado).
 * Cuando exista el backend que entrene y evalúe los algoritmos, se
 * reemplaza el cuerpo por HttpClient y la vista no cambia.
 *
 * Devuelve Observable por el mismo motivo que ResultadosService:
 * es el estándar asíncrono de Angular y facilita migrar a HTTP.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ComparacionAlgoritmos } from '../models/algoritmo-estadistica.model';

@Injectable({ providedIn: 'root' })
export class ComparacionService {

  /**
   * Devuelve la comparación de algoritmos para una materia.
   * Por ahora ignora el parámetro y devuelve siempre el mismo mock,
   * pero la firma ya queda lista para filtrar por materia en el futuro.
   */
  obtenerComparacion(materia: string = 'Cálculo Diferencial'): Observable<ComparacionAlgoritmos> {
    const datos: ComparacionAlgoritmos = {
      materia,
      totalComentarios: 187,
      // Naive Bayes y Reg. Logística rinden mejor; KNN es el más débil
      // y lento (comportamiento esperado al clasificar texto).
      algoritmos: [
        { nombre: 'Naive Bayes',     accuracy: 0.88, precision: 0.87, recall: 0.86, f1: 0.87, tiempoSegundos: 0.4 },
        { nombre: 'Reg. Logística',  accuracy: 0.86, precision: 0.85, recall: 0.84, f1: 0.85, tiempoSegundos: 0.5 },
        { nombre: 'Árbol decisión',  accuracy: 0.79, precision: 0.78, recall: 0.77, f1: 0.77, tiempoSegundos: 0.9 },
        { nombre: 'KNN',             accuracy: 0.72, precision: 0.70, recall: 0.68, f1: 0.69, tiempoSegundos: 3.8 }
      ],
      // Matriz del mejor (Naive Bayes). Filas=real, columnas=predicho.
      matrizMejor: {
        algoritmo: 'Naive Bayes',
        clases: ['Positivo', 'Neutro', 'Negativo'],
        valores: [
          [71, 6, 2],   // real Positivo
          [7, 28, 5],   // real Neutro
          [3, 4, 54]    // real Negativo
        ]
      }
    };

    // delay simula latencia de red para probar el estado de carga.
    return of(datos).pipe(delay(400));
  }
}