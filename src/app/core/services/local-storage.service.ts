import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly KEY = 'encuestasRespondidas';

  obtener(): string[] {
    return JSON.parse(localStorage.getItem(this.KEY) ?? '[]');
  }

  registrar(id: string): void {

    const lista = this.obtener();

    if (!lista.includes(id)) {
      lista.push(id);
      localStorage.setItem(this.KEY, JSON.stringify(lista));
    }

  }

  yaRespondio(id: string): boolean {

    return this.obtener().includes(id);

  }

}