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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Malla } from './malla'; // tu servicio existente (clase Malla)
import { GrupoEstadistica } from '../models/grupo-estadistica.model';
import { MateriaEstadistica } from '../models/materia-estadistica.model';
import { SentimientoStats } from '../models/resultado.model';
import { EncuestasLecturaService, EncuestaDoc } from './encuestas-lectura.service';

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

  private readonly encuestasLectura = inject(EncuestasLecturaService);

  /** Todos los grupos con stats agregadas, leyendo encuestas desde Firestore. */
  obtenerGrupos(): Observable<GrupoEstadistica[]> {
    return this.encuestasLectura.obtenerEncuestas().pipe(
      map(encuestas => encuestas && encuestas.length > 0
        ? this.construirGruposDesdeEncuestas(encuestas)
        : this.construirGrupos())
    );
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

  /** Construye los grupos a partir de las encuestas reales leídas desde Firestore. */
  private construirGruposDesdeEncuestas(encuestas: EncuestaDoc[]): GrupoEstadistica[] {
    // Map: grupo -> (materia -> encuestas[])
    const agrupado = new Map<string, Map<string, EncuestaDoc[]>>();

    for (const e of encuestas) {
      const nombreGrupo = e.grupo || 'Sin Grupo';
      const nombreMateria = e.materia || 'Sin Materia';

      if (!agrupado.has(nombreGrupo)) agrupado.set(nombreGrupo, new Map());
      const materias = agrupado.get(nombreGrupo)!;
      if (!materias.has(nombreMateria)) materias.set(nombreMateria, []);
      materias.get(nombreMateria)!.push(e);
    }

    const grupos: GrupoEstadistica[] = [];

    agrupado.forEach((materiasMap, nombreGrupo) => {
      const materias: MateriaEstadistica[] = [];

      materiasMap.forEach((encs, nombreMateria) => {
        const stats = this.statsDesdeEncuestas(encs);
        materias.push({ nombre: nombreMateria, grupo: nombreGrupo, ...stats });
      });

      const agregado = this.agregar(materias);

      grupos.push({
        nombre: nombreGrupo,
        gradiente: COLORES_GRUPO[nombreGrupo] ?? 'from-slate-700 to-slate-400',
        cantidadMaterias: materias.length,
        materias,
        ...agregado
      });
    });

    return grupos;
  }

  /** Fallback: construye grupos simulados a partir de la malla (como antes). */
  private construirGrupos(): GrupoEstadistica[] {
    if (this.cache) return this.cache;

    const materiasPorGrupo = new Map<string, Set<string>>();

    for (const semestre of this.malla.obtenerSemestres()) {
      for (const grupo of semestre.grupos) {
        if (!materiasPorGrupo.has(grupo.nombre)) {
          materiasPorGrupo.set(grupo.nombre, new Set<string>());
        }
        grupo.materias.forEach(m => materiasPorGrupo.get(grupo.nombre)!.add(m));
      }
    }

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

  private statsSimuladas(semilla: string): SentimientoStats {
    const rng = this.generadorPseudoaleatorio(this.hash(semilla));

    const positivo = 38 + Math.floor(rng() * 41);      // 38–78
    const restante = 100 - positivo;
    const neutro = Math.floor(rng() * (restante + 1));  // 0–restante
    const negativo = restante - neutro;
    const totalRespuestas = 150 + Math.floor(rng() * 120); // 150–269

    return { positivo, neutro, negativo, totalRespuestas };
  }

  private hash(texto: string): number {
    let h = 5381;
    for (let i = 0; i < texto.length; i++) {
      h = (h * 33) ^ texto.charCodeAt(i);
    }
    return h >>> 0;
  }

  private generadorPseudoaleatorio(seed: number) {
    let value = seed >>> 0;
    return function() {
      // LCG constants
      value = (1664525 * value + 1013904223) % 0x100000000;
      return value / 0x100000000;
    };
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
  /** Calcula stats (porcentajes) a partir de un arreglo de encuestas. */
  private statsDesdeEncuestas(encs: EncuestaDoc[]): SentimientoStats {
    const total = encs.length;
    if (total === 0) return { positivo: 0, neutro: 0, negativo: 0, totalRespuestas: 0 };

    let pos = 0, neu = 0, neg = 0;

    for (const e of encs) {
      const etiqueta = this.etiquetaGlobalDesdeEncuesta(e);
      if (etiqueta === 'Positivo') pos++;
      else if (etiqueta === 'Neutro') neu++;
      else neg++;
    }

    let positivo = Math.round((pos / total) * 100);
    let neutro = Math.round((neu / total) * 100);
    let negativo = Math.round((neg / total) * 100);

    // Ajuste para que sumen exactamente 100
    const diff = 100 - (positivo + neutro + negativo);
    positivo += diff;

    return { positivo, neutro, negativo, totalRespuestas: total };
  }

  /** Deriva una etiqueta global sencilla desde una encuesta.
   * Usamos el promedio entre la utilidad de teoría y práctica para
   * decidir Positivo/Neutro/Negativo. */
  private etiquetaGlobalDesdeEncuesta(e: EncuestaDoc): 'Positivo' | 'Neutro' | 'Negativo' {
    const a = Number(e.clasesTeoricasUtiles ?? 3);
    const b = Number(e.clasesPracticasUtiles ?? 3);
    const promedio = Math.round((a + b) / 2);
    if (promedio >= 4) return 'Positivo';
    if (promedio === 3) return 'Neutro';
    return 'Negativo';
  }
 
}