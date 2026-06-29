import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../components/header/header';
import { Malla } from '../../core/services/malla';
import { Semestre } from '../../core/models/malla.model';

@Component({
  selector: 'app-semester-detail',
  imports: [Header, RouterLink],
  templateUrl: './semester-detail.html',
  styleUrl: './semester-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemesterDetail {
  private route = inject(ActivatedRoute);
  private malla = inject(Malla);

  semestre?: Semestre;
  anterior?: Semestre;

  constructor() {
    const numero = Number(this.route.snapshot.paramMap.get('numero'));
    this.semestre = this.malla.obtenerSemestre(numero);
    this.anterior = this.malla.obtenerSemestreAnterior(numero);
  }
}
