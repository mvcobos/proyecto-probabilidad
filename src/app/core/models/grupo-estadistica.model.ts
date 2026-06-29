/**
 * grupo-estadistica.model.ts
 * -------------------------------------------------------------
 * Percepción estudiantil agregada de UN grupo/bloque académico
 * completo (ej. "Programación y Software"), juntando todas sus
 * materias sin importar el semestre.
 * Ubicación: src/app/core/models/grupo-estadistica.model.ts
 */
import { SentimientoStats } from './resultado.model';
import { MateriaEstadistica } from './materia-estadistica.model';

export interface GrupoEstadistica extends SentimientoStats {
  /** Nombre del grupo, coincide con las claves de COLORES_GRUPO. */
  nombre: string;
  /** Clases de gradiente Tailwind (ej. 'from-[#121358] to-[#4ad6ca]'). */
  gradiente: string;
  /** Cuántas materias componen este grupo. */
  cantidadMaterias: number;
  /** Detalle materia por materia. */
  materias: MateriaEstadistica[];
}