import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';

@Component({
  selector: 'app-asistente-dashboard',
  templateUrl: './asistente-dashboard.component.html',
  styleUrls: ['./asistente-dashboard.component.css']
})
export class AsistenteDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Datos mock
    setTimeout(() => {
      this.stats = {
        total_casos: 128,
        citas_hoy: 8,
        total_clientes: 95
      };
      this.loading = false;
    }, 1000);
  }
}
