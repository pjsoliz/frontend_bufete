import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  // Usuario
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  userAvatar: string = '';

  // Estados de dropdowns
  showNotifications = false;
  showUserMenu = false;

  // Búsqueda
  searchQuery: string = '';

  // Notificaciones
  unreadNotifications = 0;
  notifications: Notification[] = [
    {
      id: 1,
      message: 'Nueva cita agendada para el 25 de octubre',
      time: 'Hace 5 minutos',
      type: 'info',
      read: false
    },
    {
      id: 2,
      message: 'El caso #1234 ha sido actualizado',
      time: 'Hace 15 minutos',
      type: 'success',
      read: false
    },
    {
      id: 3,
      message: 'Recordatorio: Audiencia mañana a las 10:00 AM',
      time: 'Hace 1 hora',
      type: 'warning',
      read: false
    },
    {
      id: 4,
      message: 'Documento pendiente de revisión',
      time: 'Hace 2 horas',
      type: 'error',
      read: true
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.calculateUnreadNotifications();
    this.setupClickOutsideListeners();
  }

  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.nombre || 'Usuario';
      this.userEmail = currentUser.email || '';
      this.userRole = currentUser.rol || '';
      this.userAvatar = currentUser.avatar || '';
    }
  }

  /**
   * Calcula el número de notificaciones no leídas
   */
  private calculateUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  /**
   * Obtiene la etiqueta del rol en español
   */
  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'ABOGADO': 'Abogado',
      'ASISTENTE_LEGAL': 'Asistente Legal',
      'CLIENTE': 'Cliente'
    };
    return roles[role] || role;
  }

  /**
   * Toggle del sidebar
   */
  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  /**
   * Toggle de notificaciones
   */
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  /**
   * Toggle del menú de usuario
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  /**
   * Realiza una búsqueda
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/buscar'], {
        queryParams: { q: this.searchQuery }
      });
      this.searchQuery = '';
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  markAllAsRead(): void {
    this.notifications.forEach(notif => notif.read = true);
    this.calculateUnreadNotifications();
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(notification: Notification): void {
    notification.read = true;
    this.calculateUnreadNotifications();
  }

  /**
   * Obtiene el icono apropiado para cada tipo de notificación
   */
  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'check-circle',
      'warning': 'alert-triangle',
      'error': 'x-circle',
      'info': 'info'
    };
    return icons[type] || 'bell';
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Configura listeners para cerrar dropdowns al hacer click fuera
   */
  private setupClickOutsideListeners(): void {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;

      // Cerrar notificaciones si el click es fuera
      if (this.showNotifications && !target.closest('.navbar-item')) {
        this.showNotifications = false;
      }

      // Cerrar menú de usuario si el click es fuera
      if (this.showUserMenu && !target.closest('.user-menu')) {
        this.showUserMenu = false;
      }
    });
  }
}