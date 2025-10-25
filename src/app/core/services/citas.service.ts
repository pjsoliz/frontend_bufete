import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Cita {
  id: number;
  titulo: string;  // ← AGREGAR ESTA PROPIEDAD
  fecha: string;
  hora: string;
  duracion: number;
  tipo: 'consulta' | 'audiencia' | 'reunion' | 'firma' | 'otro';
  cliente: string;
  abogado?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' |'cancelada';
  ubicacion?: string;  // ← AGREGAR ESTA PROPIEDAD
  descripcion?: string;
  notas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  // Datos mock
  private citasMock: Cita[] = [
    {
      id: 1,
      titulo: 'Consulta Inicial - Caso Laboral',
      fecha: '2025-10-20',
      hora: '09:00',
      duracion: 60,
      tipo: 'consulta',
      cliente: 'Juan Pérez',
      abogado: 'Dr. Carlos Méndez',
      estado: 'confirmada',
      ubicacion: 'Oficina Principal - Sala 1',
      descripcion: 'Primera consulta sobre caso de despido injustificado',
      notas: 'Cliente muy puntual, traer documentación laboral'
    },
    {
      id: 2,
      titulo: 'Audiencia de Divorcio',
      fecha: '2025-10-22',
      hora: '10:30',
      duracion: 120,
      tipo: 'audiencia',
      cliente: 'María López',
      abogado: 'Dra. Ana Torres',
      estado: 'confirmada',
      ubicacion: 'Juzgado de Familia N°5',
      descripcion: 'Audiencia de divorcio contencioso',
      notas: 'Llevar todos los documentos de bienes'
    },
    {
      id: 3,
      titulo: 'Reunión con Cliente - Caso Civil',
      fecha: '2025-10-18',
      hora: '14:00',
      duracion: 45,
      tipo: 'reunion',
      cliente: 'Pedro González',
      abogado: 'Dr. Luis Ramírez',
      estado: 'cancelada',
      ubicacion: 'Oficina Principal - Sala 2',
      descripcion: 'Revisión de avances del caso de daños y perjuicios',
      notas: 'Reunión completada exitosamente'
    },
    {
      id: 4,
      titulo: 'Firma de Documentos',
      fecha: '2025-10-25',
      hora: '11:00',
      duracion: 30,
      tipo: 'firma',
      cliente: 'Laura Martínez',
      abogado: 'Dra. María González',
      estado: 'pendiente',
      ubicacion: 'Oficina Principal - Sala 3',
      descripcion: 'Firma de documentos de pensión alimenticia',
      notas: 'Confirmar asistencia 24h antes'
    },
    {
      id: 5,
      titulo: 'Consulta Legal - Defensa Penal',
      fecha: '2025-10-17',
      hora: '15:30',
      duracion: 90,
      tipo: 'consulta',
      cliente: 'Roberto Silva',
      abogado: 'Dr. Luis Ramírez',
      estado: 'completada',
      ubicacion: 'Oficina Principal - Sala 1',
      descripcion: 'Consulta sobre estrategia de defensa',
      notas: 'Cliente satisfecho con la estrategia propuesta'
    },
    {
      id: 6,
      titulo: 'Audiencia Preliminar',
      fecha: '2025-10-28',
      hora: '09:30',
      duracion: 60,
      tipo: 'audiencia',
      cliente: 'Carmen Ruiz',
      abogado: 'Dr. Carlos Méndez',
      estado: 'pendiente',
      ubicacion: 'Juzgado Laboral N°3',
      descripcion: 'Audiencia preliminar caso laboral',
      notas: 'Preparar argumentos principales'
    },
  ];

  constructor() {}

  getCitas(): Observable<Cita[]> {
    return of(this.citasMock).pipe(delay(500));
  }

  getCitaById(id: number): Observable<Cita | undefined> {
    const cita = this.citasMock.find(c => c.id === id);
    return of(cita).pipe(delay(300));
  }

  createCita(cita: Omit<Cita, 'id'>): Observable<Cita> {
    const newCita: Cita = {
      ...cita,
      id: Math.max(...this.citasMock.map(c => c.id)) + 1
    };
    this.citasMock.push(newCita);
    return of(newCita).pipe(delay(500));
  }

  updateCita(id: number, cita: Partial<Cita>): Observable<Cita> {
    const index = this.citasMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.citasMock[index] = { ...this.citasMock[index], ...cita };
      return of(this.citasMock[index]).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  deleteCita(id: number): Observable<boolean> {
    const index = this.citasMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.citasMock.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  cancelarCita(id: number): Observable<Cita> {
    return this.updateCita(id, { estado: 'cancelada' });
  }

  confirmarCita(id: number): Observable<Cita> {
    return this.updateCita(id, { estado: 'confirmada' });
  }

  completarCita(id: number): Observable<Cita> {
    return this.updateCita(id, { estado: 'completada' });
  }
}
