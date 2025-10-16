import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthState, LoginRequest, LoginResponse, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: this.getUserFromStorage(),
    token: this.getToken(),
    isAuthenticated: !!this.getToken(),
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.access);
          this.setRefreshToken(response.refresh);
          this.setUser(response.user);
          this.updateAuthState(response.user, response.access);
          this.setLoading(false);
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register/`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.rol === role : false;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private updateAuthState(user: User, token: string): void {
    this.authStateSubject.next({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  }

  private setLoading(isLoading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({ ...currentState, isLoading });
  }
}