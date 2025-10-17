import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Aquí llamarías al endpoint de estadísticas cuando esté disponible
    // this.apiService.get('/dashboard/stats').subscribe({
    //   next: (data) => {
    //     this.stats = data;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error:', error);
    //     this.loading = false;
    //   }
    // });

    // Por ahora, datos mock:
    setTimeout(() => {
      this.stats = {
        total_usuarios: 45,
        total_casos: 128,
        citas_hoy: 8,
        total_abogados: 12
      };
      this.loading = false;
    }, 1000);
  }
}
