import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../core/services/reportes.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.css']
})
export class ReporteGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  datos: any = null;

  chartFinanciero: any = null;
  chartResultados: any = null;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {}

  cargarDatos(): void {
    this.reportesService.getReporteGeneral().subscribe({
      next: (data) => {
        console.log('Datos generales recibidos:', data);
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
    this.crearGraficaFinanciera();
    this.crearGraficaResultados();
  }

  crearGraficaFinanciera(): void {
    const canvas = document.getElementById('chartFinanciero') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartFinanciero = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ingresos', 'Gastos', 'Utilidad'],
        datasets: [{
          label: 'Monto ($)',
          data: [
            this.datos.ingresos_mes,
            this.datos.gastos_mes,
            this.datos.utilidad_mes
          ],
          backgroundColor: [
            '#2ecc71',
            '#e74c3c',
            '#3498db'
          ],
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Resumen Financiero del Mes',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  crearGraficaResultados(): void {
    const canvas = document.getElementById('chartResultados') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chartResultados = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Casos Ganados', 'Casos Perdidos'],
        datasets: [{
          data: [
            this.datos.casos_ganados,
            this.datos.casos_perdidos
          ],
          backgroundColor: [
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
            text: 'Resultados de Casos',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chartFinanciero) this.chartFinanciero.destroy();
    if (this.chartResultados) this.chartResultados.destroy();
  }
}