import { Injectable } from '@angular/core';
import { Semestre } from '../models/malla.model';

const COLORES_GRUPO: Record<string, string> = {
  'Fundamentos Matemáticos':             'from-[#121358] to-[#4ad6ca]',
  'Programación y Software':             'from-[#d6336c] to-[#f8cdda]',
  'Física para Computación':             'from-[#5e1a1a] to-[#f0a868]',
  'Fundamentos de Hardware y Circuitos': 'from-[#e8590c] to-[#ffd07a]',
  'Sistemas de Información':             'from-[#4e7096] to-[#b2e4ed]',
  'Gestión de Datos e Información':      'from-[#0b3d2e] to-[#7be0a0]',
  'Redes y Teleprocesamiento':           'from-[#482ba2] to-[#81d8e5]',
  'IA y Computación de Alto Rendimiento':'from-[#3a0a4a] to-[#8e6bd6]'
};

@Injectable({ providedIn: 'root' })
export class Malla {

  private readonly semestres: Semestre[] = [
    {
      numero: 1, nombre: '1ER SEMESTRE',
      color: 'from-[#121358] to-[#4ad6ca]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Cálculo Diferencial'] },
        { nombre: 'Programación y Software', gradiente: COLORES_GRUPO['Programación y Software'], materias: ['Programación'] },
        { nombre: 'Física para Computación', gradiente: COLORES_GRUPO['Física para Computación'], materias: ['Introducción a la Física para Ciencias de la Computación'] }
      ]
    },
    {
      numero: 2, nombre: '2DO SEMESTRE',
      color: 'from-[#bf1450] to-[#f8cdda]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Cálculo Integral'] },
        { nombre: 'Programación y Software', gradiente: COLORES_GRUPO['Programación y Software'], materias: ['Programación Orientada a Objetos', 'Estructura de Datos'] },
        { nombre: 'Física para Computación', gradiente: COLORES_GRUPO['Física para Computación'], materias: ['Física para Ciencias de la Computación'] },
        { nombre: 'Fundamentos de Hardware y Circuitos', gradiente: COLORES_GRUPO['Fundamentos de Hardware y Circuitos'], materias: ['Electrotecnia'] }
      ]
    },
    {
      numero: 3, nombre: '3ER SEMESTRE',
      color: 'from-[#361043] to-[#f282f1]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Ecuaciones Diferenciales'] },
        { nombre: 'Programación y Software', gradiente: COLORES_GRUPO['Programación y Software'], materias: ['Programación Aplicada'] },
        { nombre: 'Fundamentos de Hardware y Circuitos', gradiente: COLORES_GRUPO['Fundamentos de Hardware y Circuitos'], materias: ['Electrotecnia'] },
        { nombre: 'Sistemas de Información', gradiente: COLORES_GRUPO['Sistemas de Información'], materias: ['Fundamentos de Sistemas Operativos'] }
      ]
    },
    {
      numero: 4, nombre: '4TO SEMESTRE',
      color: 'from-[#eb4b3f] to-[#f9db6f]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Métodos Numéricos'] },
        { nombre: 'Gestión de Datos e Información', gradiente: COLORES_GRUPO['Gestión de Datos e Información'], materias: ['Fundamentos de Base de Datos'] },
        { nombre: 'Fundamentos de Hardware y Circuitos', gradiente: COLORES_GRUPO['Fundamentos de Hardware y Circuitos'], materias: ['Electrónica'] },
        { nombre: 'Redes y Teleprocesamiento', gradiente: COLORES_GRUPO['Redes y Teleprocesamiento'], materias: ['Redes de Computadoras I'] },
        { nombre: 'Sistemas de Información', gradiente: COLORES_GRUPO['Sistemas de Información'], materias: ['Administración de Sistemas Operativos'] }
      ]
    },
    {
      numero: 5, nombre: '5TO SEMESTRE',
      color: 'from-[#002474] to-[#8cafff]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Probabilidad y Estadística'] },
        { nombre: 'Gestión de Datos e Información', gradiente: COLORES_GRUPO['Gestión de Datos e Información'], materias: ['Gestión de Base de Datos'] },
        { nombre: 'Fundamentos de Hardware y Circuitos', gradiente: COLORES_GRUPO['Fundamentos de Hardware y Circuitos'], materias: ['Arquitectura del Computador'] },
        { nombre: 'Redes y Teleprocesamiento', gradiente: COLORES_GRUPO['Redes y Teleprocesamiento'], materias: ['Redes de Computadoras II'] },
        { nombre: 'Programación y Software', gradiente: COLORES_GRUPO['Programación y Software'], materias: ['Plataformas Web'] }
      ]
    },
    {
      numero: 6, nombre: '6TO SEMESTRE',
      color: 'from-[#2b9216] to-[#abe89e]',
      grupos: [
        { nombre: 'Fundamentos Matemáticos', gradiente: COLORES_GRUPO['Fundamentos Matemáticos'], materias: ['Análisis Multivariado y Modelos Estocásticos'] },
        { nombre: 'IA y Computación de Alto Rendimiento', gradiente: COLORES_GRUPO['IA y Computación de Alto Rendimiento'], materias: ['Inteligencia Artificial'] },
        { nombre: 'Fundamentos de Hardware y Circuitos', gradiente: COLORES_GRUPO['Fundamentos de Hardware y Circuitos'], materias: ['Sistemas Embebidos'] },
        { nombre: 'Sistemas de Información', gradiente: COLORES_GRUPO['Sistemas de Información'], materias: ['Análisis y Diseño de Sistemas'] }
      ]
    },
    {
      numero: 7, nombre: '7MO SEMESTRE',
      color: 'from-[#002474] to-[#8cafff]',
      grupos: [
        { nombre: 'IA y Computación de Alto Rendimiento', gradiente: COLORES_GRUPO['IA y Computación de Alto Rendimiento'], materias: ['Visión por Computador', 'Aprendizaje Automático (Machine Learning)'] },
        { nombre: 'Sistemas de Información', gradiente: COLORES_GRUPO['Sistemas de Información'], materias: ['Ingeniería de Software'] }
      ]
    },
    {
      numero: 8, nombre: '8VO SEMESTRE',
      color: 'from-[#121358] to-[#4ad6ca]',
      grupos: [
        { nombre: 'Gestión de Datos e Información', gradiente: COLORES_GRUPO['Gestión de Datos e Información'], materias: ['Minería de Datos'] },
        { nombre: 'IA y Computación de Alto Rendimiento', gradiente: COLORES_GRUPO['IA y Computación de Alto Rendimiento'], materias: ['Computación Paralela'] },
        { nombre: 'Redes y Teleprocesamiento', gradiente: COLORES_GRUPO['Redes y Teleprocesamiento'], materias: ['Seguridad de la Información'] }
      ]
    }
  ];

  obtenerSemestres(): Semestre[] {
    return this.semestres;
  }

  obtenerSemestre(numero: number): Semestre | undefined {
    return this.semestres.find(s => s.numero === numero);
  }

  obtenerSemestreAnterior(numero: number): Semestre | undefined {
    return this.obtenerSemestre(numero - 1);
  }
}
