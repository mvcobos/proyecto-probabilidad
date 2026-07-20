import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Malla } from '../../core/services/malla';
import { EncuestaService } from '../../core/services/encuesta.service';

@Component({
  selector: 'app-survey',
  imports: [ReactiveFormsModule, Header, RouterLink],
  templateUrl: './survey.html',
  styleUrl: './survey.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Survey {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private malla = inject(Malla);
  private encuestaService = inject(EncuestaService);

  semestreNumero = 0;
  materia = '';
  grupo = '';
  gradiente = 'from-[#121358] to-[#4ad6ca]';

  readonly opcionesLikert = [1, 2, 3, 4, 5];

  readonly preguntasLikert = [
    {
      campo: 'equilibrioTeoriaPractica',
      texto: 'El equilibrio entre teoría y práctica fue adecuado',
    },
    {
      campo: 'clasesPracticasUtiles',
      texto: 'Las clases prácticas (laboratorios, ejercicios) me ayudaron a entender la materia',
    },
    {
      campo: 'clasesTeoricasUtiles',
      texto: 'Las clases teóricas me aportaron conocimientos útiles',
    },
    { campo: 'realmenteAprendiendo', texto: '¿Sientes que verdaderamente estás aprendiendo?' },
  ];

  readonly preguntasAbiertas = [
    { campo: 'comentarioTeorico', texto: '¿Qué te pareció la parte teórica de la materia?' },
    { campo: 'comentarioPractico', texto: '¿Qué te pareció la parte práctica de la materia?' },
    {
      campo: 'cambioMetodologia',
      texto: '¿Qué cambiarías de la metodología de enseñanza en esta materia?',
    },
  ];

  encuestaForm = this.fb.group({
    tipoMateria: [null as string | null, Validators.required],
    equilibrioTeoriaPractica: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    clasesPracticasUtiles: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    clasesTeoricasUtiles: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    realmenteAprendiendo: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentarioTeorico: ['', [Validators.required, Validators.minLength(5)]],
    comentarioPractico: ['', [Validators.required, Validators.minLength(5)]],
    cambioMetodologia: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor() {
    this.semestreNumero = Number(this.route.snapshot.paramMap.get('numero'));
    this.materia = this.route.snapshot.paramMap.get('materia') ?? '';

    const semestre = this.malla.obtenerSemestre(this.semestreNumero);
    const grupoEncontrado = semestre?.grupos.find((g) => g.materias.includes(this.materia));

    if (grupoEncontrado) {
      this.grupo = grupoEncontrado.nombre;
      this.gradiente = grupoEncontrado.gradiente;
    }
  }

  campoInvalido(nombre: string): boolean {
    const c = this.encuestaForm.get(nombre);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  getValor(campo: string): unknown {
    return this.encuestaForm.get(campo)?.value;
  }

  seleccionarLikert(campo: string, valor: number): void {
    this.encuestaForm.get(campo)?.setValue(valor);
    this.encuestaForm.get(campo)?.markAsTouched();
  }

  seleccionarTipo(tipo: string): void {
    this.encuestaForm.get('tipoMateria')?.setValue(tipo);
  }

  async enviar(): Promise<void> {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    try {
      await this.encuestaService.guardarEncuesta({
        semestre: this.semestreNumero,

        materia: this.materia,

        grupo: this.grupo,

        tipoMateria: this.encuestaForm.value.tipoMateria! as 'Teórica' | 'Práctica' | 'Mixta',

        equilibrioTeoriaPractica: this.encuestaForm.value.equilibrioTeoriaPractica!,

        clasesPracticasUtiles: this.encuestaForm.value.clasesPracticasUtiles!,

        clasesTeoricasUtiles: this.encuestaForm.value.clasesTeoricasUtiles!,

        realmenteAprendiendo: this.encuestaForm.value.realmenteAprendiendo!,

        comentarioTeorico: this.encuestaForm.value.comentarioTeorico!,

        comentarioPractico: this.encuestaForm.value.comentarioPractico!,

        cambioMetodologia: this.encuestaForm.value.cambioMetodologia!,
      });

      alert('¡Muchas gracias! Tu encuesta fue registrada correctamente.');

      this.encuestaForm.reset();
    } catch (error) {
      console.error(error);

      alert('Ocurrió un error al guardar la encuesta.');
    }
  }
}
