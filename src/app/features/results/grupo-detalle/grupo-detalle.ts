import { Component, input } from '@angular/core';
import { GrupoEstadistica } from './../../../core/models/grupo-estadistica.model';

/**
 * grupo-detalle.ts
 * -------------------------------------------------------------
 * Componente de PRESENTACIÓN del panel desplegable de detalle.
 *
 * Recibe el grupo seleccionado por input() y muestra:
 *   1. Resumen estadístico (positivo / neutro / negativo / total)
 *   2. Lista de materias, cada una con su barra de percepción
 *
 * (Las gráficas PrimeNG se añadirán en el siguiente paso, una vez
 *  verificado que esta base compila y se ve correctamente.)
 */
@Component({
  selector: 'app-grupo-detalle',
  standalone: true,
  templateUrl: './grupo-detalle.html',
  styleUrl: './grupo-detalle.css'
})
export class GrupoDetalle {
  /** Grupo cuyo detalle se muestra. required: el padre debe pasarlo. */
  readonly grupo = input.required<GrupoEstadistica>();
}