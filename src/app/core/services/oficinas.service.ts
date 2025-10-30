import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Oficina {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OficinasService {
  private apiUrl = `${environment.apiUrl}/oficinas`;

  constructor(private http: HttpClient) {}

  getOficinas(): Observable<Oficina[]> {
    return this.http.get<Oficina[]>(this.apiUrl);
  }

  getOficinaById(id: string): Observable<Oficina> {
    return this.http.get<Oficina>(`${this.apiUrl}/${id}`);
  }
}