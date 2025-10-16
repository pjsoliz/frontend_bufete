import { User } from './user.model';
import { Caso } from './caso.model';

export interface Cita {
  id: number;
  fecha_hora: string;
  duracion_minutos: number;
  tipo_cita: 'CONSULTA' | 'SEGUIMIENTO' | 'AUDIENCIA' | 'FIRMA';
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'NO_ASISTIO';
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'TELEFONICA';
  ubicacion?: string;
  link_virtual?: string;
  notas?: string;
  motivo_cancelacion?: string;
  cliente: User;
  abogado: User;
  caso?: Caso;
  recordatorios_enviados: number;
}

export interface CitaCreate {
  fecha_hora: string;
  duracion_minutos: number;
  tipo_cita: string;
  modalidad: string;
  cliente_id: number;
  abogado_id: number;
  caso_id?: number;
  ubicacion?: string;
  link_virtual?: string;
  notas?: string;
}

export interface CitaUpdate {
  fecha_hora?: string;
  duracion_minutos?: number;
  tipo_cita?: string;
  estado?: string;
  modalidad?: string;
  ubicacion?: string;
  link_virtual?: string;
  notas?: string;
  motivo_cancelacion?: string;
}