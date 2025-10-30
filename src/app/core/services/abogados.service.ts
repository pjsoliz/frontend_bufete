import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Abogado {
  id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  especialidad?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AbogadosService {
  private apiUrl = `${environment.apiUrl}/abogados`;

  constructor(private http: HttpClient) {}

  getAbogados(): Observable<Abogado[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(abogados => abogados.map(abogado => ({
        ...abogado,
        nombreCompleto: abogado.nombreCompleto || `${abogado.nombre} ${abogado.apellido}`
      })))
    );
  }

  getAbogadoById(id: string): Observable<Abogado> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(abogado => ({
        ...abogado,
        nombreCompleto: abogado.nombreCompleto || `${abogado.nombre} ${abogado.apellido}`
      }))
    );
  }
}