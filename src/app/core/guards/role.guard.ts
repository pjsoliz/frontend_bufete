import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();

    console.log('RoleGuard - Rol del usuario:', userRole);
    console.log('RoleGuard - Roles permitidos:', allowedRoles);

    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('RoleGuard - Usuario no autenticado, redirigiendo al login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Verificar si hay rol
    if (!userRole) {
      console.log('RoleGuard - No hay rol, redirigiendo al login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Si no hay roles especificados, permitir acceso
    if (!allowedRoles || allowedRoles.length === 0) {
      console.log('RoleGuard - No hay roles especificados, permitiendo acceso');
      return true;
    }

    // Verificar si el rol del usuario está en los roles permitidos
    const hasPermission = allowedRoles.includes(userRole);

    if (hasPermission) {
      console.log('RoleGuard - Usuario tiene permiso ✅');
      return true;
    }

    // Usuario no tiene permiso
    console.log('RoleGuard - Usuario NO tiene permiso ❌');
    console.log(`RoleGuard - Redirigiendo al dashboard (rol actual: ${userRole})`);
    
    // Redirigir al dashboard en lugar de mostrar alert
    this.router.navigate(['/dashboard']);
    return false;
  }
}