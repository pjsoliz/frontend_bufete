import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { CasoService } from '../../../core/services/caso.service';
import { CitaService } from '../../../core/services/cita.service';
import { User, Caso, Cita } from '../../../core/models';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css']
})
export class ClienteDetailComponent implements OnInit {
  cliente: User | null = null;
  casos: Caso[] = [];
  citas: Cita[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private casoService: CasoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadCliente(id);
    this.loadCasosCliente(id);
    this.loadCitasCliente(id);
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getClienteById(id).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
      }
    });
  }

  loadCasosCliente(clienteId: number): void {
    this.casoService.getCasos().subscribe({
      next: (casos) => {
        this.casos = casos.filter(c => c.cliente.id === clienteId);
      }
    });
  }

  loadCitasCliente(clienteId: number): void {
    this.citaService.getCitas().subscribe({
      next: (citas) => {
        this.citas = citas.filter(c => c.cliente.id === clienteId);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }

  editarCliente(): void {
    this.router.navigate(['/clientes/editar', this.cliente?.id]);
  }

  getEstadoBadgeClass(estado: boolean): string {
    return estado ? 'badge-success' : 'badge-danger';
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  getCasoBadgeClass(estado: string): string {
    const classes: any = {
      'ABIERTO': 'badge-info',
      'EN_PROCESO': 'badge-warning',
      'CERRADO': 'badge-success',
      'ARCHIVADO': 'badge-default'
    };
    return classes[estado] || 'badge-default';
  }

  getCitaBadgeClass(estado: string): string {
    const classes: any = {
      'PENDIENTE': 'badge-warning',
      'CONFIRMADA': 'badge-success',
      'COMPLETADA': 'badge-info',
      'CANCELADA': 'badge-danger'
    };
    return classes[estado] || 'badge-default';
  }
  getCasosActivos(): number {
  return this.casos.filter(c => c.estado === 'EN_PROCESO').length;
}

getCitasPendientes(): number {
  return this.citas.filter(c => c.estado === 'PENDIENTE').length;
}
}
