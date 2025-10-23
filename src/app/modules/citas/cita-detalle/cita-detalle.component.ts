import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService, Cita } from '../../../core/services/citas.service';

@Component({
  selector: 'app-cita-detalle',
  templateUrl: './cita-detalle.component.html',
  styleUrls: ['./cita-detalle.component.css']
})
export class CitaDetalleComponent implements OnInit {
  cita: Cita | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private citasService: CitasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCita(parseInt(id));
    }
  }

  cargarCita(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.citasService.getCitaById(id).subscribe({
      next: (cita) => {
        if (cita) {
          // ⭐ Asegurar que las propiedades existan con valores por defecto
          this.cita = {
            ...cita,
            ubicacion: cita.ubicacion || 'No especificada',
            descripcion: cita.descripcion || 'Sin descripción',
            notas: cita.notas || 'Sin notas adicionales'
          };
          console.log('Cita cargada:', this.cita); // Para debug
        } else {
          this.errorMessage = 'Cita no encontrada';
        }
        this.loading = false;
        
        // ⭐ CRÍTICO: Forzar detección de cambios con setTimeout
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('Error al cargar cita:', error);
        this.errorMessage = 'Error al cargar la cita';
        this.loading = false;
        
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/citas']);
  }

  editarCita(): void {
    if (this.cita) {
      this.router.navigate(['/citas/editar', this.cita.id]);
    }
  }

  eliminarCita(): void {
    if (this.cita && confirm('¿Está seguro de eliminar esta cita?')) {
      this.citasService.deleteCita(this.cita.id).subscribe({
        next: () => {
          alert('Cita eliminada exitosamente');
          this.router.navigate(['/citas']);
        },
        error: (error) => {
          console.error('Error al eliminar cita:', error);
          alert('Error al eliminar la cita');
        }
      });
    }
  }

  confirmarCita(): void {
    if (this.cita) {
      this.citasService.updateCita(this.cita.id, { estado: 'confirmada' }).subscribe({
        next: (citaActualizada) => {
          this.cita = citaActualizada;
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
          alert('Cita confirmada exitosamente');
        },
        error: (error) => {
          console.error('Error al confirmar cita:', error);
          alert('Error al confirmar la cita');
        }
      });
    }
  }

  cancelarCita(): void {
    if (this.cita && confirm('¿Está seguro de cancelar esta cita?')) {
      this.citasService.updateCita(this.cita.id, { estado: 'cancelada' }).subscribe({
        next: (citaActualizada) => {
          this.cita = citaActualizada;
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
          alert('Cita cancelada');
        },
        error: (error) => {
          console.error('Error al cancelar cita:', error);
          alert('Error al cancelar la cita');
        }
      });
    }
  }

  completarCita(): void {
    if (this.cita && confirm('¿Marcar esta cita como completada?')) {
      this.citasService.updateCita(this.cita.id, { estado: 'completada' }).subscribe({
        next: (citaActualizada) => {
          this.cita = citaActualizada;
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
          alert('Cita completada');
        },
        error: (error) => {
          console.error('Error al completar cita:', error);
          alert('Error al completar la cita');
        }
      });
    }
  }

  // ⭐ MÉTODOS HELPER PARA VERIFICAR EXISTENCIA DE DATOS
  tieneUbicacion(): boolean {
    return !!(this.cita?.ubicacion && this.cita.ubicacion.trim() !== '' && this.cita.ubicacion !== 'No especificada');
  }

  tieneDescripcion(): boolean {
    return !!(this.cita?.descripcion && this.cita.descripcion.trim() !== '' && this.cita.descripcion !== 'Sin descripción');
  }

  tieneNotas(): boolean {
    return !!(this.cita?.notas && this.cita.notas.trim() !== '' && this.cita.notas !== 'Sin notas adicionales');
  }

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

  getTipoClass(tipo: string): string {
    const classes: any = {
      'consulta': 'tipo-consulta',
      'audiencia': 'tipo-audiencia',
      'reunion': 'tipo-reunion',
      'firma': 'tipo-firma',
      'otro': 'tipo-otro'
    };
    return classes[tipo] || '';
  }

  getTipoTexto(tipo: string): string {
    const textos: any = {
      'consulta': 'Consulta',
      'audiencia': 'Audiencia',
      'reunion': 'Reunión',
      'firma': 'Firma de Documentos',
      'otro': 'Otro'
    };
    return textos[tipo] || tipo;
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

  formatearHora(hora: string): string {
    return hora;
  }

  esPasada(): boolean {
    if (!this.cita) return false;
    const ahora = new Date();
    const fechaCita = new Date(this.cita.fecha + 'T' + this.cita.hora);
    return fechaCita < ahora;
  }

  esHoy(): boolean {
    if (!this.cita) return false;
    const hoy = new Date();
    const fechaCita = new Date(this.cita.fecha + 'T00:00:00');
    return hoy.toDateString() === fechaCita.toDateString();
  }
}