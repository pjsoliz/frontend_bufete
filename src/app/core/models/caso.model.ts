import { User } from './user.model';

export interface Caso {
  id: number;
  numero_caso: string;
  titulo: string;
  descripcion: string;
  tipo_caso: string;
  estado: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO' | 'ARCHIVADO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  fecha_apertura: string;
  fecha_cierre?: string;
  cliente: User;
  abogado_asignado?: User;
  monto_reclamado?: number;
  monto_ganado?: number;
  notas_internas?: string;
}

export interface CasoCreate {
  titulo: string;
  descripcion: string;
  tipo_caso: string;
  cliente_id: number;
  abogado_asignado_id?: number;
  prioridad?: string;
  monto_reclamado?: number;
}

export interface CasoUpdate {
  titulo?: string;
  descripcion?: string;
  tipo_caso?: string;
  estado?: string;
  prioridad?: string;
  abogado_asignado_id?: number;
  monto_reclamado?: number;
  monto_ganado?: number;
  notas_internas?: string;
}