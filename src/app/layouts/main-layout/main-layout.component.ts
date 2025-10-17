import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  usuario: any = null;
  menuItems: any[] = [];
  isSidebarCollapsed = false;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    console.log('Usuario cargado en MainLayout:', this.usuario);
    this.cargarMenu();
  }

  cargarMenu(): void {
  const rol = this.authService.getUserRole();
  console.log('Cargando menú para rol:', rol);

  // Si no hay rol, no cargar menú
  if (!rol) {
    this.menuItems = [];
    return;
  }

  this.menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      action: () => this.navigateToDashboard(),
      roles: ['administrador', 'abogado', 'asistente_legal']
    },
    {
      label: 'Clientes',
      icon: '👥',
      route: '/clientes',
      roles: ['administrador', 'abogado', 'asistente_legal']
    },
    {
      label: 'Casos',
      icon: '📁',
      route: '/casos',
      roles: ['administrador', 'abogado', 'asistente_legal']
    },
    {
      label: 'Citas',
      icon: '📅',
      route: '/citas',
      roles: ['administrador', 'abogado', 'asistente_legal']
    },
    {
      label: 'Reportes',
      icon: '📈',
      route: '/reportes',
      roles: ['administrador', 'abogado', 'asistente_legal']
    },
    {
      label: 'Usuarios',
      icon: '👤',
      route: '/usuarios',
      roles: ['administrador']
    }
  ].filter(item => item.roles.includes(rol));
}

  navigateToDashboard(): void {
    const userRole = this.authService.getUserRole();
    console.log('navigateToDashboard - Rol del usuario:', userRole);

    switch(userRole) {
      case 'administrador':
        console.log('Navegando a /dashboard/admin');
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'abogado':
        console.log('Navegando a /dashboard/abogado');
        this.router.navigate(['/dashboard/abogado']);
        break;
      case 'asistente_legal':
        console.log('Navegando a /dashboard/asistente');
        this.router.navigate(['/dashboard/asistente']);
        break;
      default:
        console.log('Rol no reconocido, navegando a /dashboard/admin');
        this.router.navigate(['/dashboard/admin']);
    }
  }

  navigate(item: any): void {
    console.log('navigate() - Item clickeado:', item);

    if (item.action) {
      console.log('Ejecutando action');
      item.action();
    } else if (item.route) {
      console.log('Navegando a ruta:', item.route);
      this.router.navigate([item.route]);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
