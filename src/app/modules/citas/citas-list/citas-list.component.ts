import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService, Cita } from '../../../core/services/citas.service';
import { SwalService } from '../../../core/services/swal.service';

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
    private router: Router,
    private swal: SwalService
  ) { }

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
        this.swal.error('Error de carga', 'Verifica la conexión con el servidor.');
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
        // Convertimos el objeto Date a string (YYYY-MM-DD) para comparar con el input
        const fechaCitaStr = typeof cita.fecha === 'string'
          ? cita.fecha
          : new Date(cita.fecha).toISOString().split('T')[0];

        cumpleFecha = fechaCitaStr === this.filtroFecha;
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
    this.swal.confirm(
      '¿Confirmar cita?',
      'Se enviarán notificaciones al cliente y al abogado.',
      'Sí, confirmar'
    ).then((confirmado) => {
      if (confirmado) {
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
                this.swal.success('Cita confirmada', 'Notificaciones enviadas correctamente');
              },
              error: (err) => {
                console.error('⚠️ Error al enviar notificaciones:', err);
                this.swal.warning('Cita confirmada', 'Hubo un error al enviar las notificaciones');
              }
            });

            // 3. Recargar lista
            this.cargarCitas();
          },
          error: (error) => {
            console.error('Error al confirmar cita:', error);
            this.swal.error('Error', 'No se pudo confirmar la cita');
          }
        });
      }
    });
  }

  // 🆕 MÉTODO CANCELAR ACTUALIZADO CON NOTIFICACIONES Y MOTIVO
  async cancelarCita(id: string, event: Event): Promise<void> {
    event.stopPropagation();

    // 1. Pedir motivo de cancelación con Swal
    const { value: motivo } = await import('sweetalert2').then(swal => swal.default.fire({
      title: 'Cancelar cita',
      input: 'text',
      inputLabel: 'Motivo de la cancelación',
      inputPlaceholder: 'Ingrese el motivo...',
      showCancelButton: true,
      confirmButtonText: 'Cancelar cita',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d32f2f',
      background: '#1a1a2e',
      color: '#e8c97e',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Debe proporcionar un motivo para cancelar la cita';
        }
        return null;
      }
    }));

    if (motivo) {
      // 2. Obtener estado anterior de la cita antes de cancelar
      const citaActual = this.citas.find(c => c.id === id);
      const estadoAnterior = citaActual?.estado || 'pendiente';

      // 3. Cancelar cita CON motivo
      this.citasService.cancelarCita(id, motivo.trim()).subscribe({
        next: () => {
          console.log('✅ Cita cancelada en BD con motivo:', motivo);

          // 4. Enviar notificaciones a cliente y abogado
          this.citasService.notificarCambioEstado(
            id,
            estadoAnterior,
            'Asistente Legal'
          ).subscribe({
            next: (response) => {
              console.log('✅ Notificaciones de cancelación enviadas:', response);
              this.swal.success('Cita cancelada', 'Notificaciones enviadas correctamente');

              // 5. Recargar lista
              this.cargarCitas();
            },
            error: (err) => {
              console.error('⚠️ Error al enviar notificaciones:', err);
              this.swal.warning('Cita cancelada', 'Hubo un error al enviar las notificaciones');

              // Recargar de todas formas
              this.cargarCitas();
            }
          });
        },
        error: (error) => {
          console.error('❌ Error al cancelar cita:', error);
          this.swal.error('Error al cancelar', error.error?.message || error.message);
        }
      });
    }
  }

  completarCita(id: string, event: Event): void {
    event.stopPropagation();
    this.swal.confirm(
      '¿Marcar como completada?',
      'La cita se marcará como finalizada.'
    ).then((confirmado) => {
      if (confirmado) {
        this.citasService.completarCita(id).subscribe({
          next: () => {
            this.swal.toast('Cita completada');
            this.cargarCitas();
          },
          error: (error) => {
            console.error('Error al completar cita:', error);
            this.swal.error('Error', 'No se pudo completar la cita');
          }
        });
      }
    });
  }

  eliminarCita(id: string, event: Event): void {
    event.stopPropagation();
    this.swal.confirmDelete(
      '¿Eliminar cita?',
      'Esta acción no se puede deshacer.'
    ).then((confirmado) => {
      if (confirmado) {
        this.citasService.deleteCita(id).subscribe({
          next: () => {
            this.swal.toast('Cita eliminada exitosamente');
            this.cargarCitas();
          },
          error: (error) => {
            console.error('Error al eliminar cita:', error);
            this.swal.error('Error', 'No se pudo eliminar la cita');
          }
        });
      }
    });
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

  formatearFecha(fecha: Date | string): string {
    // ✅ Si es string, convertir correctamente sin zona horaria
    let fechaObj: Date;

    if (typeof fecha === 'string') {
      // Separar la fecha en partes
      const [year, month, day] = fecha.split('-').map(Number);
      // Crear Date con valores locales (sin conversión UTC)
      fechaObj = new Date(year, month - 1, day);
    } else {
      fechaObj = new Date(fecha);
    }

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

  private getHoyBolivia(): string {
    const ahoraUTC = new Date();
    const ahoraBolivia = new Date(ahoraUTC.getTime() - 4 * 60 * 60 * 1000);
    return ahoraBolivia.toISOString().split('T')[0];
  }

  // Cambiamos el tipo a 'any' para evitar el error TS2345
  esCitaDeHoy(fecha: any): boolean {
    // Si fecha es un objeto Date, lo convertimos a string YYYY-MM-DD
    const fechaStr = typeof fecha === 'string' ? fecha : new Date(fecha).toISOString().split('T')[0];
    return fechaStr === this.getHoyBolivia();
  }

  esCitaProxima(fecha: any, hora: string): boolean {
    // Aseguramos que fecha sea string para el split
    const fechaStr = typeof fecha === 'string' ? fecha : new Date(fecha).toISOString().split('T')[0];

    const [y, m, d] = fechaStr.split('-').map(Number);
    const [h, min] = hora.split(':').map(Number);
    const citaDateTime = new Date(y, m - 1, d, h, min, 0, 0);

    const ahoraUTC = new Date();
    const ahoraBolivia = new Date(ahoraUTC.getTime() - 4 * 60 * 60 * 1000);

    const diffHours = (citaDateTime.getTime() - ahoraBolivia.getTime()) / (1000 * 60 * 60);
    // Es próxima si es en las siguientes 24 horas y no ha pasado
    return diffHours > 0 && diffHours <= 24;
  }
}