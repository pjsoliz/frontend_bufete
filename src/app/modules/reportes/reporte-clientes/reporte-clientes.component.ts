import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../core/services/reportes.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-clientes',
  templateUrl: './reporte-clientes.component.html',
  styleUrls: ['./reporte-clientes.component.css']
})
export class ReporteClientesComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  datos: any = null;

  chartCrecimiento: any = null;
  chartTipoCaso: any = null;
  chartEstado: any = null;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {}

  cargarDatos(): void {
    this.reportesService.getReporteClientes().subscribe({
      next: (data) => {
        console.log('Datos de clientes recibidos:', data);
        this.datos = data;
        this.loading = false;
        
        setTimeout(() => {
          this.crearGraficas();
        }, 100);
      },
      error: (error) => {
        console.error('Error al cargar reporte:', error);
        this.loading = false;
      }
    });
  }

  crearGraficas(): void {
    this.crearGraficaCrecimiento();
    this.crearGraficaTipoCaso();
    this.crearGraficaEstado();
  }

  crearGraficaCrecimiento(): void {
    const canvas = document.getElementById('chartCrecimiento') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartCrecimiento = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.datos.clientes_por_mes.map((item: any) => item.mes),
        datasets: [{
          label: 'Clientes Nuevos',
          data: this.datos.clientes_por_mes.map((item: any) => item.cantidad),
          backgroundColor: '#9b59b6',
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Crecimiento de Clientes por Mes',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 2 }
          }
        }
      }
    });
  }

  crearGraficaTipoCaso(): void {
    const canvas = document.getElementById('chartTipoCaso') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartTipoCaso = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Laboral', 'Civil', 'Penal', 'Familia', 'Comercial'],
        datasets: [{
          data: [
            this.datos.por_tipo_caso.laboral,
            this.datos.por_tipo_caso.civil,
            this.datos.por_tipo_caso.penal,
            this.datos.por_tipo_caso.familia,
            this.datos.por_tipo_caso.comercial
          ],
          backgroundColor: [
            '#3498db',
            '#9b59b6',
            '#e74c3c',
            '#1abc9c',
            '#f39c12'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          title: {
            display: true,
            text: 'Clientes por Tipo de Caso',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  crearGraficaEstado(): void {
    const canvas = document.getElementById('chartEstadoClientes') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartEstado = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
          data: [this.datos.activos, this.datos.inactivos],
          backgroundColor: ['#2ecc71', '#95a5a6'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          title: {
            display: true,
            text: 'Estado de Clientes',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chartCrecimiento) this.chartCrecimiento.destroy();
    if (this.chartTipoCaso) this.chartTipoCaso.destroy();
    if (this.chartEstado) this.chartEstado.destroy();
  }
}