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

    if (!userRole) {
      console.log('RoleGuard - No hay rol, redirigiendo al login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!allowedRoles || allowedRoles.length === 0) {
      console.log('RoleGuard - No hay roles especificados, permitiendo acceso');
      return true;
    }

    const hasPermission = allowedRoles.includes(userRole);

    if (hasPermission) {
      console.log('RoleGuard - Usuario tiene permiso');
      return true;
    }

    console.log('RoleGuard - Usuario NO tiene permiso');
    alert('No tienes permisos para acceder a esta sección');
    return false;
  }
}
