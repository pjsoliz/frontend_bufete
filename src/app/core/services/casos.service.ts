import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Caso {
  id: number;
  numero_caso: string;
  titulo: string;
  descripcion: string;
  tipo: 'Civil' | 'Penal' | 'Familiar';
  estado: 'pendiente' | 'en_progreso' | 'suspendido' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta';
  cliente: string;
  abogado?: string;
  fecha_inicio: string;
  fecha_cierre?: string;
  monto_reclamado?: number;
  monto_ganado?: number;
  juzgado?: string;
  numero_expediente?: string;
  notas?: string;
  documentos?: number;
  proxima_audiencia?: string;
  actividades?: Actividad[];
}

export interface Actividad {
  id: number;
  fecha: string;
  tipo: 'audiencia' | 'documento' | 'nota' | 'cambio_estado' | 'asignacion';
  descripcion: string;
  usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  // Datos mock de casos
  private casosMock: Caso[] = [
    {
      id: 1,
      numero_caso: 'CAS-2025-001',
      titulo: 'Demanda Laboral - Despido Injustificado',
      descripcion: 'Caso de despido injustificado de trabajador con 10 años de antigüedad. Se busca indemnización y reinstalación.',
      tipo: 'Civil',
      estado: 'en_progreso',
      prioridad: 'alta',
      cliente: 'Juan Pérez',
      abogado: 'Dr. Carlos Méndez',
      fecha_inicio: '2025-01-15',
      monto_reclamado: 50000,
      juzgado: 'Juzgado Laboral N°3',
      numero_expediente: 'EXP-LAB-2025-001',
      documentos: 12,
      proxima_audiencia: '2025-10-25',
      notas: 'Cliente muy cooperativo, documentación completa',
      actividades: [
        {
          id: 1,
          fecha: '2025-10-15',
          tipo: 'audiencia',
          descripcion: 'Audiencia preliminar realizada',
          usuario: 'Dr. Carlos Méndez'
        },
        {
          id: 2,
          fecha: '2025-10-10',
          tipo: 'documento',
          descripcion: 'Presentación de demanda formal',
          usuario: 'Dr. Carlos Méndez'
        },
        {
          id: 3,
          fecha: '2025-01-15',
          tipo: 'asignacion',
          descripcion: 'Caso asignado al Dr. Carlos Méndez',
          usuario: 'Sistema'
        }
      ]
    },
    {
      id: 2,
      numero_caso: 'CAS-2025-002',
      titulo: 'Divorcio Contencioso',
      descripcion: 'Proceso de divorcio con disputa de bienes y custodia de menores.',
      tipo: 'Familiar',
      estado: 'en_progreso',
      prioridad: 'media',
      cliente: 'María López',
      abogado: 'Dra. Ana Torres',
      fecha_inicio: '2025-02-01',
      juzgado: 'Juzgado de Familia N°5',
      numero_expediente: 'EXP-FAM-2025-045',
      documentos: 8,
      proxima_audiencia: '2025-10-30',
      notas: 'Caso sensible, mediación recomendada',
      actividades: [
        {
          id: 1,
          fecha: '2025-10-12',
          tipo: 'audiencia',
          descripcion: 'Audiencia de conciliación',
          usuario: 'Dra. Ana Torres'
        },
        {
          id: 2,
          fecha: '2025-02-01',
          tipo: 'cambio_estado',
          descripcion: 'Caso iniciado',
          usuario: 'Sistema'
        }
      ]
    },
    {
      id: 3,
      numero_caso: 'CAS-2025-003',
      titulo: 'Reclamación de Daños y Perjuicios',
      descripcion: 'Accidente de tránsito con lesiones graves. Responsabilidad civil.',
      tipo: 'Civil',
      estado: 'pendiente',
      prioridad: 'alta',
      cliente: 'Pedro González',
      fecha_inicio: '2025-09-20',
      monto_reclamado: 80000,
      juzgado: 'Juzgado Civil N°7',
      numero_expediente: 'EXP-CIV-2025-112',
      documentos: 5,
      notas: 'Esperando asignación de abogado',
      actividades: [
        {
          id: 1,
          fecha: '2025-09-20',
          tipo: 'nota',
          descripcion: 'Cliente registrado, recopilando documentación',
          usuario: 'Recepción'
        }
      ]
    },
    {
      id: 4,
      numero_caso: 'CAS-2025-004',
      titulo: 'Defensa Penal - Delito Menor',
      descripcion: 'Defensa en proceso penal por delito menor. Se busca absolución.',
      tipo: 'Penal',
      estado: 'en_progreso',
      prioridad: 'alta',
      cliente: 'Roberto Silva',
      abogado: 'Dr. Luis Ramírez',
      fecha_inicio: '2025-03-10',
      juzgado: 'Juzgado Penal N°2',
      numero_expediente: 'EXP-PEN-2025-033',
      documentos: 15,
      proxima_audiencia: '2025-11-05',
      notas: 'Caso complejo, requiere preparación exhaustiva',
      actividades: [
        {
          id: 1,
          fecha: '2025-10-08',
          tipo: 'audiencia',
          descripcion: 'Audiencia de declaración testimonial',
          usuario: 'Dr. Luis Ramírez'
        }
      ]
    },
    {
      id: 5,
      numero_caso: 'CAS-2025-005',
      titulo: 'Contrato Comercial - Incumplimiento',
      descripcion: 'Demanda por incumplimiento de contrato comercial entre empresas.',
      tipo: 'Penal',
      estado: 'suspendido',
      prioridad: 'media',
      cliente: 'Laura Martínez',
      abogado: 'Dra. Ana Torres',
      fecha_inicio: '2025-04-15',
      monto_reclamado: 120000,
      juzgado: 'Juzgado Comercial N°4',
      numero_expediente: 'EXP-COM-2025-078',
      documentos: 20,
      notas: 'Caso suspendido por solicitud de mediación',
      actividades: [
        {
          id: 1,
          fecha: '2025-09-30',
          tipo: 'cambio_estado',
          descripcion: 'Caso suspendido por mediación',
          usuario: 'Dra. Ana Torres'
        }
      ]
    },
    {
      id: 6,
      numero_caso: 'CAS-2024-156',
      titulo: 'Reclamo Laboral - Salarios Impagos',
      descripcion: 'Reclamo de salarios impagos por 6 meses.',
      tipo: 'Familiar',
      estado: 'cerrado',
      prioridad: 'baja',
      cliente: 'Carmen Ruiz',
      abogado: 'Dr. Carlos Méndez',
      fecha_inicio: '2024-11-10',
      fecha_cierre: '2025-09-15',
      monto_reclamado: 18000,
      monto_ganado: 18000,
      juzgado: 'Juzgado Laboral N°1',
      numero_expediente: 'EXP-LAB-2024-298',
      documentos: 8,
      notas: 'Caso ganado, cliente satisfecho',
      actividades: [
        {
          id: 1,
          fecha: '2025-09-15',
          tipo: 'cambio_estado',
          descripcion: 'Caso cerrado exitosamente',
          usuario: 'Dr. Carlos Méndez'
        }
      ]
    },
  ];

  constructor() {}

  getCasos(): Observable<Caso[]> {
    return of(this.casosMock).pipe(delay(500));
  }

  getCasoById(id: number): Observable<Caso | undefined> {
    const caso = this.casosMock.find(c => c.id === id);
    return of(caso).pipe(delay(300));
  }

  createCaso(caso: Omit<Caso, 'id' | 'numero_caso' | 'actividades'>): Observable<Caso> {
    const newCaso: Caso = {
      ...caso,
      id: Math.max(...this.casosMock.map(c => c.id)) + 1,
      numero_caso: `CAS-2025-${String(this.casosMock.length + 1).padStart(3, '0')}`,
      actividades: [
        {
          id: 1,
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'cambio_estado',
          descripcion: 'Caso creado',
          usuario: 'Sistema'
        }
      ]
    };
    this.casosMock.push(newCaso);
    return of(newCaso).pipe(delay(500));
  }

  updateCaso(id: number, caso: Partial<Caso>): Observable<Caso> {
    const index = this.casosMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.casosMock[index] = { ...this.casosMock[index], ...caso };
      return of(this.casosMock[index]).pipe(delay(500));
    }
    throw new Error('Caso no encontrado');
  }

  deleteCaso(id: number): Observable<boolean> {
    const index = this.casosMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.casosMock.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  cambiarEstado(id: number, estado: Caso['estado']): Observable<Caso> {
    return this.updateCaso(id, { estado });
  }

  asignarAbogado(id: number, abogado: string): Observable<Caso> {
    return this.updateCaso(id, { abogado });
  }

  agregarActividad(casoId: number, actividad: Omit<Actividad, 'id'>): Observable<Caso> {
    const caso = this.casosMock.find(c => c.id === casoId);
    if (caso) {
      if (!caso.actividades) {
        caso.actividades = [];
      }
      const nuevaActividad: Actividad = {
        ...actividad,
        id: caso.actividades.length + 1
      };
      caso.actividades.unshift(nuevaActividad);
      return of(caso).pipe(delay(300));
    }
    throw new Error('Caso no encontrado');
  }
}