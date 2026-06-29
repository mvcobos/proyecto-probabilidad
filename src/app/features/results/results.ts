import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResultadosService } from '../../core/services/resultados.service';
import { GrupoEstadistica } from '../../core/models/grupo-estadistica.model';
import { Header } from '../../components/header/header';
import { GrupoCard } from './grupo-card/grupo-card';
import { GrupoDetalle } from './grupo-detalle/grupo-detalle';

/**
 * results.ts
 * -------------------------------------------------------------
 * Componente CONTENEDOR ("inteligente" / smart component).
 *
 * Es el ÚNICO que conoce el servicio. Sus tareas:
 *   - Pedir los grupos al ResultadosService.
 *   - Guardar qué grupo está seleccionado (estado de la pantalla).
 *   - Pasar datos hacia abajo (a las cards y al detalle).
 *   - Reaccionar a los eventos que suben desde las cards.
 *
 * Los componentes hijos (GrupoCard, GrupoDetalle) solo presentan.
 * Así el estado vive en un solo lugar y el flujo es predecible.
 */
@Component({
  selector: 'app-results',
  standalone: true,
  imports: [Header, GrupoCard, GrupoDetalle],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results {

  private readonly resultadosService = inject(ResultadosService);

  /**
   * Convertimos el Observable del servicio en una señal.
   * toSignal se suscribe y se desuscribe solo (sin fugas de memoria).
   * initialValue: [] -> mientras carga, la lista está vacía.
   */
  readonly grupos = toSignal(this.resultadosService.obtenerGrupos(), {
    initialValue: [] as GrupoEstadistica[]
  });

  /** Grupo actualmente seleccionado (null = ninguno, panel cerrado). */
  readonly grupoSeleccionado = signal<GrupoEstadistica | null>(null);

  /**
   * Maneja el evento (output) que emite una card al hacer clic.
   * Si vuelven a tocar la misma card, se cierra el panel (toggle).
   */
  onSeleccionarGrupo(grupo: GrupoEstadistica): void {
    const actual = this.grupoSeleccionado();
    this.grupoSeleccionado.set(actual?.nombre === grupo.nombre ? null : grupo);
  }
}