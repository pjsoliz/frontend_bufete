import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {
  clientes: User[] = [];
  loading = true;
  filtroEstado = '';
  busquedaTexto = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: () => {
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  toggleEstado(cliente: User, event: Event): void {
    event.stopPropagation();
    if (cliente.estado) {
      this.clienteService.desactivarCliente(cliente.id).subscribe({
        next: () => this.loadClientes()
      });
    } else {
      this.clienteService.activarCliente(cliente.id).subscribe({
        next: () => this.loadClientes()
      });
    }
  }

  get clientesFiltrados(): User[] {
    return this.clientes.filter(cliente => {
      const matchEstado = !this.filtroEstado || 
        (this.filtroEstado === 'activo' && cliente.estado) || 
        (this.filtroEstado === 'inactivo' && !cliente.estado);
      
      const matchBusqueda = !this.busquedaTexto || 
        cliente.nombre.toLowerCase().includes(this.busquedaTexto.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(this.busquedaTexto.toLowerCase()) ||
        cliente.email.toLowerCase().includes(this.busquedaTexto.toLowerCase());
      
      return matchEstado && matchBusqueda;
    });
  }

  getEstadoBadgeClass(estado: boolean): string {
    return estado ? 'badge-success' : 'badge-danger';
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }
}