import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces que coinciden con el backend
export interface Cliente {
  id: string;
  nombreCompleto: string;
}

export interface Abogado {
  id: string;
  nombreCompleto: string;
}

export interface AreaDerecho {
  id: string;
  nombre: string;
}

export interface TipoCita {
  id: string;
  nombre: string;
}

export interface TipoCaso {
  id: string;
  nombre: string;
}

export interface Oficina {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface Cita {
  id: string;
  fecha: Date;
  hora: string;
  cliente: Cliente;
  abogado: Abogado;
  areaDerecho: AreaDerecho;
  tipoCita: TipoCita;
  tipoCaso: TipoCaso;
  oficina: Oficina;
  descripcion?: string;
  notasAdicionales?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
  urgencia: 'alta' | 'media' | 'baja';
  origen: 'chatbot' | 'panel_web' | 'presencial';
  telefonoContacto?: string;
  recordatorioEnviado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para crear/actualizar citas
export interface CitaCreate {
  fecha: string;
  hora: string;
  clienteId: string;
  abogadoId: string;
  areaDerechoId: string;
  tipoCitaId: string;
  tipoCasoId: string;
  oficinaId: string;
  descripcion?: string;
  notasAdicionales?: string;
  urgencia: 'alta' | 'media' | 'baja';
  origen: 'chatbot' | 'panel_web' | 'presencial';
  telefonoContacto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  // ⭐ Helper para construir nombreCompleto
  private construirNombreCompleto(obj: any): string {
    if (!obj) return 'Sin nombre';
    if (obj.nombreCompleto) return obj.nombreCompleto;
    if (obj.nombre && obj.apellido) return `${obj.nombre} ${obj.apellido}`;
    return obj.nombre || obj.apellido || 'Sin nombre';
  }

  // ⭐ Transformar cita para agregar nombreCompleto
  private transformarCita(cita: any): Cita {
    return {
      ...cita,
      abogado: cita.abogado ? {
        ...cita.abogado,
        nombreCompleto: this.construirNombreCompleto(cita.abogado)
      } : { id: '', nombreCompleto: 'Sin abogado' },
      cliente: cita.cliente ? {
        ...cita.cliente,
        nombreCompleto: this.construirNombreCompleto(cita.cliente)
      } : { id: '', nombreCompleto: 'Sin cliente' }
    };
  }

  // ✅ Helper para asegurar que fecha es string YYYY-MM-DD
  private normalizarFecha(fecha: string | Date): string {
    if (typeof fecha === 'string') {
      // Si ya es string, verificar formato
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }
      // Si es string pero no formato correcto, convertir
      const d = new Date(fecha);
      return this.dateToString(d);
    }
    // Si es Date, convertir
    return this.dateToString(fecha);
  }

  // ✅ Convertir Date a string YYYY-MM-DD sin zona horaria
  private dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCitas(): Observable<Cita[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(citas => citas.map(cita => this.transformarCita(cita)))
    );
  }

  getCitaById(id: string): Observable<Cita> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(cita => this.transformarCita(cita))
    );
  }

  createCita(cita: CitaCreate): Observable<Cita> {
    // ✅ ASEGURAR que fecha es string YYYY-MM-DD
    const citaNormalizada = {
      ...cita,
      fecha: this.normalizarFecha(cita.fecha)
    };
    
    console.log('📤 Enviando cita al backend:', citaNormalizada);
    
    return this.http.post<any>(this.apiUrl, citaNormalizada).pipe(
      map(cita => this.transformarCita(cita))
    );
  }

  updateCita(id: string, cita: Partial<CitaCreate>): Observable<Cita> {
    // ✅ ASEGURAR que fecha es string si existe
    const citaNormalizada = {
      ...cita,
      ...(cita.fecha && { fecha: this.normalizarFecha(cita.fecha) })
    };
    
    console.log('📤 Actualizando cita en backend:', citaNormalizada);
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, citaNormalizada).pipe(
      map(cita => this.transformarCita(cita))
    );
  }

  deleteCita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: string, estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio'): Observable<Cita> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/estado`, { estado }).pipe(
      map(cita => this.transformarCita(cita))
    );
  }

  confirmarCita(id: string): Observable<Cita> {
    return this.cambiarEstado(id, 'confirmada');
  }

  cancelarCita(id: string): Observable<Cita> {
    return this.cambiarEstado(id, 'cancelada');
  }

  completarCita(id: string): Observable<Cita> {
    return this.cambiarEstado(id, 'completada');
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`).pipe(
      map(citas => citas.map(cita => this.transformarCita(cita)))
    );
  }

  getCitasPorAbogado(abogadoId: string): Observable<Cita[]> {
    return this.http.get<any[]>(`${this.apiUrl}/abogado/${abogadoId}`).pipe(
      map(citas => citas.map(cita => this.transformarCita(cita)))
    );
  }

  getCitasPorFecha(fecha: string): Observable<Cita[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fecha/${fecha}`).pipe(
      map(citas => citas.map(cita => this.transformarCita(cita)))
    );
  }

  // 🆕 NUEVO: Notificar cambio de estado a n8n
  notificarCambioEstado(citaId: string, estadoAnterior: string, usuarioNombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notificar-cambio-estado`, {
      citaId: citaId,
      estadoAnterior: estadoAnterior,
      usuarioNombre: usuarioNombre
    });
  }
}