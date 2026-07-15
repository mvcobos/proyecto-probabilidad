import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { RespuestaEncuesta } from '../models/encuesta.model';

/**
 * Documento tal como queda guardado en la colección 'encuestas' de
 * Firestore: los mismos campos que EncuestaService escribe (ver
 * encuesta.service.ts), incluyendo las etiquetas derivadas del Likert
 * y la marca de tiempo del servidor.
 */
export interface EncuestaDoc extends RespuestaEncuesta {
  etiquetaTeoria: 'Positivo' | 'Neutro' | 'Negativo';
  etiquetaPractica: 'Positivo' | 'Neutro' | 'Negativo';
  fechaRegistro?: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class EncuestasLecturaService {

  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  /**
   * Lee la colección 'encuestas' en tiempo real. collectionData() (y
   * lo que hace por dentro, onSnapshot) necesita un injection context de
   * Angular, así que se ejecuta envuelto en runInInjectionContext para que
   * también funcione si este método se invoca fuera de la construcción
   * del servicio (por ejemplo, dentro de un operador RxJS).
   */
  obtenerEncuestas(): Observable<EncuestaDoc[]> {
    return runInInjectionContext(this.injector, () =>
      collectionData(collection(this.firestore, 'encuestas')) as Observable<EncuestaDoc[]>
    );
  }
}
