/**
 * materia-estadistica.model.ts
 * -------------------------------------------------------------
 * Percepción estudiantil de UNA materia concreta.
 * Ubicación: src/app/core/models/materia-estadistica.model.ts
 *
 * Extiende SentimientoStats para no repetir positivo/neutro/negativo
 * y añade solo lo propio de una materia: nombre y grupo al que pertenece.
 */
import { SentimientoStats } from './resultado.model';

export interface MateriaEstadistica extends SentimientoStats {
  /** Nombre de la materia, tal como aparece en malla. */
  nombre: string;
  /** Grupo académico al que pertenece (ej. "Fundamentos Matemáticos"). */
  grupo: string;
}