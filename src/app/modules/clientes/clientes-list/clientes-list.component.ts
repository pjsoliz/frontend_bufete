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
  filtroBusqueda: string = '';
  filtroPlatforma: string = 'todos'; // Nuevo filtro por plataforma

  // Estadísticas
  stats = {
    total: 0,
    whatsapp: 0,
    telegram: 0,
    panel_web: 0
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
        console.log('Clientes cargados:', data);
        this.clientes = data;
        this.clientesFiltrados = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loading = false;
        alert('Error al cargar los clientes. Verifica la conexión con el servidor.');
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.clientes.length;
    this.stats.whatsapp = this.clientes.filter(c => c.plataforma === 'whatsapp').length;
    this.stats.telegram = this.clientes.filter(c => c.plataforma === 'telegram').length;
    this.stats.panel_web = this.clientes.filter(c => c.plataforma === 'panel_web').length;
  }

  aplicarFiltros(): void {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      // Filtro por plataforma
      const cumplePlataforma = this.filtroPlatforma === 'todos' || 
                               cliente.plataforma === this.filtroPlatforma;

      // Filtro por búsqueda (nombre, teléfono, email)
      const cumpleBusqueda = !this.filtroBusqueda ||
        cliente.nombreCompleto.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cliente.telefono.includes(this.filtroBusqueda) ||
        (cliente.email && cliente.email.toLowerCase().includes(this.filtroBusqueda.toLowerCase()));

      return cumplePlataforma && cumpleBusqueda;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/clientes', id]);
  }

  editarCliente(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: string, event: Event): void {
    event.stopPropagation();
    
    const cliente = this.clientes.find(c => c.id === id);
    const mensaje = `¿Está seguro de eliminar al cliente "${cliente?.nombreCompleto}"?\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
      this.clientesService.deleteCliente(id).subscribe({
        next: () => {
          console.log('Cliente eliminado exitosamente');
          this.cargarClientes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          alert('Error al eliminar el cliente. Puede que tenga citas asociadas.');
        }
      });
    }
  }

  // Métodos auxiliares para el template

  getPlataformaIcon(plataforma?: string): string {
    const iconos: any = {
      'whatsapp': '📱',
      'telegram': '✈️',
      'panel_web': '💻'
    };
    return iconos[plataforma || ''] || '👤';
  }

  getPlataformaTexto(plataforma?: string): string {
    const textos: any = {
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'panel_web': 'Panel Web'
    };
    return textos[plataforma || ''] || 'Desconocido';
  }

  getPlataformaClass(plataforma?: string): string {
    const clases: any = {
      'whatsapp': 'badge-whatsapp',
      'telegram': 'badge-telegram',
      'panel_web': 'badge-panel'
    };
    return clases[plataforma || ''] || 'badge-default';
  }

  formatearFecha(fecha?: Date): string {
    if (!fecha) return '-';
    
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatearTelefono(telefono: string): string {
    // Formatear teléfono para mejor visualización
    if (telefono.length === 8) {
      return `${telefono.slice(0, 4)}-${telefono.slice(4)}`;
    }
    return telefono;
  }
}