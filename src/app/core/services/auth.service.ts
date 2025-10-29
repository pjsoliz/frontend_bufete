import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Login con backend real
   */
  login(credentials: any): Observable<any> {
    console.log('Intentando login con:', credentials);

    // ✅ LLAMADA REAL AL BACKEND
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login exitoso:', response);
        
        // Guardar token (access_token)
        localStorage.setItem('token', response.access_token);
        
        // Guardar usuario
        localStorage.setItem('user', JSON.stringify(response.user));
      }),
      catchError(error => {
        console.error('Error en login:', error);
        
        // Mensaje más descriptivo
        if (error.status === 401) {
          console.error('Credenciales incorrectas');
        } else if (error.status === 0) {
          console.error('No se puede conectar al servidor');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Registro (si lo necesitas después)
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(error => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    console.log('Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtener usuario actual
   */
  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Alias para compatibilidad
   */
  getCurrentUser(): any {
    return this.getUser();
  }

  /**
   * Obtener rol del usuario
   */
  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.rol : null;
  }

  /**
   * Obtener ID del usuario
   */
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  /**
   * Verificar si es admin
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 'admin';
  }

  /**
   * Verificar si es asistente
   */
  isAsistente(): boolean {
    const user = this.getUser();
    return user?.rol === 'asistente_legal';
  }

  /**
   * Actualizar usuario (opcional)
   */
  updateUser(userData: any): Observable<any> {
    const userId = this.getUserId();
    return this.http.put(`${this.apiUrl}/usuarios/${userId}`, userData).pipe(
      tap((response: any) => {
        // Actualizar en localStorage
        const currentUser = this.getUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }),
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        return throwError(() => error);
      })
    );
  }
}