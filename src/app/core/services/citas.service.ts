import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  cliente: string;
  abogado: string;
  tipo: string;
  estado: 'programada' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  duracion: number; // en minutos
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  // Datos mock
  private citasMock: Cita[] = [
    {
      id: 1,
      fecha: '2025-10-18',
      hora: '09:00',
      cliente: 'Juan Pérez',
      abogado: 'Dr. Carlos Méndez',
      tipo: 'Consulta Inicial',
      estado: 'confirmada',
      notas: 'Cliente nuevo, caso laboral',
      duracion: 60
    },
    {
      id: 2,
      fecha: '2025-10-18',
      hora: '10:30',
      cliente: 'María López',
      abogado: 'Dra. Ana Torres',
      tipo: 'Seguimiento',
      estado: 'programada',
      notas: 'Revisar documentación del caso',
      duracion: 45
    },
    {
      id: 3,
      fecha: '2025-10-18',
      hora: '14:00',
      cliente: 'Pedro González',
      abogado: 'Dr. Carlos Méndez',
      tipo: 'Audiencia Preparatoria',
      estado: 'confirmada',
      notas: 'Preparar estrategia para audiencia',
      duracion: 90
    },
    {
      id: 4,
      fecha: '2025-10-19',
      hora: '09:00',
      cliente: 'Laura Martínez',
      abogado: 'Dra. Ana Torres',
      tipo: 'Consulta Inicial',
      estado: 'programada',
      notas: 'Caso de familia, divorcio',
      duracion: 60
    },
    {
      id: 5,
      fecha: '2025-10-19',
      hora: '11:00',
      cliente: 'Roberto Silva',
      abogado: 'Dr. Luis Ramírez',
      tipo: 'Seguimiento',
      estado: 'programada',
      notas: 'Actualización de caso penal',
      duracion: 45
    },
    {
      id: 6,
      fecha: '2025-10-17',
      hora: '10:00',
      cliente: 'Carmen Ruiz',
      abogado: 'Dr. Carlos Méndez',
      tipo: 'Consulta',
      estado: 'completada',
      notas: 'Consulta completada exitosamente',
      duracion: 60
    },
    {
      id: 7,
      fecha: '2025-10-17',
      hora: '15:00',
      cliente: 'Jorge Castillo',
      abogado: 'Dra. Ana Torres',
      tipo: 'Seguimiento',
      estado: 'cancelada',
      notas: 'Cliente canceló por motivos personales',
      duracion: 45
    },
    {
      id: 8,
      fecha: '2025-10-20',
      hora: '10:00',
      cliente: 'Sandra Morales',
      abogado: 'Dr. Luis Ramírez',
      tipo: 'Consulta Inicial',
      estado: 'programada',
      notas: 'Caso comercial',
      duracion: 60
    }
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