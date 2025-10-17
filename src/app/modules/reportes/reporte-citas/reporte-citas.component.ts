import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../core/services/reportes.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-citas',
  templateUrl: './reporte-citas.component.html',
  styleUrls: ['./reporte-citas.component.css']
})
export class ReporteCitasComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  datos: any = null;

  chartEstado: any = null;
  chartMensual: any = null;
  chartAbogados: any = null;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {}

  cargarDatos(): void {
    this.reportesService.getReporteCitas().subscribe({
      next: (data) => {
        console.log('Datos de citas recibidos:', data);
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
    this.crearGraficaEstado();
    this.crearGraficaMensual();
    this.crearGraficaAbogados();
  }

  crearGraficaEstado(): void {
    const canvas = document.getElementById('chartEstadoCitas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartEstado = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Programada', 'Confirmada', 'Completada', 'Cancelada'],
        datasets: [{
          data: [
            this.datos.por_estado.programada,
            this.datos.por_estado.confirmada,
            this.datos.por_estado.completada,
            this.datos.por_estado.cancelada
          ],
          backgroundColor: [
            '#3498db',
            '#f39c12',
            '#2ecc71',
            '#e74c3c'
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
            text: 'Citas por Estado',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  crearGraficaMensual(): void {
    const canvas = document.getElementById('chartMensualCitas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartMensual = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.datos.citas_por_mes.map((item: any) => item.mes),
        datasets: [{
          label: 'Citas',
          data: this.datos.citas_por_mes.map((item: any) => item.cantidad),
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
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
            text: 'Evolución de Citas por Mes',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        }
      }
    });
  }

  crearGraficaAbogados(): void {
    const canvas = document.getElementById('chartAbogados') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartAbogados = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.datos.por_abogado.map((item: any) => item.nombre),
        datasets: [{
          label: 'Citas Atendidas',
          data: this.datos.por_abogado.map((item: any) => item.cantidad),
          backgroundColor: [
            '#3498db',
            '#9b59b6',
            '#e67e22',
            '#1abc9c',
            '#e74c3c'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Citas por Abogado',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chartEstado) this.chartEstado.destroy();
    if (this.chartMensual) this.chartMensual.destroy();
    if (this.chartAbogados) this.chartAbogados.destroy();
  }
}