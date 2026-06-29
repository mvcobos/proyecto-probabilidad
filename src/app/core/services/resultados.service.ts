/**
 * resultados.service.ts
 * -------------------------------------------------------------
 * Servicio (fuente de datos) del módulo de Resultados.
 * Ubicación: src/app/core/services/resultados.service.ts
 *
 * RESPONSABILIDAD ÚNICA: entregar las estadísticas de percepción.
 * Hoy genera datos SIMULADOS recorriendo la malla real. Mañana, con
 * backend, se reemplaza el cuerpo de estos métodos por HttpClient y
 * los componentes NO cambian, porque siguen recibiendo los mismos
 * Observable<GrupoEstadistica[]>.
 *
 * ¿Por qué Observables (RxJS)?
 * - Es el estándar de Angular para datos asíncronos (HTTP lo es).
 * - Cuando migres a HttpClient, la firma del método no cambia.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Malla } from './malla'; // tu servicio existente (clase Malla)
import { GrupoEstadistica } from '../models/grupo-estadistica.model';
import { MateriaEstadistica } from '../models/materia-estadistica.model';
import { SentimientoStats } from '../models/resultado.model';

// Gradientes oficiales por grupo (mismos que en malla.ts) para no
// depender de un símbolo privado. Se mantienen sincronizados a mano.
const COLORES_GRUPO: Record<string, string> = {
  'Fundamentos Matemáticos':             'from-[#121358] to-[#4ad6ca]',
  'Programación y Software':             'from-[#d6336c] to-[#f8cdda]',
  'Física para Computación':             'from-[#5e1a1a] to-[#f0a868]',
  'Fundamentos de Hardware y Circuitos': 'from-[#e8590c] to-[#ffd07a]',
  'Sistemas de Información':             'from-[#4e7096] to-[#b2e4ed]',
  'Gestión de Datos e Información':      'from-[#0b3d2e] to-[#7be0a0]',
  'Redes y Teleprocesamiento':           'from-[#482ba2] to-[#81d8e5]',
  'IA y Computación de Alto Rendimiento':'from-[#3a0a4a] to-[#8e6bd6]'
};

@Injectable({ providedIn: 'root' })
export class ResultadosService {

  /** Reutilizamos tu servicio de malla en lugar de duplicar materias. */
  private readonly malla = inject(Malla);

  /** Caché interna para no recalcular en cada suscripción. */
  private cache: GrupoEstadistica[] | null = null;

  /** Todos los grupos con stats agregadas. delay simula latencia de red. */
  obtenerGrupos(): Observable<GrupoEstadistica[]> {
    return of(this.construirGrupos()).pipe(delay(400));
  }

  /** Un solo grupo por nombre (para el panel de detalle). */
  obtenerGrupo(nombre: string): Observable<GrupoEstadistica | undefined> {
    return this.obtenerGrupos().pipe(
      map(grupos => grupos.find(g => g.nombre === nombre))
    );
  }

  /** Estadística GLOBAL (tarjetas de cabecera), ponderada por respuestas. */
  obtenerResumenGlobal(): Observable<SentimientoStats> {
    return this.obtenerGrupos().pipe(map(grupos => this.agregar(grupos)));
  }

  // ----------------------------------------------------------------
  //  Construcción de datos simulados (privado)
  // ----------------------------------------------------------------

  private construirGrupos(): GrupoEstadistica[] {
    if (this.cache) return this.cache;

    // 1) Recolectar materias únicas por grupo recorriendo TODA la malla.
    const materiasPorGrupo = new Map<string, Set<string>>();

    for (const semestre of this.malla.obtenerSemestres()) {
      for (const grupo of semestre.grupos) {
        if (!materiasPorGrupo.has(grupo.nombre)) {
          materiasPorGrupo.set(grupo.nombre, new Set<string>());
        }
        // Set deduplica materias repetidas (ej. Electrotecnia en 2do y 3ro).
        grupo.materias.forEach(m => materiasPorGrupo.get(grupo.nombre)!.add(m));
      }
    }

    // 2) Por cada grupo, generar stats por materia y agregar el grupo.
    const grupos: GrupoEstadistica[] = [];

    materiasPorGrupo.forEach((setMaterias, nombreGrupo) => {
      const materias: MateriaEstadistica[] = [...setMaterias].map(nombre => ({
        nombre,
        grupo: nombreGrupo,
        ...this.statsSimuladas(nombre)
      }));

      const agregado = this.agregar(materias);

      grupos.push({
        nombre: nombreGrupo,
        gradiente: COLORES_GRUPO[nombreGrupo] ?? 'from-slate-700 to-slate-400',
        cantidadMaterias: materias.length,
        materias,
        ...agregado
      });
    });

    this.cache = grupos;
    return grupos;
  }

  /** Agrega (suma ponderada) una lista de stats en una sola. */
  private agregar(items: SentimientoStats[]): SentimientoStats {
    const total = items.reduce((s, i) => s + i.totalRespuestas, 0);
    if (total === 0) {
      return { positivo: 0, neutro: 0, negativo: 0, totalRespuestas: 0 };
    }

    const pond = (campo: keyof SentimientoStats) =>
      Math.round(
        items.reduce((s, i) => s + (i[campo] as number) * i.totalRespuestas, 0) / total
      );

    let positivo = pond('positivo');
    let neutro = pond('neutro');
    let negativo = pond('negativo');

    // Ajuste de redondeo: la barra debe sumar EXACTO 100%.
    const diff = 100 - (positivo + neutro + negativo);
    positivo += diff;

    return { positivo, neutro, negativo, totalRespuestas: total };
  }

  /** Sentimientos pseudoaleatorios pero DETERMINISTAS (datos inventados). */
  private statsSimuladas(semilla: string): SentimientoStats {
    const rng = this.generadorPseudoaleatorio(this.hash(semilla));

    const positivo = 38 + Math.floor(rng() * 41);      // 38–78
    const restante = 100 - positivo;
    const neutro = Math.floor(rng() * (restante + 1));  // 0–restante
    const negativo = restante - neutro;
    const totalRespuestas = 150 + Math.floor(rng() * 120); // 150–269

    return { positivo, neutro, negativo, totalRespuestas };
  }

  /** Hash simple (djb2) de un string -> entero, para sembrar el RNG. */
  private hash(texto: string): number {
    let h = 5381;
    for (let i = 0; i < texto.length; i++) {
      h = (h * 33) ^ texto.charCodeAt(i);
    }
    return h >>> 0;
  }

  /** Generador congruencial lineal: función pura sembrada por 'seed'. */
  private generadorPseudoaleatorio(seed: number): () => number {
    let estado = seed % 2147483647;
    if (estado <= 0) estado += 2147483646;
    return () => {
      estado = (estado * 16807) % 2147483647;
      return (estado - 1) / 2147483646;
    };
  }
}