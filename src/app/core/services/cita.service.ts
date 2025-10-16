import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Cita, CitaCreate, CitaUpdate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  constructor(private api: ApiService) {}

  // DATOS MOCK para pruebas
  private mockCitas: Cita[] = [
    {
      id: 1,
      fecha_hora: '2025-10-15T10:00:00',
      duracion_minutos: 60,
      tipo_cita: 'CONSULTA',
      estado: 'CONFIRMADA',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Oficina Central - Sala 3',
      notas: 'Primera consulta sobre caso laboral',
      cliente: {
        id: 1,
        email: 'cliente@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '555-0101',
        rol: 'CLIENTE',
        estado: true,
        fecha_registro: '2025-01-10'
      },
      abogado: {
        id: 2,
        email: 'abogado@example.com',
        nombre: 'María',
        apellido: 'González',
        telefono: '555-0102',
        rol: 'ABOGADO',
        estado: true,
        fecha_registro: '2024-06-01'
      },
      recordatorios_enviados: 1
    },
    {
      id: 2,
      fecha_hora: '2025-10-16T14:00:00',
      duracion_minutos: 45,
      tipo_cita: 'SEGUIMIENTO',
      estado: 'PENDIENTE',
      modalidad: 'VIRTUAL',
      link_virtual: 'https://meet.google.com/abc-defg-hij',
      notas: 'Revisión de avances del caso',
      cliente: {
        id: 3,
        email: 'ana@example.com',
        nombre: 'Ana',
        apellido: 'Martínez',
        telefono: '555-0103',
        rol: 'CLIENTE',
        estado: true,
        fecha_registro: '2025-01-28'
      },
      abogado: {
        id: 2,
        email: 'abogado@example.com',
        nombre: 'María',
        apellido: 'González',
        telefono: '555-0102',
        rol: 'ABOGADO',
        estado: true,
        fecha_registro: '2024-06-01'
      },
      recordatorios_enviados: 0
    }
  ];

  getCitas(filters?: any): Observable<Cita[]> {
    return of(this.mockCitas);
    // Con backend:
    // return this.api.get<Cita[]>('citas/', filters);
  }

  getCitaById(id: number): Observable<Cita> {
    const cita = this.mockCitas.find(c => c.id === id);
    return of(cita!);
    // Con backend:
    // return this.api.get<Cita>(`citas/${id}/`);
  }

  createCita(data: CitaCreate): Observable<Cita> {
    return this.api.post<Cita>('citas/', data);
  }

  updateCita(id: number, data: CitaUpdate): Observable<Cita> {
    return this.api.patch<Cita>(`citas/${id}/`, data);
  }

  cancelarCita(id: number, motivo: string): Observable<Cita> {
    return this.api.post<Cita>(`citas/${id}/cancelar/`, { motivo_cancelacion: motivo });
  }

  confirmarCita(id: number): Observable<Cita> {
    return this.api.post<Cita>(`citas/${id}/confirmar/`, {});
  }

  getMisCitas(): Observable<Cita[]> {
    return of(this.mockCitas);
    // Con backend:
    // return this.api.get<Cita[]>('citas/mis_citas/');
  }

  getCitasProximas(): Observable<Cita[]> {
    return of(this.mockCitas.filter(c => c.estado === 'CONFIRMADA' || c.estado === 'PENDIENTE'));
    // Con backend:
    // return this.api.get<Cita[]>('citas/proximas/');
  }
}