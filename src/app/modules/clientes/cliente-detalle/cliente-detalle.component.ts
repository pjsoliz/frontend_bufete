import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService, Cliente } from '../../../core/services/clientes.service';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {
  cliente: Cliente | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCliente(id);
    }
  }

  cargarCliente(id: string): void {
    this.loading = true;
    this.clientesService.getClienteById(id).subscribe({
      next: (cliente) => {
        if (cliente) {
          this.cliente = cliente;
          console.log('Cliente cargado:', cliente);
        } else {
          this.errorMessage = 'Cliente no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        if (error.status === 404) {
          this.errorMessage = 'Cliente no encontrado';
        } else {
          this.errorMessage = 'Error al cargar el cliente';
        }
        this.loading = false;
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
    if (!this.cliente) return;
    this.swal.confirmDelete(
      '¿Eliminar cliente?',
      `Se eliminará a "${this.cliente.nombreCompleto}" permanentemente.`
    ).then(confirmado => {
      if (confirmado) {
        this.clientesService.deleteCliente(this.cliente!.id).subscribe({
          next: () => {
            this.swal.toast('Cliente eliminado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            if (error.status === 400 && error.error?.message) {
              this.swal.error('No se puede eliminar', error.error.message);
            } else {
              this.swal.error('Error', 'No se pudo eliminar. Puede que tenga citas asociadas.');
            }
          }
        });
      }
    });
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha?: Date): string {
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

  copiarAlPortapapeles(texto: string, campo: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      this.swal.toast(`${campo} copiado al portapapeles`, 'info');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  enviarWhatsApp(): void {
    if (this.cliente) {
      const numero = this.cliente.telefono.replace(/\D/g, '');
      const url = `https://wa.me/591${numero}`;
      window.open(url, '_blank');
    }
  }

  enviarEmail(): void {
    if (this.cliente?.email) {
      window.location.href = `mailto:${this.cliente.email}`;
    }
  }

  // Mostrar primeras letras del nombre para el avatar
  getIniciales(): string {
    if (this.cliente) {
      const palabras = this.cliente.nombreCompleto.trim().split(' ');
      if (palabras.length >= 2) {
        return palabras[0].charAt(0).toUpperCase() + palabras[1].charAt(0).toUpperCase();
      }
      return this.cliente.nombreCompleto.charAt(0).toUpperCase();
    }
    return '?';
  }

  // Formatear el ID del cliente (mostrar solo primeros 8 caracteres)
  getClienteIdCorto(): string {
    if (this.cliente?.id) {
      return this.cliente.id.substring(0, 8);
    }
    return '';
  }
}