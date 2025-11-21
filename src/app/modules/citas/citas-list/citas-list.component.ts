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
  filtroEstado: string = 'todos';
  filtroFecha: string = '';
  filtroUrgencia: string = 'todos';
  filtroBusqueda: string = '';

  // Estadísticas
  stats = {
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    completadas: 0,
    canceladas: 0
  };

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
        console.log('Citas cargadas:', data);
        this.citas = data;
        this.citasFiltradas = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.loading = false;
        alert('Error al cargar las citas. Verifica la conexión con el servidor.');
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.citas.length;
    this.stats.pendientes = this.citas.filter(c => c.estado === 'pendiente').length;
    this.stats.confirmadas = this.citas.filter(c => c.estado === 'confirmada').length;
    this.stats.completadas = this.citas.filter(c => c.estado === 'completada').length;
    this.stats.canceladas = this.citas.filter(c => c.estado === 'cancelada').length;
  }

  aplicarFiltros(): void {
    this.citasFiltradas = this.citas.filter(cita => {
      // Filtro por estado
      const cumpleEstado = this.filtroEstado === 'todos' || cita.estado === this.filtroEstado;
      
      // Filtro por urgencia
      const cumpleUrgencia = this.filtroUrgencia === 'todos' || cita.urgencia === this.filtroUrgencia;

      // Filtro por fecha
      let cumpleFecha = true;
      if (this.filtroFecha) {
        const fechaCita = new Date(cita.fecha).toISOString().split('T')[0];
        cumpleFecha = fechaCita === this.filtroFecha;
      }

      // Filtro por búsqueda con protección contra undefined
      let cumpleBusqueda = true;
      if (this.filtroBusqueda) {
        const busquedaLower = this.filtroBusqueda.toLowerCase().trim();
        
        // Proteger todos los accesos con optional chaining y valor por defecto
        const nombreCliente = cita.cliente?.nombreCompleto?.toLowerCase() || '';
        const nombreAbogado = cita.abogado?.nombreCompleto?.toLowerCase() || '';
        const descripcion = cita.descripcion?.toLowerCase() || '';
        const tipoCita = cita.tipoCita?.nombre?.toLowerCase() || '';
        const areaDerecho = cita.areaDerecho?.nombre?.toLowerCase() || '';
        
        cumpleBusqueda = 
          nombreCliente.includes(busquedaLower) ||
          nombreAbogado.includes(busquedaLower) ||
          descripcion.includes(busquedaLower) ||
          tipoCita.includes(busquedaLower) ||
          areaDerecho.includes(busquedaLower);
      }

      return cumpleEstado && cumpleUrgencia && cumpleFecha && cumpleBusqueda;
    });

    // Ordenar por fecha y hora (más recientes primero)
    this.citasFiltradas.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.hora);
      const fechaB = new Date(b.fecha + 'T' + b.hora);
      return fechaB.getTime() - fechaA.getTime();
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevaCita(): void {
    this.router.navigate(['/citas/nueva']);
  }

  editarCita(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/citas/editar', id]);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/citas', id]);
  }

  // 🆕 MÉTODO CONFIRMAR ACTUALIZADO CON NOTIFICACIONES
  confirmarCita(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Confirmar esta cita?')) {
      // 1. Cambiar estado a confirmada
      this.citasService.confirmarCita(id).subscribe({
        next: () => {
          console.log('✅ Cita confirmada en BD');
          
          // 2. Enviar notificaciones a cliente y abogado
          this.citasService.notificarCambioEstado(
            id,
            'pendiente',
            'Asistente Legal'
          ).subscribe({
            next: () => {
              console.log('✅ Notificaciones enviadas correctamente');
              alert('Cita confirmada y notificaciones enviadas');
            },
            error: (err) => {
              console.error('⚠️ Error al enviar notificaciones:', err);
              alert('Cita confirmada pero hubo error al enviar notificaciones');
            }
          });
          
          // 3. Recargar lista
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al confirmar cita:', error);
          alert('Error al confirmar la cita');
        }
      });
    }
  }

  // 🆕 MÉTODO CANCELAR ACTUALIZADO CON NOTIFICACIONES
  cancelarCita(id: string, event: Event): void {
    event.stopPropagation();
    
    const motivo = prompt('Ingrese el motivo de la cancelación:');
    if (motivo && motivo.trim() !== '') {
      // 1. Cambiar estado a cancelada
      this.citasService.cancelarCita(id).subscribe({
        next: () => {
          console.log('✅ Cita cancelada en BD');
          
          // 2. Enviar notificaciones a cliente y abogado
          this.citasService.notificarCambioEstado(
            id,
            'pendiente', // o 'confirmada' dependiendo del estado anterior
            'Asistente Legal'
          ).subscribe({
            next: () => {
              console.log('✅ Notificaciones de cancelación enviadas');
              alert('Cita cancelada y notificaciones enviadas');
            },
            error: (err) => {
              console.error('⚠️ Error al enviar notificaciones:', err);
              alert('Cita cancelada pero hubo error al enviar notificaciones');
            }
          });
          
          // 3. Recargar lista
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al cancelar cita:', error);
          alert('Error al cancelar la cita');
        }
      });
    }
  }

  completarCita(id: string, event: Event): void {
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

  eliminarCita(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.citasService.deleteCita(id).subscribe({
        next: () => {
          alert('Cita cancelada exitosamente');
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al cancelar cita:', error);
          alert('Error al cancelar la cita');
        }
      });
    }
  }

  // Métodos auxiliares para el template

  getEstadoClass(estado: string): string {
    const classes: any = {
      'pendiente': 'estado-pendiente',
      'confirmada': 'estado-confirmada',
      'completada': 'estado-completada',
      'cancelada': 'estado-cancelada'
    };
    return classes[estado] || '';
  }

  getEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return textos[estado] || estado;
  }

  getUrgenciaClass(urgencia: string): string {
    const classes: any = {
      'alta': 'urgencia-alta',
      'media': 'urgencia-media',
      'baja': 'urgencia-baja'
    };
    return classes[urgencia] || '';
  }

  getUrgenciaTexto(urgencia: string): string {
    const textos: any = {
      'alta': 'Alta',
      'media': 'Media',
      'baja': 'Baja'
    };
    return textos[urgencia] || urgencia;
  }

  getOrigenIcon(origen: string): string {
    const iconos: any = {
      'chatbot': '🤖',
      'panel_web': '💻',
      'presencial': '🏢'
    };
    return iconos[origen] || '📋';
  }

  formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatearHora(hora: string): string {
    // Formato 24h a 12h con AM/PM
    const [hours, minutes] = hora.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  esCitaProxima(fecha: Date, hora: string): boolean {
    const now = new Date();
    const citaDateTime = new Date(fecha + 'T' + hora);
    const diffHours = (citaDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  }
}