import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  rol: 'admin' | 'asistente_legal';
  activo: boolean;
  ultimoAcceso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsuarioCreate {
  nombreCompleto: string;
  email: string;
  password: string;
  rol: 'admin' | 'asistente_legal';
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: string, usuario: Partial<UsuarioCreate>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cambiarEstadoUsuario(id: string, activo: boolean): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, { activo });
  }
}