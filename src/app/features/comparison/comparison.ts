import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';

import { ComparacionService } from '../../core/services/comparacion.service';
import { ComparacionAlgoritmos } from '../../core/models/algoritmo-estadistica.model';
import { Header } from '../../components/header/header';

/**
 * comparison.ts
 * -------------------------------------------------------------
 * Componente CONTENEDOR de la vista "Comparación de algoritmos".
 *
 * Responsabilidades:
 *  - Pedir los datos al ComparacionService.
 *  - Transformar esos datos al formato que entiende Chart.js
 *    (objetos 'data' y 'options'), expuesto como señales computadas.
 *
 * Nota sobre p-chart: es un envoltorio de PrimeNG sobre Chart.js.
 * Lo que configuramos en 'data'/'options' es configuración de Chart.js.
 */
@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [ChartModule, Header],
  templateUrl: './comparison.html',
  styleUrl: './comparison.css'
})
export class Comparison {

  private readonly comparacionService = inject(ComparacionService);

  /** Datos crudos del servicio convertidos en señal. */
  readonly datos = toSignal<ComparacionAlgoritmos | null>(
    this.comparacionService.obtenerComparacion(),
    { initialValue: null }
  );

  // --- Colores reutilizables (coinciden con el mockup validado) ---
  private readonly C = {
    azul: '#378ADD', verde: '#1D9E75', naranja: '#D85A30', morado: '#7F77DD',
    azulClaro: '#85B7EB', naranjaBarra: '#EF9F27', rojo: '#E24B4A'
  };

  /** Texto claro y rejilla tenue: imprescindible sobre fondo oscuro. */
  private readonly textoClaro = '#cbd5e1';   // slate-300
  private readonly rejilla = 'rgba(255,255,255,0.08)';

  // --- Señales calculadas para las tarjetas resumen ---

  /** Algoritmo con mayor F1 (el "mejor" global). */
  readonly mejorAlgoritmo = computed(() => this.porMejorF1()?.nombre ?? '—');
  readonly mejorF1 = computed(() => this.porMejorF1()?.f1.toFixed(2) ?? '—');

  /** Algoritmo con menor tiempo de clasificación. */
  readonly masRapido = computed(() => {
    const d = this.datos();
    if (!d) return '—';
    return d.algoritmos.reduce((min, a) => a.tiempoSegundos < min.tiempoSegundos ? a : min).nombre;
  });

  /** Helper: devuelve el algoritmo con mejor F1. */
  private porMejorF1() {
    const d = this.datos();
    if (!d) return null;
    return d.algoritmos.reduce((max, a) => a.f1 > max.f1 ? a : max);
  }

  // ----------------------------------------------------------------
  //  Gráfica 1: métricas agrupadas (barras verticales)
  // ----------------------------------------------------------------
  readonly metricasData = computed(() => {
    const d = this.datos();
    if (!d) return null;
    const labels = d.algoritmos.map(a => a.nombre);
    return {
      labels,
      datasets: [
        { label: 'Accuracy',  backgroundColor: this.C.azul,    data: d.algoritmos.map(a => a.accuracy) },
        { label: 'Precision', backgroundColor: this.C.verde,   data: d.algoritmos.map(a => a.precision) },
        { label: 'Recall',    backgroundColor: this.C.naranja, data: d.algoritmos.map(a => a.recall) },
        { label: 'F1-Score',  backgroundColor: this.C.morado,  data: d.algoritmos.map(a => a.f1) }
      ]
    };
  });

  readonly metricasOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: this.textoClaro } } },
    scales: {
      x: { ticks: { color: this.textoClaro }, grid: { color: this.rejilla } },
      y: { beginAtZero: true, max: 1, ticks: { color: this.textoClaro, stepSize: 0.2 }, grid: { color: this.rejilla } }
    }
  }));

  // ----------------------------------------------------------------
  //  Gráfica 2: tiempo de clasificación (una barra por algoritmo)
  // ----------------------------------------------------------------
  readonly tiempoData = computed(() => {
    const d = this.datos();
    if (!d) return null;
    return {
      labels: d.algoritmos.map(a => a.nombre),
      datasets: [{
        label: 'Segundos',
        // El más lento (KNN) se resalta en rojo; el resto en azul/naranja.
        backgroundColor: d.algoritmos.map(a =>
          a.tiempoSegundos >= 3 ? this.C.rojo
          : a.tiempoSegundos >= 0.8 ? this.C.naranjaBarra
          : this.C.azulClaro),
        data: d.algoritmos.map(a => a.tiempoSegundos)
      }]
    };
  });

  readonly tiempoOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: this.textoClaro }, grid: { color: this.rejilla } },
      y: { beginAtZero: true, ticks: { color: this.textoClaro }, grid: { color: this.rejilla },
           title: { display: true, text: 'segundos', color: this.textoClaro } }
    }
  }));
}