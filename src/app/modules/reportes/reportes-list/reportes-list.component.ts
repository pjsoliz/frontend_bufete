import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../core/services/reportes.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes-list',
  templateUrl: './reportes-list.component.html',
  styleUrls: ['./reportes-list.component.css']
})
export class ReportesListComponent implements OnInit, OnDestroy {
  loading = true;

  // Filtros
  mesSeleccionado: number;
  anioSeleccionado: number;
  nombreMes: string = '';

  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];

  anios: number[] = [];

  // Datos del backend
  estadisticas: any = null;
  casosSolicitados: any[] = [];
  abogadosSolicitados: any[] = [];
  areasDerecho: any[] = [];

  // Charts
  chartEstado: any = null;
  chartOrigen: any = null;
  chartUrgencia: any = null;
  chartTiposCaso: any = null;
  chartAreasDerecho: any = null;
  chartAbogados: any = null;

  constructor(private reportesService: ReportesService) {
    // Inicializar fecha actual
    const hoy = new Date();
    this.mesSeleccionado = hoy.getMonth() + 1;
    this.anioSeleccionado = hoy.getFullYear();
    this.actualizarNombreMes();

    // Generar últimos 5 años
    for (let i = 0; i < 5; i++) {
      this.anios.push(this.anioSeleccionado - i);
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  actualizarNombreMes(): void {
    const mes = this.meses.find(m => m.valor === this.mesSeleccionado);
    this.nombreMes = mes ? mes.nombre : '';
  }

  cargarDatos(): void {
    this.loading = true;
    this.actualizarNombreMes();
    this.destruirGraficas();

    // Cargar todos los datos en paralelo
    forkJoin({
      estadisticas: this.reportesService.getEstadisticasMes(this.mesSeleccionado, this.anioSeleccionado),
      casos: this.reportesService.getCasosMasSolicitados(this.mesSeleccionado, this.anioSeleccionado),
      abogados: this.reportesService.getAbogadosMasSolicitados(this.mesSeleccionado, this.anioSeleccionado),
      areas: this.reportesService.getAreasMasSolicitadas(this.mesSeleccionado, this.anioSeleccionado)
    }).subscribe({
      next: (data) => {
        console.log('Datos cargados:', data);

        this.estadisticas = data.estadisticas;
        this.casosSolicitados = data.casos;
        this.abogadosSolicitados = data.abogados;
        this.areasDerecho = data.areas;

        this.loading = false;

        // Crear gráficas después de que el DOM se actualice
        setTimeout(() => {
          this.crearGraficas();
        }, 100);
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.loading = false;
      }
    });
  }

  crearGraficas(): void {
    if (this.estadisticas?.totalCitas > 0) {
      this.crearGraficaEstado();
      this.crearGraficaOrigen();
      this.crearGraficaUrgencia();
    }

    if (this.casosSolicitados.length > 0) {
      this.crearGraficaTiposCaso();
    }

    if (this.areasDerecho.length > 0) {
      this.crearGraficaAreasDerecho();
    }

    if (this.abogadosSolicitados.length > 0) {
      this.crearGraficaAbogados();
    }
  }

  crearGraficaEstado(): void {
    const canvas = document.getElementById('chartEstadoCitas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const estados = this.estadisticas.citasPorEstado;
    const labels = estados.map((e: any) => this.capitalizar(e.estado));
    const valores = estados.map((e: any) => parseInt(e.total));

    // COLORES SEMÁNTICOS PARA ESTADOS
    const coloresEstado: any = {
      'Programada': '#007BFF',  // Azul - En proceso
      'Confirmada': '#ffc107',  // Amarillo - Pendiente de completar
      'Completada': '#28a745',  // Verde - Éxito
      'Cancelada': '#dc3545'    // Rojo - Problema
    };

    const colores = labels.map((label: string) => coloresEstado[label] || '#6c757d');

    this.chartEstado = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: colores,
          borderWidth: 3,
          borderColor: '#FFFFFF'
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
              font: { size: 12, weight: '500' },
              color: '#212529',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 },
            callbacks: {
              label: (context) => {
                const value = context.parsed || 0;
                const total = valores.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  crearGraficaOrigen(): void {
    const canvas = document.getElementById('chartOrigenCitas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const origenes = this.estadisticas.citasPorOrigen;
    const labels = origenes.map((o: any) => this.capitalizar(o.origen));
    const valores = origenes.map((o: any) => parseInt(o.total));

    // 🎨 COLORES VIVOS PARA CADA ORIGEN
    const colores = [
      '#007BFF',  // Azul vibrante
      '#17a2b8',  // Cian
      '#28a745',  // Verde
      '#ffc107',  // Amarillo
      '#9b59b6',  // Morado
      '#e67e22',  // Naranja
      '#1abc9c',  // Turquesa
      '#e74c3c'   // Rojo coral
    ];

    this.chartOrigen = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Citas',
          data: valores,
          backgroundColor: colores.slice(0, valores.length),
          borderRadius: 8,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: '#212529',
              font: { size: 11 }
            },
            grid: { color: '#dee2e6' }
          },
          x: {
            ticks: {
              color: '#212529',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  crearGraficaUrgencia(): void {
    const canvas = document.getElementById('chartUrgenciaCitas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const urgencias = this.estadisticas.citasPorUrgencia;
    const labels = urgencias.map((u: any) => this.capitalizar(u.urgencia));
    const valores = urgencias.map((u: any) => parseInt(u.total));

    // COLORES SEMÁNTICOS PARA URGENCIA
    const colores = labels.map((label: string) => {
      const labelLower = label.toLowerCase();
      if (labelLower.includes('alta') || labelLower.includes('urgent')) return '#dc3545';  // Rojo
      if (labelLower.includes('media') || labelLower.includes('normal')) return '#ffc107'; // Amarillo
      return '#28a745';  // Verde - Baja
    });

    this.chartUrgencia = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: colores,
          borderWidth: 3,
          borderColor: '#FFFFFF'
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
              font: { size: 12, weight: '500' },
              color: '#212529',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 },
            callbacks: {
              label: (context) => {
                const value = context.parsed || 0;
                const total = valores.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  crearGraficaTiposCaso(): void {
    const canvas = document.getElementById('chartTiposCaso') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.casosSolicitados.map(c => c.tipoCaso || 'Sin especificar');
    const valores = this.casosSolicitados.map(c => parseInt(c.total));

    // 🎨 COLORES VIVOS Y DIVERSOS
    const colores = [
      '#007BFF',  // Azul vibrante
      '#17a2b8',  // Cian
      '#28a745',  // Verde
      '#ffc107',  // Amarillo
      '#9b59b6',  // Morado
      '#e67e22',  // Naranja
      '#1abc9c',  // Turquesa
      '#e74c3c',  // Coral
      '#6610f2',  // Índigo
      '#fd7e14'   // Naranja oscuro
    ];

    this.chartTiposCaso = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad',
          data: valores,
          backgroundColor: colores.slice(0, valores.length),
          borderRadius: 8,
          barThickness: 35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: '#212529',
              font: { size: 11 }
            },
            grid: { color: '#dee2e6' }
          },
          y: {
            ticks: {
              color: '#212529',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  crearGraficaAreasDerecho(): void {
    const canvas = document.getElementById('chartAreasDerecho') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.areasDerecho.map(a => a.areaDerecho || 'Sin especificar');
    const valores = this.areasDerecho.map(a => parseInt(a.total));

    // 🎨 COLORES VIVOS Y DIVERSOS
    const colores = [
      '#007BFF',  // Azul vibrante
      '#17a2b8',  // Cian
      '#28a745',  // Verde
      '#ffc107',  // Amarillo
      '#9b59b6',  // Morado
      '#e67e22',  // Naranja
      '#1abc9c',  // Turquesa
      '#e74c3c',  // Coral
      '#6610f2',  // Índigo
      '#fd7e14'   // Naranja oscuro
    ];

    this.chartAreasDerecho = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad',
          data: valores,
          backgroundColor: colores.slice(0, valores.length),
          borderRadius: 10,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: '#212529',
              font: { size: 11 }
            },
            grid: { color: '#dee2e6' }
          },
          x: {
            ticks: {
              color: '#212529',
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 45
            },
            grid: { display: false }
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

    const labels = this.abogadosSolicitados.map(a => a.abogado || 'Sin asignar');
    const valores = this.abogadosSolicitados.map(a => parseInt(a.total));

    // 🎨 COLORES VIVOS Y DIVERSOS
    const colores = [
      '#007BFF',  // Azul vibrante
      '#17a2b8',  // Cian
      '#28a745',  // Verde
      '#ffc107',  // Amarillo
      '#9b59b6',  // Morado
      '#e67e22',  // Naranja
      '#1abc9c',  // Turquesa
      '#e74c3c',  // Coral
      '#6610f2',  // Índigo
      '#fd7e14'   // Naranja oscuro
    ];

    this.chartAbogados = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Citas Atendidas',
          data: valores,
          backgroundColor: colores.slice(0, valores.length),
          borderRadius: 8,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#003366',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#C7B47C',
            borderWidth: 2,
            padding: 12,
            bodyFont: { size: 14 }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: '#212529',
              font: { size: 11 }
            },
            grid: { color: '#dee2e6' }
          },
          y: {
            ticks: {
              color: '#212529',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  getClaseEstado(estado: string): string {
    const estadoLower = estado?.toLowerCase() || '';
    
    if (estadoLower.includes('programada')) return 'bar-programada';
    if (estadoLower.includes('confirmada')) return 'bar-confirmada';
    if (estadoLower.includes('completada')) return 'bar-completada';
    if (estadoLower.includes('cancelada')) return 'bar-cancelada';
    
    return 'bar-info';
  }

  capitalizar(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  destruirGraficas(): void {
    if (this.chartEstado) this.chartEstado.destroy();
    if (this.chartOrigen) this.chartOrigen.destroy();
    if (this.chartUrgencia) this.chartUrgencia.destroy();
    if (this.chartTiposCaso) this.chartTiposCaso.destroy();
    if (this.chartAreasDerecho) this.chartAreasDerecho.destroy();
    if (this.chartAbogados) this.chartAbogados.destroy();
  }

  ngOnDestroy(): void {
    this.destruirGraficas();
  }
}