import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Malla } from '../../core/services/malla';
import { Semestre } from '../../core/models/malla.model';

@Component({
  selector: 'app-home',
  imports: [Header, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private malla = inject(Malla);

  semestres: Semestre[] = this.malla.obtenerSemestres();
}
