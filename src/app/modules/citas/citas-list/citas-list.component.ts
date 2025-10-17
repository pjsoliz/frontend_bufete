import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService, Cita } from '../../../core/services/citas.service';

@Component({
  selector: 'app-citas-list',
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.css']
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  loading = true;
  
  // Filtros
  filtroEstado: string = 'todas';
  filtroFecha: string = '';
  filtroBusqueda: string = '';

  constructor(
    private citasService: CitasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading = true;
    this.citasService.getCitas().subscribe({
      next: (data) => {
        this.citas = data;
        this.citasFiltradas = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.citasFiltradas = this.citas.filter(cita => {
      // Filtro por estado
      const cumpleEstado = this.filtroEstado === 'todas' || cita.estado === this.filtroEstado;
      
      // Filtro por fecha
      const cumpleFecha = !this.filtroFecha || cita.fecha === this.filtroFecha;
      
      // Filtro por búsqueda
      const cumpleBusqueda = !this.filtroBusqueda || 
        cita.cliente.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cita.abogado.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cita.tipo.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      
      return cumpleEstado && cumpleFecha && cumpleBusqueda;
    });
  }

  onFiltroEstadoChange(event: any): void {
    this.filtroEstado = event.target.value;
    this.aplicarFiltros();
  }

  onFiltroFechaChange(event: any): void {
    this.filtroFecha = event.target.value;
    this.aplicarFiltros();
  }

  onFiltroBusquedaChange(event: any): void {
    this.filtroBusqueda = event.target.value;
    this.aplicarFiltros();
  }

  nuevaCita(): void {
    this.router.navigate(['/citas/nueva']);
  }

  editarCita(id: number): void {
    this.router.navigate(['/citas/editar', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/citas', id]);
  }

  confirmarCita(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Confirmar esta cita?')) {
      this.citasService.confirmarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al confirmar cita:', error);
          alert('Error al confirmar la cita');
        }
      });
    }
  }

  cancelarCita(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.citasService.cancelarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al cancelar cita:', error);
          alert('Error al cancelar la cita');
        }
      });
    }
  }

  completarCita(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Marcar esta cita como completada?')) {
      this.citasService.completarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al completar cita:', error);
          alert('Error al completar la cita');
        }
      });
    }
  }

  eliminarCita(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar esta cita? Esta acción no se puede deshacer.')) {
      this.citasService.deleteCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al eliminar cita:', error);
          alert('Error al eliminar la cita');
        }
      });
    }
  }

  getEstadoClass(estado: string): string {
    const classes: any = {
      'programada': 'estado-programada',
      'confirmada': 'estado-confirmada',
      'completada': 'estado-completada',
      'cancelada': 'estado-cancelada'
    };
    return classes[estado] || '';
  }

  getEstadoTexto(estado: string): string {
    const textos: any = {
      'programada': 'Programada',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return textos[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}