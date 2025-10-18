import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  rol: 'administrador' | 'abogado' | 'asistente_legal';
  estado: 'activo' | 'inactivo';
  telefono?: string;
  fecha_registro: string;
  ultimo_acceso?: string;
  especialidad?: string;
  casos_asignados?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuariosMock: Usuario[] = [
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Méndez',
      email: 'carlos.mendez@genesis.com',
      username: 'cmendes',
      rol: 'abogado',
      estado: 'activo',
      telefono: '+593-99-111-2222',
      fecha_registro: '2024-01-15',
      ultimo_acceso: '2025-10-17',
      especialidad: 'Derecho Laboral',
      casos_asignados: 8
    },
    {
      id: 2,
      nombre: 'Ana',
      apellido: 'Torres',
      email: 'ana.torres@genesis.com',
      username: 'atorres',
      rol: 'abogado',
      estado: 'activo',
      telefono: '+593-98-222-3333',
      fecha_registro: '2024-02-20',
      ultimo_acceso: '2025-10-17',
      especialidad: 'Derecho Civil y Familia',
      casos_asignados: 6
    },
    {
      id: 3,
      nombre: 'Luis',
      apellido: 'Ramírez',
      email: 'luis.ramirez@genesis.com',
      username: 'lramirez',
      rol: 'abogado',
      estado: 'activo',
      telefono: '+593-97-333-4444',
      fecha_registro: '2024-03-10',
      ultimo_acceso: '2025-10-16',
      especialidad: 'Derecho Penal',
      casos_asignados: 5
    },
    {
      id: 4,
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@genesis.com',
      username: 'mgonzalez',
      rol: 'abogado',
      estado: 'activo',
      telefono: '+593-96-444-5555',
      fecha_registro: '2024-05-15',
      ultimo_acceso: '2025-10-15',
      especialidad: 'Derecho de Familia',
      casos_asignados: 4
    },
    {
      id: 5,
      nombre: 'Pedro',
      apellido: 'Sánchez',
      email: 'pedro.sanchez@genesis.com',
      username: 'psanchez',
      rol: 'abogado',
      estado: 'activo',
      telefono: '+593-95-555-6666',
      fecha_registro: '2024-07-01',
      ultimo_acceso: '2025-10-14',
      especialidad: 'Derecho Comercial',
      casos_asignados: 3
    },
    {
      id: 6,
      nombre: 'Laura',
      apellido: 'Jiménez',
      email: 'laura.jimenez@genesis.com',
      username: 'ljimenez',
      rol: 'asistente_legal',
      estado: 'activo',
      telefono: '+593-94-666-7777',
      fecha_registro: '2024-02-01',
      ultimo_acceso: '2025-10-17',
      casos_asignados: 0
    },
    {
      id: 7,
      nombre: 'Roberto',
      apellido: 'Castro',
      email: 'roberto.castro@genesis.com',
      username: 'rcastro',
      rol: 'asistente_legal',
      estado: 'activo',
      telefono: '+593-93-777-8888',
      fecha_registro: '2024-04-10',
      ultimo_acceso: '2025-10-16',
      casos_asignados: 0
    },
    {
      id: 8,
      nombre: 'Carmen',
      apellido: 'Vargas',
      email: 'carmen.vargas@genesis.com',
      username: 'cvargas',
      rol: 'asistente_legal',
      estado: 'activo',
      telefono: '+593-92-888-9999',
      fecha_registro: '2024-06-15',
      ultimo_acceso: '2025-10-15',
      casos_asignados: 0
    },
    {
      id: 9,
      nombre: 'Diego',
      apellido: 'Morales',
      email: 'diego.morales@genesis.com',
      username: 'dmorales',
      rol: 'asistente_legal',
      estado: 'inactivo',
      telefono: '+593-91-999-0000',
      fecha_registro: '2024-01-20',
      ultimo_acceso: '2025-08-15',
      casos_asignados: 0
    },
    {
      id: 10,
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@genesis.com',
      username: 'admin',
      rol: 'administrador',
      estado: 'activo',
      telefono: '+593-99-000-1111',
      fecha_registro: '2024-01-01',
      ultimo_acceso: '2025-10-17',
      casos_asignados: 0
    }
  ];

  constructor() {}

  getUsuarios(): Observable<Usuario[]> {
    return of(this.usuariosMock).pipe(delay(500));
  }

  getUsuarioById(id: number): Observable<Usuario | undefined> {
    const usuario = this.usuariosMock.find(u => u.id === id);
    return of(usuario).pipe(delay(300));
  }

  createUsuario(usuario: Omit<Usuario, 'id' | 'fecha_registro' | 'ultimo_acceso' | 'casos_asignados'>): Observable<Usuario> {
    const newUsuario: Usuario = {
      ...usuario,
      id: Math.max(...this.usuariosMock.map(u => u.id)) + 1,
      fecha_registro: new Date().toISOString().split('T')[0],
      casos_asignados: 0
    };
    this.usuariosMock.push(newUsuario);
    return of(newUsuario).pipe(delay(500));
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    const index = this.usuariosMock.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuariosMock[index] = { ...this.usuariosMock[index], ...usuario };
      return of(this.usuariosMock[index]).pipe(delay(500));
    }
    throw new Error('Usuario no encontrado');
  }

  deleteUsuario(id: number): Observable<boolean> {
    const index = this.usuariosMock.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuariosMock.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  activarUsuario(id: number): Observable<Usuario> {
    return this.updateUsuario(id, { estado: 'activo' });
  }

  desactivarUsuario(id: number): Observable<Usuario> {
    return this.updateUsuario(id, { estado: 'inactivo' });
  }
}