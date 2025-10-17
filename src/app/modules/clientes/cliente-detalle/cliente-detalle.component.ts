import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService, Cliente } from '../../../core/services/clientes.service';
import { CasosService, Caso } from '../../../core/services/casos.service';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {
  cliente: Cliente | null = null;
  casosCliente: Caso[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService,
    private casosService: CasosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCliente(parseInt(id));
      this.cargarCasosCliente(parseInt(id));
    }
  }

  cargarCliente(id: number): void {
    this.loading = true;
    this.clientesService.getClienteById(id).subscribe({
      next: (cliente) => {
        if (cliente) {
          this.cliente = cliente;
        } else {
          this.errorMessage = 'Cliente no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        this.errorMessage = 'Error al cargar el cliente';
        this.loading = false;
      }
    });
  }

  cargarCasosCliente(clienteId: number): void {
    this.casosService.getCasos().subscribe({
      next: (casos) => {
        // Filtrar casos del cliente actual
        if (this.cliente) {
          this.casosCliente = casos.filter(c => c.cliente === this.getNombreCompleto());
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }

  editarCliente(): void {
    if (this.cliente) {
      this.router.navigate(['/clientes/editar', this.cliente.id]);
    }
  }

  eliminarCliente(): void {
    if (this.cliente && confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      this.clientesService.deleteCliente(this.cliente.id).subscribe({
        next: () => {
          alert('Cliente eliminado exitosamente');
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  cambiarEstado(): void {
    if (this.cliente) {
      const nuevoEstado = this.cliente.estado === 'activo' ? 'inactivo' : 'activo';
      const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

      if (confirm(`¿Está seguro de ${accion} este cliente?`)) {
        const operacion = nuevoEstado === 'activo'
          ? this.clientesService.activarCliente(this.cliente.id)
          : this.clientesService.desactivarCliente(this.cliente.id);

        operacion.subscribe({
          next: (clienteActualizado) => {
            this.cliente = clienteActualizado;
            alert(`Cliente ${accion}do exitosamente`);
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            alert('Error al cambiar el estado del cliente');
          }
        });
      }
    }
  }

  verCaso(casoId: number): void {
    this.router.navigate(['/casos', casoId]);
  }

  getNombreCompleto(): string {
    if (this.cliente) {
      return `${this.cliente.nombre} ${this.cliente.apellido}`;
    }
    return '';
  }

  getEstadoClass(estado: string): string {
    return estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  }

  getTipoDocumentoTexto(tipo: string): string {
    const tipos: any = {
      'cedula': 'Cédula',
      'pasaporte': 'Pasaporte',
      'ruc': 'RUC'
    };
    return tipos[tipo] || tipo;
  }

  getCasoEstadoClass(estado: string): string {
    const classes: any = {
      'pendiente': 'caso-pendiente',
      'en_progreso': 'caso-progreso',
      'suspendido': 'caso-suspendido',
      'cerrado': 'caso-cerrado'
    };
    return classes[estado] || '';
  }

  getCasoEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'suspendido': 'Suspendido',
      'cerrado': 'Cerrado'
    };
    return textos[estado] || estado;
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

  calcularEdad(): number | null {
    if (this.cliente?.fecha_nacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(this.cliente.fecha_nacimiento + 'T00:00:00');
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    }
    return null;
  }
  crearNuevoCaso(): void {
    this.router.navigate(['/casos/nuevo']);
  }
}
