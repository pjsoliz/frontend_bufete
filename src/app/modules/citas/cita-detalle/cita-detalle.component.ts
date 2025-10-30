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
      this.cargarCita(id); // ⭐ CAMBIADO: de parseInt(id) a solo id (es UUID string)
    }
  }

  cargarCita(id: string): void { // ⭐ CAMBIADO: de number a string
    this.loading = true;
    this.errorMessage = '';
    
    this.citasService.getCitaById(id).subscribe({
      next: (cita) => {
        if (cita) {
          // ⭐ CAMBIADO: Eliminar asignación de valores por defecto ficticios
          // Solo asignar la cita tal como viene del backend
          this.cita = cita;
          console.log('Cita cargada:', this.cita);
        } else {
          this.errorMessage = 'Cita no encontrada';
        }
        this.loading = false;
        
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
  if (this.cita && confirm('¿Está seguro de cancelar esta cita?')) {  // Cambiar texto
    this.citasService.deleteCita(this.cita.id).subscribe({
      next: () => {
        alert('Cita cancelada exitosamente');  // Cambiar texto
        this.router.navigate(['/citas']);
      },
      error: (error) => {
        console.error('Error al cancelar cita:', error);  // Cambiar texto
        alert('Error al cancelar la cita');  // Cambiar texto
      }
    });
  }
}

  confirmarCita(): void {
    if (this.cita) {
      // Usar el método específico del service en lugar de updateCita
      this.citasService.confirmarCita(this.cita.id).subscribe({
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
      // Usar el método específico del service
      this.citasService.cancelarCita(this.cita.id).subscribe({
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
      // Usar el método específico del service
      this.citasService.completarCita(this.cita.id).subscribe({
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

  // ⭐ MÉTODOS HELPER - ADAPTADOS A TU BACKEND REAL
  tieneUbicacion(): boolean {
    // ⭐ Tu backend NO tiene campo "ubicacion", siempre retornar false
    return false;
  }

  tieneDescripcion(): boolean {
    // ⭐ Tu backend NO tiene campo "descripcion", siempre retornar false
    return false;
  }

  tieneNotas(): boolean {
    // ⭐ CAMBIADO: Tu backend usa "notasAdicionales" no "notas"
    return !!(this.cita?.notasAdicionales && this.cita.notasAdicionales.trim() !== '');
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

  formatearFecha(fecha: Date): string {
    // El backend envía Date, convertir a objeto Date de JS
    const fechaObj = new Date(fecha);
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
    // El backend envía Date, combinarlo con la hora
    const fechaCita = new Date(this.cita.fecha);
    const [horas, minutos] = this.cita.hora.split(':');
    fechaCita.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    return fechaCita < ahora;
  }

  esHoy(): boolean {
    if (!this.cita) return false;
    const hoy = new Date();
    const fechaCita = new Date(this.cita.fecha);
    return hoy.toDateString() === fechaCita.toDateString();
  }
}