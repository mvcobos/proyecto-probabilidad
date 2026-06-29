// Modelos de datos de la malla curricular.
// Separar las interfaces en su propio archivo permite reutilizarlas
// en el servicio y en los componentes sin duplicar definiciones.

// Un grupo académico (ej: "Fundamentos Matemáticos").
// El color vive AQUÍ porque, según el requisito, cada grupo
// mantiene su color sin importar en qué semestre aparezca.
export interface Grupo {
  nombre: string;
  gradiente: string;   // clases Tailwind del degradado del grupo
  materias: string[];  // materias de ese grupo EN ese semestre
}

// Un semestre completo.
export interface Semestre {
  numero: number;
  nombre: string;
  color: string;   // gradiente exclusivo de la card en Home
  grupos: Grupo[];
}