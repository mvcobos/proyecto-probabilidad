import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { GrupoEstadistica } from './../../../core/models/grupo-estadistica.model';

/**
 * grupo-card.ts
 * -------------------------------------------------------------
 * Componente de PRESENTACIÓN ("tonto" / dumb component).
 *
 * Responsabilidad única: mostrar UN grupo académico como una card
 * con su gradiente y avisar cuando el usuario hace clic en ella.
 *
 * NO sabe de dónde vienen los datos ni qué pasa tras el clic. Eso lo
 * decide el contenedor (results). Por eso es reutilizable y testeable.
 *
 * Usamos la API de señales de Angular moderno:
 *  - input()  -> reemplaza a @Input()  (datos que ENTRAN al componente)
 *  - output() -> reemplaza a @Output() (eventos que SALEN del componente)
 */
@Component({
  selector: 'app-grupo-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './grupo-card.html',
  styleUrl: './grupo-card.css'
})
export class GrupoCard {

  /** Datos del grupo a mostrar. 'required' = el padre DEBE pasarlo. */
  readonly grupo = input.required<GrupoEstadistica>();

  /** Marca si esta card es la actualmente seleccionada (para resaltarla). */
  readonly seleccionada = input<boolean>(false);

  /**
   * Evento que SALE hacia el contenedor cuando hacen clic.
   * Emite el grupo completo para que el padre sepa cuál fue.
   */
  readonly seleccionar = output<GrupoEstadistica>();

  /**
   * Clases de gradiente listas para el [ngClass] del template.
   * computed() recalcula solo si cambia 'grupo' (eficiente).
   */
  readonly clasesGradiente = computed(() => this.grupo().gradiente);

  /** Manejador del clic: emite el grupo hacia arriba. */
  alHacerClic(): void {
    this.seleccionar.emit(this.grupo());
  }
}