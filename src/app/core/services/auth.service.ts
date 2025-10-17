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

  // USUARIOS MOCK PARA PRUEBAS
  private mockUsers = [
    {
      username: 'admin',
      password: 'admin123',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@genesis.com',
        first_name: 'Administrador',
        last_name: 'Sistema',
        rol: 'administrador'
      },
      token: 'mock-token-admin'
    },
    {
      username: 'abogado',
      password: 'abogado123',
      user: {
        id: 2,
        username: 'abogado',
        email: 'abogado@genesis.com',
        first_name: 'Juan',
        last_name: 'Pérez',
        rol: 'abogado'
      },
      token: 'mock-token-abogado'
    },
    {
      username: 'asistente',
      password: 'asistente123',
      user: {
        id: 3,
        username: 'asistente',
        email: 'asistente@genesis.com',
        first_name: 'María',
        last_name: 'González',
        rol: 'asistente_legal'
      },
      token: 'mock-token-asistente'
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: any): Observable<any> {
    console.log('Intentando login con:', credentials);

    // BUSCAR USUARIO MOCK
    const mockUser = this.mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (mockUser) {
      console.log('Usuario mock encontrado:', mockUser);

      // Guardar en localStorage
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser.user));

      return of({
        token: mockUser.token,
        user: mockUser.user
      });
    }

    // Si no encuentra el usuario mock
    console.log('Usuario no encontrado');
    return throwError(() => new Error('Credenciales incorrectas'));
  }

  register(userData: any): Observable<any> {
    console.log('Registro mock - datos:', userData);

    // Mock de registro exitoso
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      rol: userData.rol || 'cliente'
    };

    return of({
      user: newUser,
      message: 'Usuario registrado exitosamente'
    });

    // COMENTADO: Registro real con backend
    /*
    return this.http.post(`${this.apiUrl}/auth/register/`, userData).pipe(
      catchError(error => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
    */
  }

  logout(): void {
    console.log('Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getCurrentUser(): any {
    // Alias de getUser() para compatibilidad
    return this.getUser();
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.rol : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  updateUser(userData: any): Observable<any> {
    console.log('Actualizar usuario mock:', userData);

    // Actualizar en localStorage
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return of({
        user: updatedUser,
        message: 'Usuario actualizado exitosamente'
      });
    }

    return throwError(() => new Error('No hay usuario autenticado'));
  }
}
