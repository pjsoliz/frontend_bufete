import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  
  currentUser: any = null;
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioActual();
  }

  /**
   * Carga el usuario actual desde AuthService
   */
  private cargarUsuarioActual(): void {
    this.currentUser = this.authService.getUser();
    this.userRole = this.authService.getUserRole() || '';
    
    console.log('Usuario actual:', this.currentUser);
    console.log('Rol:', this.userRole);
  }

  /**
   * Toggle del estado colapsado del sidebar
   */
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }

  /**
   * Obtiene el icono según el rol del usuario
   */
  getUserIcon(): string {
    const icons: { [key: string]: string } = {
      'admin': 'shield',
      'asistente_legal': 'clipboard-list'
    };
    return icons[this.userRole] || 'user';
  }

  /**
   * Obtiene el texto del rol
   */
  getRolTexto(): string {
    const textos: { [key: string]: string } = {
      'admin': 'Administrador',
      'asistente_legal': 'Asistente Legal'
    };
    return textos[this.userRole] || 'Usuario';
  }

  /**
   * Cerrar sesión
   */
  cerrarSesion(): void {
    if (confirm('¿Está seguro de cerrar sesión?')) {
      this.authService.logout();
    }
  }

  /**
   * Verifica si el usuario tiene alguno de los roles permitidos
   */
  hasPermission(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.userRole);
  }
}