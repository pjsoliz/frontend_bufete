import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarOpen = true;

  menuItems = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard', roles: ['ADMIN', 'ABOGADO', 'CLIENTE'] },
    { icon: '📁', label: 'Casos', route: '/casos', roles: ['ADMIN', 'ABOGADO', 'CLIENTE'] },
    { icon: '📅', label: 'Citas', route: '/citas', roles: ['ADMIN', 'ABOGADO', 'CLIENTE'] },
    { icon: '📈', label: 'Reportes', route: '/reportes', roles: ['ADMIN', 'ABOGADO'] }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  hasAccess(roles: string[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.rol);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
