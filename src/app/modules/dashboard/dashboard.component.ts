import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CasoService } from '../../core/services/caso.service';
import { CitaService } from '../../core/services/cita.service';
import { User, Caso, Cita } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;

  // Estadísticas
  stats = {
    totalCasos: 0,
    casosActivos: 0,
    citasPendientes: 0,
    citasHoy: 0
  };

  // Datos para mostrar
  casosPendientes: Caso[] = [];
  proximasCitas: Cita[] = [];

  constructor(
    private authService: AuthService,
    private casoService: CasoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Cargar casos
    this.casoService.getCasos().subscribe({
      next: (casos) => {
        this.stats.totalCasos = casos.length;
        this.stats.casosActivos = casos.filter(c => c.estado === 'EN_PROCESO').length;
        this.casosPendientes = casos.filter(c => c.estado === 'ABIERTO').slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // Cargar citas
    this.citaService.getCitasProximas().subscribe({
      next: (citas) => {
        this.stats.citasPendientes = citas.length;
        this.proximasCitas = citas.slice(0, 5);
        
        // Citas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        this.stats.citasHoy = citas.filter(c => 
          c.fecha_hora.startsWith(hoy)
        ).length;
      }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: any = {
      'ABIERTO': 'badge-info',
      'EN_PROCESO': 'badge-warning',
      'CERRADO': 'badge-success',
      'PENDIENTE': 'badge-warning',
      'CONFIRMADA': 'badge-success'
    };
    return classes[estado] || 'badge-default';
  }

  getPrioridadBadgeClass(prioridad: string): string {
    const classes: any = {
      'BAJA': 'badge-success',
      'MEDIA': 'badge-info',
      'ALTA': 'badge-warning',
      'URGENTE': 'badge-danger'
    };
    return classes[prioridad] || 'badge-default';
  }
}