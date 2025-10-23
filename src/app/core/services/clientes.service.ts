import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_documento: 'cedula' | 'pasaporte' | 'ruc';
  documento_identidad: string;
  fecha_nacimiento?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  estado: 'activo' | 'inactivo';
  fecha_registro: string;
  notas?: string;
  casos_activos?: number;
  casos_totales?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  // Datos mock de clientes
  private clientesMock: Cliente[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+593-99-123-4567',
      tipo_documento: 'cedula',
      documento_identidad: '1234567890',
      fecha_nacimiento: '1985-03-15',
      direccion: 'Av. Principal 123',
      ciudad: 'Quito',
      provincia: 'Pichincha',
      estado: 'activo',
      fecha_registro: '2024-01-15',
      notas: 'Cliente regular, muy cooperativo',
      casos_activos: 1,
      casos_totales: 2
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'López',
      email: 'maria.lopez@email.com',
      telefono: '+593-98-765-4321',
      tipo_documento: 'cedula',
      documento_identidad: '0987654321',
      fecha_nacimiento: '1990-07-22',
      direccion: 'Calle Secundaria 456',
      ciudad: 'Guayaquil',
      provincia: 'Guayas',
      estado: 'activo',
      fecha_registro: '2025-02-01',
      notas: 'Caso de divorcio en proceso',
      casos_activos: 1,
      casos_totales: 1
    },
    {
      id: 3,
      nombre: 'Pedro',
      apellido: 'González',
      email: 'pedro.gonzalez@email.com',
      telefono: '+593-97-888-9999',
      tipo_documento: 'cedula',
      documento_identidad: '1122334455',
      fecha_nacimiento: '1978-11-30',
      direccion: 'Av. Los Andes 789',
      ciudad: 'Cuenca',
      provincia: 'Azuay',
      estado: 'activo',
      fecha_registro: '2025-09-20',
      notas: 'Cliente nuevo, caso de accidente',
      casos_activos: 1,
      casos_totales: 1
    },
    {
      id: 4,
      nombre: 'Laura',
      apellido: 'Martínez',
      email: 'laura.martinez@email.com',
      telefono: '+593-96-555-6666',
      tipo_documento: 'pasaporte',
      documento_identidad: 'AB123456',
      fecha_nacimiento: '1988-05-10',
      direccion: 'Urbanización El Bosque',
      ciudad: 'Quito',
      provincia: 'Pichincha',
      estado: 'activo',
      fecha_registro: '2025-06-01',
      notas: 'Caso de pensión alimenticia',
      casos_activos: 1,
      casos_totales: 1
    },
    {
      id: 5,
      nombre: 'Roberto',
      apellido: 'Silva',
      email: 'roberto.silva@email.com',
      telefono: '+593-95-444-3333',
      tipo_documento: 'cedula',
      documento_identidad: '5566778899',
      fecha_nacimiento: '1982-09-18',
      direccion: 'Sector Norte Km 5',
      ciudad: 'Loja',
      provincia: 'Loja',
      estado: 'activo',
      fecha_registro: '2025-03-10',
      notas: 'Defensa penal',
      casos_activos: 1,
      casos_totales: 1
    },
    {
      id: 6,
      nombre: 'Carmen',
      apellido: 'Ruiz',
      email: 'carmen.ruiz@email.com',
      telefono: '+593-94-222-1111',
      tipo_documento: 'cedula',
      documento_identidad: '9988776655',
      fecha_nacimiento: '1975-12-05',
      direccion: 'Centro Histórico 321',
      ciudad: 'Quito',
      provincia: 'Pichincha',
      estado: 'inactivo',
      fecha_registro: '2024-11-10',
      notas: 'Caso cerrado exitosamente',
      casos_activos: 0,
      casos_totales: 1
    },
  ];

  constructor() {}

  getClientes(): Observable<Cliente[]> {
    return of(this.clientesMock).pipe(delay(500));
  }

  getClienteById(id: number): Observable<Cliente | undefined> {
    const cliente = this.clientesMock.find(c => c.id === id);
    return of(cliente).pipe(delay(300));
  }

  createCliente(cliente: Omit<Cliente, 'id' | 'fecha_registro' | 'casos_activos' | 'casos_totales'>): Observable<Cliente> {
    const newCliente: Cliente = {
      ...cliente,
      id: Math.max(...this.clientesMock.map(c => c.id)) + 1,
      fecha_registro: new Date().toISOString().split('T')[0],
      casos_activos: 0,
      casos_totales: 0
    };
    this.clientesMock.push(newCliente);
    return of(newCliente).pipe(delay(500));
  }

  updateCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    const index = this.clientesMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientesMock[index] = { ...this.clientesMock[index], ...cliente };
      return of(this.clientesMock[index]).pipe(delay(500));
    }
    throw new Error('Cliente no encontrado');
  }

  deleteCliente(id: number): Observable<boolean> {
    const index = this.clientesMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientesMock.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  activarCliente(id: number): Observable<Cliente> {
    return this.updateCliente(id, { estado: 'activo' });
  }

  desactivarCliente(id: number): Observable<Cliente> {
    return this.updateCliente(id, { estado: 'inactivo' });
  }
}