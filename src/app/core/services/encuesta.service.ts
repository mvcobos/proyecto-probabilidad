import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { RespuestaEncuesta } from '../models/encuesta.model';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  private firestore = inject(Firestore);

  private obtenerEtiqueta(valor: number): 'Positivo' | 'Neutro' | 'Negativo' {
    if (valor >= 4) return 'Positivo';
    if (valor === 3) return 'Neutro';
    return 'Negativo';
  }

  async guardarEncuesta(respuesta: RespuestaEncuesta) {

    const encuesta = {

      ...respuesta,

      etiquetaTeoria: this.obtenerEtiqueta(respuesta.clasesTeoricasUtiles),

      etiquetaPractica: this.obtenerEtiqueta(respuesta.clasesPracticasUtiles),

      fechaRegistro: serverTimestamp()

    };

    return addDoc(
      collection(this.firestore, 'encuestas'),
      encuesta
    );
  }

}