import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'semestre/:numero',
    loadComponent: () =>
      import('./features/semester-detail/semester-detail').then(m => m.SemesterDetail),
  },
  {
    path: 'semestre/:numero/encuesta/:materia',
    loadComponent: () =>
      import('./features/survey/survey').then(m => m.Survey),
  },
  // dentro del array de routes existente:
  {
    path: 'results',
    loadComponent: () =>
      import('./features/results/results').then(m => m.Results)
  },
  {
    path: 'comparison',
    loadComponent: () =>
    import('./features/comparison/comparison').then(m => m.Comparison)
  },
  { path: '**', redirectTo: '' },
];
