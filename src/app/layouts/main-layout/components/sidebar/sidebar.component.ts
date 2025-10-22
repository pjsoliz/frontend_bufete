import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  
  userRole: string = '';
  
  // Contadores para badges
  clientesCount = 156;
  casosActivos = 23;
  citasHoy = 5;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadCounters();
  }

  /**
   * Carga el rol del usuario actual
   */
  private loadUserRole(): void {
    const currentUser = this.authService.getCurrentUser();

    // Manejar valor directo, Observable o Promise
    const userAny = currentUser as any;
    if (!userAny) {
      this.userRole = '';
      return;
    }

    if (typeof userAny.subscribe === 'function') {
      // Observable
      userAny.subscribe((u: any) => {
        this.userRole = u?.rol ?? '';
      }, () => {
        this.userRole = '';
      });
    } else if (typeof userAny.then === 'function') {
      // Promise
      userAny.then((u: any) => {
        this.userRole = u?.rol ?? '';
      }).catch(() => {
        this.userRole = '';
      });
    } else {
      // Valor directo
      this.userRole = userAny?.rol ?? '';
    }
  }

  /**
   * Carga los contadores para los badges
   */
  private loadCounters(): void {
    // TODO: Implementar llamadas reales al backend
    // Por ahora usamos datos mock
    this.clientesCount = 156;
    this.casosActivos = 23;
    this.citasHoy = 5;
  }

  /**
   * Toggle del estado colapsado del sidebar
   */
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }

  /**
   * Verifica si el usuario tiene alguno de los roles permitidos
   */
  hasPermission(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.userRole);
  }
}