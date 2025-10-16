export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'ADMIN' | 'ABOGADO' | 'CLIENTE';
  estado: boolean;
  foto_perfil?: string;
  fecha_registro: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol?: string;
}