import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as string[];
    
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated || !authState.user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const userRole = authState.user.rol;
        if (allowedRoles.includes(userRole)) {
          return true;
        }

        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}