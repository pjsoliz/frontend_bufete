import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';

@Component({
  selector: 'app-abogado-dashboard',
  templateUrl: './abogado-dashboard.component.html',
  styleUrls: ['./abogado-dashboard.component.css']
})
export class AbogadoDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  misCasos: any[] = [];
  misCitas: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Datos mock mientras no haya backend
    setTimeout(() => {
      this.stats = {
        mis_casos: 15,
        mis_citas_hoy: 3,
        citas_pendientes: 7,
        mis_clientes: 24
      };
      this.loading = false;
    }, 1000);
  }
}
