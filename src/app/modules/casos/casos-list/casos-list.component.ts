import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasoService } from '../../../core/services/caso.service';
import { Caso } from '../../../core/models';

@Component({
  selector: 'app-casos-list',
  templateUrl: './casos-list.component.html',
  styleUrls: ['./casos-list.component.css']
})
export class CasosListComponent implements OnInit {
  casos: Caso[] = [];
  loading = true;
  filtroEstado = '';
  filtroPrioridad = '';

  constructor(
    private casoService: CasoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCasos();
  }

  loadCasos(): void {
    this.loading = true;
    this.casoService.getCasos().subscribe({
      next: (casos) => {
        this.casos = casos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/casos', id]);
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: any = {
      'ABIERTO': 'badge-info',
      'EN_PROCESO': 'badge-warning',
      'CERRADO': 'badge-success',
      'ARCHIVADO': 'badge-default'
    };
    return classes[estado] || 'badge-default';
  }

  getPrioridadBadgeClass(prioridad: string): string {
    const classes: any = {
      'BAJA': 'badge-success',
      'MEDIA': 'badge-info',
      'ALTA': 'badge-warning',
      'URGENTE': 'badge-danger'
    };
    return classes[prioridad] || 'badge-default';
  }

  get casosFiltrados(): Caso[] {
    return this.casos.filter(caso => {
      const matchEstado = !this.filtroEstado || caso.estado === this.filtroEstado;
      const matchPrioridad = !this.filtroPrioridad || caso.prioridad === this.filtroPrioridad;
      return matchEstado && matchPrioridad;
    });
  }
}