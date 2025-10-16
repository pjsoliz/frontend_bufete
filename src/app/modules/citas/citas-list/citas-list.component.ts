import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../../core/services/cita.service';
import { Cita } from '../../../core/models';

@Component({
  selector: 'app-citas-list',
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.css']
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  loading = true;
  filtroEstado = '';
  filtroModalidad = '';

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.loading = true;
    this.citaService.getCitas().subscribe({
      next: (citas) => {
        this.citas = citas;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: any = {
      'PENDIENTE': 'badge-warning',
      'CONFIRMADA': 'badge-success',
      'COMPLETADA': 'badge-info',
      'CANCELADA': 'badge-danger',
      'NO_ASISTIO': 'badge-default'
    };
    return classes[estado] || 'badge-default';
  }

  getModalidadIcon(modalidad: string): string {
    const icons: any = {
      'PRESENCIAL': '🏢',
      'VIRTUAL': '💻',
      'TELEFONICA': '📞'
    };
    return icons[modalidad] || '📍';
  }

  get citasFiltradas(): Cita[] {
    return this.citas.filter(cita => {
      const matchEstado = !this.filtroEstado || cita.estado === this.filtroEstado;
      const matchModalidad = !this.filtroModalidad || cita.modalidad === this.filtroModalidad;
      return matchEstado && matchModalidad;
    });
  }
}