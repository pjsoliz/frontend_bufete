import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../core/services/reportes.service';

// Registrar los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-reporte-casos',
  templateUrl: './reporte-casos.component.html',
  styleUrls: ['./reporte-casos.component.css']
})
export class ReporteCasosComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  datos: any = null;

  // Referencias a las gráficas
  chartEstado: any = null;
  chartTipo: any = null;
  chartPrioridad: any = null;
  chartMensual: any = null;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    // Las gráficas se crearán después de cargar los datos
  }

  cargarDatos(): void {
    this.reportesService.getReporteCasos().subscribe({
      next: (data) => {
        console.log('Datos de casos recibidos:', data);
        this.datos = data;
        this.loading = false;

        // Crear gráficas después de cargar datos
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
    this.crearGraficaTipo();
    this.crearGraficaPrioridad();
    this.crearGraficaMensual();
  }

  crearGraficaEstado(): void {
    const canvas = document.getElementById('chartEstado') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas chartEstado no encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener contexto 2D');
      return;
    }

    this.chartEstado = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendiente', 'En Progreso', 'Suspendido', 'Cerrado'],
        datasets: [{
          data: [
            this.datos.por_estado.pendiente,
            this.datos.por_estado.en_progreso,
            this.datos.por_estado.suspendido,
            this.datos.por_estado.cerrado
          ],
          backgroundColor: [
            '#f39c12',
            '#3498db',
            '#95a5a6',
            '#2ecc71'
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
            text: 'Casos por Estado',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  crearGraficaTipo(): void {
    const canvas = document.getElementById('chartTipo') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas chartTipo no encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartTipo = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Laboral', 'Civil', 'Penal', 'Familia', 'Comercial'],
        datasets: [{
          label: 'Cantidad de Casos',
          data: [
            this.datos.por_tipo.laboral,
            this.datos.por_tipo.civil,
            this.datos.por_tipo.penal,
            this.datos.por_tipo.familia,
            this.datos.por_tipo.comercial
          ],
          backgroundColor: [
            '#3498db',
            '#9b59b6',
            '#e74c3c',
            '#1abc9c',
            '#f39c12'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Casos por Tipo',
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

  crearGraficaPrioridad(): void {
    const canvas = document.getElementById('chartPrioridad') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas chartPrioridad no encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartPrioridad = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Baja', 'Media', 'Alta'],
        datasets: [{
          data: [
            this.datos.por_prioridad.baja,
            this.datos.por_prioridad.media,
            this.datos.por_prioridad.alta
          ],
          backgroundColor: [
            '#2ecc71',
            '#f39c12',
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
            text: 'Casos por Prioridad',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  crearGraficaMensual(): void {
    const canvas = document.getElementById('chartMensual') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas chartMensual no encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartMensual = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.datos.casos_por_mes.map((item: any) => item.mes),
        datasets: [{
          label: 'Casos Nuevos',
          data: this.datos.casos_por_mes.map((item: any) => item.cantidad),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#3498db',
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
            text: 'Evolución de Casos por Mes',
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

  ngOnDestroy(): void {
    // Limpiar gráficas al destruir componente
    if (this.chartEstado) this.chartEstado.destroy();
    if (this.chartTipo) this.chartTipo.destroy();
    if (this.chartPrioridad) this.chartPrioridad.destroy();
    if (this.chartMensual) this.chartMensual.destroy();
  }
}
