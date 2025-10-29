import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ✅ Interface que coincide con el backend
export interface Cliente {
  id: string;
  nombreCompleto: string;
  telefono: string;
  email?: string;
  plataforma?: string;
  userIdPlataforma?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para crear/actualizar (sin campos automáticos)
export interface ClienteCreate {
  nombreCompleto: string;
  telefono: string;
  email?: string;
  plataforma?: string;
  userIdPlataforma?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los clientes
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * Obtener un cliente por ID
   */
  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo cliente
   */
  createCliente(cliente: ClienteCreate): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * Actualizar un cliente existente
   */
  updateCliente(id: string, cliente: Partial<ClienteCreate>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  /**
   * Eliminar un cliente
   */
  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}