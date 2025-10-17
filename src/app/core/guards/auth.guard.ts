import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard - Verificando autenticación');

    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard - Usuario autenticado');
      return true;
    }

    console.log('AuthGuard - Usuario NO autenticado, redirigiendo al login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
