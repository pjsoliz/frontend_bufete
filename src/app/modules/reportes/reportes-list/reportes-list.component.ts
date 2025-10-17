import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes-list',
  templateUrl: './reportes-list.component.html',
  styleUrls: ['./reportes-list.component.css']
})
export class ReportesListComponent implements OnInit {

  reportes = [
    {
      id: 'casos',
      titulo: 'Reporte de Casos',
      descripcion: 'Estadísticas y análisis de casos por estado, tipo y prioridad',
      icon: '📁',
      color: 'blue',
      ruta: '/reportes/casos'
    },
    {
      id: 'citas',
      titulo: 'Reporte de Citas',
      descripcion: 'Análisis de citas programadas, completadas y canceladas',
      icon: '📅',
      color: 'green',
      ruta: '/reportes/citas'
    },
    {
      id: 'clientes',
      titulo: 'Reporte de Clientes',
      descripcion: 'Estadísticas de clientes activos, nuevos y por tipo de caso',
      icon: '👥',
      color: 'purple',
      ruta: '/reportes/clientes'
    },
    {
      id: 'general',
      titulo: 'Reporte General',
      descripcion: 'Vista general del sistema con métricas clave',
      icon: '📊',
      color: 'orange',
      ruta: '/reportes/general'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Reportes List cargado');
  }

  navegarReporte(ruta: string): void {
  console.log('Navegando a:', ruta);
  this.router.navigate([ruta]);
}
}
