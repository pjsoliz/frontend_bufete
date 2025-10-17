import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService, Cliente } from '../../../core/services/clientes.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  loading = true;

  // Filtros
  filtroEstado: string = 'todos';
  filtroBusqueda: string = '';

  // Estadísticas
  stats = {
    total: 0,
    activos: 0,
    inactivos: 0,
    nuevos_mes: 0
  };

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.clientes.length;
    this.stats.activos = this.clientes.filter(c => c.estado === 'activo').length;
    this.stats.inactivos = this.clientes.filter(c => c.estado === 'inactivo').length;

    const hoy = new Date();
    const mesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    this.stats.nuevos_mes = this.clientes.filter(c => {
      const fechaReg = new Date(c.fecha_registro + 'T00:00:00');
      return fechaReg >= mesAtras;
    }).length;
  }

  aplicarFiltros(): void {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      const cumpleEstado = this.filtroEstado === 'todos' || cliente.estado === this.filtroEstado;

      const cumpleBusqueda = !this.filtroBusqueda ||
        cliente.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cliente.documento_identidad.includes(this.filtroBusqueda);

      return cumpleEstado && cumpleBusqueda;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/clientes', id]);
  }

  editarCliente(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      this.clientesService.deleteCliente(id).subscribe({
        next: () => {
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  cambiarEstado(id: number, nuevoEstado: 'activo' | 'inactivo', event: Event): void {
    event.stopPropagation();
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    if (confirm(`¿Está seguro de ${accion} este cliente?`)) {
      const operacion = nuevoEstado === 'activo'
        ? this.clientesService.activarCliente(id)
        : this.clientesService.desactivarCliente(id);

      operacion.subscribe({
        next: () => {
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          alert('Error al cambiar el estado del cliente');
        }
      });
    }
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

  getNombreCompleto(cliente: Cliente): string {
    return `${cliente.nombre} ${cliente.apellido}`;
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
