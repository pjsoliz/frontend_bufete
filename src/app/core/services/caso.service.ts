import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Caso, CasoCreate, CasoUpdate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CasoService {

  constructor(private api: ApiService) {}

  // DATOS MOCK para pruebas sin backend
  private mockCasos: Caso[] = [
    {
      id: 1,
      numero_caso: 'CASO-2025-001',
      titulo: 'Demanda Laboral - Despido Injustificado',
      descripcion: 'Cliente despedido sin causa justificada tras 5 años de servicio',
      tipo_caso: 'LABORAL',
      estado: 'EN_PROCESO',
      prioridad: 'ALTA',
      fecha_apertura: '2025-01-15T10:00:00',
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
      abogado_asignado: {
        id: 2,
        email: 'abogado@example.com',
        nombre: 'María',
        apellido: 'González',
        telefono: '555-0102',
        rol: 'ABOGADO',
        estado: true,
        fecha_registro: '2024-06-01'
      },
      monto_reclamado: 50000,
      notas_internas: 'Cliente tiene todos los documentos en orden'
    },
    {
      id: 2,
      numero_caso: 'CASO-2025-002',
      titulo: 'Divorcio Contencioso',
      descripcion: 'Proceso de divorcio con disputa de bienes',
      tipo_caso: 'FAMILIA',
      estado: 'ABIERTO',
      prioridad: 'MEDIA',
      fecha_apertura: '2025-02-01T09:30:00',
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
      abogado_asignado: {
        id: 2,
        email: 'abogado@example.com',
        nombre: 'María',
        apellido: 'González',
        telefono: '555-0102',
        rol: 'ABOGADO',
        estado: true,
        fecha_registro: '2024-06-01'
      },
      monto_reclamado: 100000
    }
  ];

  getCasos(filters?: any): Observable<Caso[]> {
    // Sin backend, retornamos datos mock
    return of(this.mockCasos);
    // Con backend descomentar:
    // return this.api.get<Caso[]>('casos/', filters);
  }

  getCasoById(id: number): Observable<Caso> {
    const caso = this.mockCasos.find(c => c.id === id);
    return of(caso!);
    // Con backend:
    // return this.api.get<Caso>(`casos/${id}/`);
  }

  createCaso(data: CasoCreate): Observable<Caso> {
    return this.api.post<Caso>('casos/', data);
  }

  updateCaso(id: number, data: CasoUpdate): Observable<Caso> {
    return this.api.patch<Caso>(`casos/${id}/`, data);
  }

  deleteCaso(id: number): Observable<any> {
    return this.api.delete(`casos/${id}/`);
  }

  getMisCasos(): Observable<Caso[]> {
    return of(this.mockCasos);
    // Con backend:
    // return this.api.get<Caso[]>('casos/mis_casos/');
  }
}