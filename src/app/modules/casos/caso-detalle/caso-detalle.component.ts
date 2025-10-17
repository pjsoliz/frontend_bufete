import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService, Caso, Actividad } from '../../../core/services/casos.service';

@Component({
  selector: 'app-caso-detalle',
  templateUrl: './caso-detalle.component.html',
  styleUrls: ['./caso-detalle.component.css']
})
export class CasoDetalleComponent implements OnInit {
  caso: Caso | null = null;
  loading = true;
  errorMessage = '';

  // Para el modal de cambio de estado
  mostrarModalEstado = false;
  nuevoEstado: Caso['estado'] = 'pendiente';

  // Para el modal de asignar abogado
  mostrarModalAbogado = false;
  abogadoSeleccionado = '';

  abogadosDisponibles = [
    'Dr. Carlos Méndez',
    'Dra. Ana Torres',
    'Dr. Luis Ramírez',
    'Dra. María González',
    'Dr. Pedro Sánchez'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casosService: CasosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCaso(parseInt(id));
    }
  }

  cargarCaso(id: number): void {
    this.loading = true;
    this.casosService.getCasoById(id).subscribe({
      next: (caso) => {
        if (caso) {
          this.caso = caso;
        } else {
          this.errorMessage = 'Caso no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar caso:', error);
        this.errorMessage = 'Error al cargar el caso';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/casos']);
  }

  editarCaso(): void {
    if (this.caso) {
      this.router.navigate(['/casos/editar', this.caso.id]);
    }
  }

  eliminarCaso(): void {
    if (this.caso && confirm('¿Está seguro de eliminar este caso? Esta acción no se puede deshacer.')) {
      this.casosService.deleteCaso(this.caso.id).subscribe({
        next: () => {
          alert('Caso eliminado exitosamente');
          this.router.navigate(['/casos']);
        },
        error: (error) => {
          console.error('Error al eliminar caso:', error);
          alert('Error al eliminar el caso');
        }
      });
    }
  }

  // Cambiar Estado
  abrirModalEstado(): void {
    if (this.caso) {
      this.nuevoEstado = this.caso.estado;
      this.mostrarModalEstado = true;
    }
  }

  cerrarModalEstado(): void {
    this.mostrarModalEstado = false;
  }

  cambiarEstado(): void {
    if (this.caso) {
      this.casosService.cambiarEstado(this.caso.id, this.nuevoEstado).subscribe({
        next: (casoActualizado) => {
          this.caso = casoActualizado;
          this.cerrarModalEstado();

          // Agregar actividad
          this.casosService.agregarActividad(this.caso.id, {
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'cambio_estado',
            descripcion: `Estado cambiado a: ${this.getEstadoTexto(this.nuevoEstado)}`,
            usuario: 'Usuario Actual'
          }).subscribe({
            next: (casoConActividad) => {
              this.caso = casoConActividad;
            }
          });
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          alert('Error al cambiar el estado');
        }
      });
    }
  }

  // Asignar Abogado
  abrirModalAbogado(): void {
    if (this.caso) {
      this.abogadoSeleccionado = this.caso.abogado || '';
      this.mostrarModalAbogado = true;
    }
  }

  cerrarModalAbogado(): void {
    this.mostrarModalAbogado = false;
  }

  asignarAbogado(): void {
    if (this.caso && this.abogadoSeleccionado) {
      this.casosService.asignarAbogado(this.caso.id, this.abogadoSeleccionado).subscribe({
        next: (casoActualizado) => {
          this.caso = casoActualizado;
          this.cerrarModalAbogado();

          // Agregar actividad
          this.casosService.agregarActividad(this.caso.id, {
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'asignacion',
            descripcion: `Caso asignado a: ${this.abogadoSeleccionado}`,
            usuario: 'Usuario Actual'
          }).subscribe({
            next: (casoConActividad) => {
              this.caso = casoConActividad;
            }
          });
        },
        error: (error) => {
          console.error('Error al asignar abogado:', error);
          alert('Error al asignar el abogado');
        }
      });
    }
  }

  // Helper methods
  getTipoClass(tipo: string): string {
    const classes: any = {
      'laboral': 'tipo-laboral',
      'civil': 'tipo-civil',
      'penal': 'tipo-penal',
      'familia': 'tipo-familia',
      'comercial': 'tipo-comercial',
      'otro': 'tipo-otro'
    };
    return classes[tipo] || '';
  }

  getTipoTexto(tipo: string): string {
    const textos: any = {
      'laboral': 'Laboral',
      'civil': 'Civil',
      'penal': 'Penal',
      'familia': 'Familia',
      'comercial': 'Comercial',
      'otro': 'Otro'
    };
    return textos[tipo] || tipo;
  }

  getEstadoClass(estado: string): string {
    const classes: any = {
      'pendiente': 'estado-pendiente',
      'en_progreso': 'estado-progreso',
      'suspendido': 'estado-suspendido',
      'cerrado': 'estado-cerrado'
    };
    return classes[estado] || '';
  }

  getEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'suspendido': 'Suspendido',
      'cerrado': 'Cerrado'
    };
    return textos[estado] || estado;
  }

  getPrioridadClass(prioridad: string): string {
    const classes: any = {
      'baja': 'prioridad-baja',
      'media': 'prioridad-media',
      'alta': 'prioridad-alta'
    };
    return classes[prioridad] || '';
  }

  getPrioridadTexto(prioridad: string): string {
    const textos: any = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta'
    };
    return textos[prioridad] || prioridad;
  }

  getActividadIcon(tipo: string): string {
    const icons: any = {
      'audiencia': '⚖️',
      'documento': '📄',
      'nota': '📝',
      'cambio_estado': '🔄',
      'asignacion': '👤'
    };
    return icons[tipo] || '📌';
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
