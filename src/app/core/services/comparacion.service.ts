/**
 * comparacion.service.ts
 * -------------------------------------------------------------
 * Fuente de datos del módulo de Comparación de Algoritmos.
 * Ubicación: src/app/core/services/comparacion.service.ts
 *
 * Lee las encuestas reales desde Firestore (vía EncuestasLecturaService),
 * arma los comentarios etiquetados de una materia y ejecuta los 4
 * algoritmos de clasificación (motor.ts) para comparar su desempeño.
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EncuestasLecturaService, EncuestaDoc } from './encuestas-lectura.service';
import { compararAlgoritmos } from '../clasificacion/motor';
import { Ejemplo } from '../clasificacion/tipos';
import { ResultadoComparacion } from '../models/algoritmo-estadistica.model';

@Injectable({ providedIn: 'root' })
export class ComparacionService {

  private readonly encuestasLectura = inject(EncuestasLecturaService);

  /** Materias con al menos una encuesta registrada (para el selector). */
  obtenerMateriasDisponibles(): Observable<string[]> {
    return this.encuestasLectura.obtenerEncuestas().pipe(
      map(encuestas => [...new Set(encuestas.map(e => e.materia))].sort())
    );
  }

  /**
   * Entrena y compara los 4 algoritmos con los comentarios reales de una
   * materia. Cada comentario (teórico y práctico) se etiqueta con la
   * etiqueta ya derivada del Likert al guardar la encuesta.
   */
  obtenerComparacion(materia: string): Observable<ResultadoComparacion> {
    return this.encuestasLectura.obtenerEncuestas().pipe(
      map(encuestas => compararAlgoritmos(materia, this.ejemplosDeMateria(encuestas, materia)))
    );
  }

  private ejemplosDeMateria(encuestas: EncuestaDoc[], materia: string): Ejemplo[] {
    const ejemplos: Ejemplo[] = [];

    for (const e of encuestas) {
      if (e.materia !== materia) continue;
      if (e.comentarioTeorico?.trim()) {
        ejemplos.push({ texto: e.comentarioTeorico, etiqueta: e.etiquetaTeoria });
      }
      if (e.comentarioPractico?.trim()) {
        ejemplos.push({ texto: e.comentarioPractico, etiqueta: e.etiquetaPractica });
      }
    }

    return ejemplos;
  }
}
