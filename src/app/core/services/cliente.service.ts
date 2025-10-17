import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private api: ApiService) {}

  // DATOS MOCK para pruebas
  private mockClientes: User[] = [
    {
      id: 1,
      email: 'juan.perez@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '555-0101',
      rol: 'ASISTENTE_LEGAL',
      estado: true,
      fecha_registro: '2025-01-10T00:00:00'
    },
    {
      id: 3,
      email: 'ana.martinez@example.com',
      nombre: 'Ana',
      apellido: 'Martínez',
      telefono: '555-0103',
      rol: 'ASISTENTE_LEGAL',
      estado: true,
      fecha_registro: '2025-01-28T00:00:00'
    },
    {
      id: 5,
      email: 'carlos.lopez@example.com',
      nombre: 'Carlos',
      apellido: 'López',
      telefono: '555-0105',
      rol: 'ASISTENTE_LEGAL',
      estado: true,
      fecha_registro: '2025-02-05T00:00:00'
    }
  ];

  getClientes(filters?: any): Observable<User[]> {
    return of(this.mockClientes);
    // Con backend:
    // return this.api.get<User[]>('clientes/', filters);
  }

  getClienteById(id: number): Observable<User> {
    const cliente = this.mockClientes.find(c => c.id === id);
    return of(cliente!);
    // Con backend:
    // return this.api.get<User>(`clientes/${id}/`);
  }

  createCliente(data: any): Observable<User> {
    return this.api.post<User>('clientes/', data);
  }

  updateCliente(id: number, data: any): Observable<User> {
    return this.api.patch<User>(`clientes/${id}/`, data);
  }

  deleteCliente(id: number): Observable<any> {
    return this.api.delete(`clientes/${id}/`);
  }

  activarCliente(id: number): Observable<User> {
    return this.api.post<User>(`clientes/${id}/activar/`, {});
  }

  desactivarCliente(id: number): Observable<User> {
    return this.api.post<User>(`clientes/${id}/desactivar/`, {});
  }
}
