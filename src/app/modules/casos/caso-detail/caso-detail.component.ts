import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasoService } from '../../../core/services/caso.service';
import { Caso } from '../../../core/models';

@Component({
  selector: 'app-caso-detail',
  templateUrl: './caso-detail.component.html',
  styleUrls: ['./caso-detail.component.css']
})
export class CasoDetailComponent implements OnInit {
  caso: Caso | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casoService: CasoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadCaso(id);
  }

  loadCaso(id: number): void {
    this.loading = true;
    this.casoService.getCasoById(id).subscribe({
      next: (caso) => {
        this.caso = caso;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/casos']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/casos']);
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
}