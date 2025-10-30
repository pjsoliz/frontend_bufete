import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interface que coincide con el backend
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

  // ⭐ Helper para construir nombreCompleto si viene separado
  private construirNombreCompleto(cliente: any): string {
    if (cliente.nombreCompleto) return cliente.nombreCompleto;
    if (cliente.nombre && cliente.apellido) return `${cliente.nombre} ${cliente.apellido}`;
    return cliente.nombre || cliente.apellido || 'Sin nombre';
  }

  // ⭐ Transformar cliente
  private transformarCliente(cliente: any): Cliente {
    return {
      ...cliente,
      nombreCompleto: this.construirNombreCompleto(cliente)
    };
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(clientes => clientes.map(cliente => this.transformarCliente(cliente)))
    );
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(cliente => this.transformarCliente(cliente))
    );
  }

  createCliente(cliente: ClienteCreate): Observable<Cliente> {
    return this.http.post<any>(this.apiUrl, cliente).pipe(
      map(cliente => this.transformarCliente(cliente))
    );
  }

  updateCliente(id: string, cliente: Partial<ClienteCreate>): Observable<Cliente> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente).pipe(
      map(cliente => this.transformarCliente(cliente))
    );
  }

  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}