// Estructura de una respuesta de encuesta.
// Esto representa lo que el formulario produce al enviarse.
export interface RespuestaEncuesta {
  semestre: number;
  materia: string;
  grupo: string;

  // Pregunta inicial: tipo de materia (botones)
  tipoMateria: 'Teórica' | 'Práctica' | 'Mixta' | null;

  // 4 preguntas Likert (valores 1 a 5)
  equilibrioTeoriaPractica: number;
  clasesPracticasUtiles: number;
  clasesTeoricasUtiles: number;
  realmenteAprendiendo: number;

  // 3 preguntas abiertas (texto)
  comentarioTeorico: string;
  comentarioPractico: string;
  cambioMetodologia: string;
}