import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasosService, Caso } from '../../../core/services/casos.service';

@Component({
  selector: 'app-casos-list',
  templateUrl: './casos-list.component.html',
  styleUrls: ['./casos-list.component.css']
})
export class CasosListComponent implements OnInit {
  casos: Caso[] = [];
  casosFiltrados: Caso[] = [];
  loading = true;

  // Filtros
  filtroEstado: string = 'todos';
  filtroTipo: string = 'todos';
  filtroPrioridad: string = 'todos';
  filtroBusqueda: string = '';

  // Estadísticas
  stats = {
    total: 0,
    pendientes: 0,
    en_progreso: 0,
    cerrados: 0
  };

  constructor(
    private casosService: CasosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.loading = true;
    this.casosService.getCasos().subscribe({
      next: (data) => {
        this.casos = data;
        this.casosFiltrados = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar casos:', error);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.casos.length;
    this.stats.pendientes = this.casos.filter(c => c.estado === 'pendiente').length;
    this.stats.en_progreso = this.casos.filter(c => c.estado === 'en_progreso').length;
    this.stats.cerrados = this.casos.filter(c => c.estado === 'cerrado').length;
  }

  aplicarFiltros(): void {
    this.casosFiltrados = this.casos.filter(caso => {
      const cumpleEstado = this.filtroEstado === 'todos' || caso.estado === this.filtroEstado;
      const cumpleTipo = this.filtroTipo === 'todos' || caso.tipo === this.filtroTipo;
      const cumplePrioridad = this.filtroPrioridad === 'todos' || caso.prioridad === this.filtroPrioridad;

      const cumpleBusqueda = !this.filtroBusqueda ||
        caso.numero_caso.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        caso.titulo.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        caso.cliente.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        (caso.abogado && caso.abogado.toLowerCase().includes(this.filtroBusqueda.toLowerCase()));

      return cumpleEstado && cumpleTipo && cumplePrioridad && cumpleBusqueda;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevoCaso(): void {
    this.router.navigate(['/casos/nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/casos', id]);
  }

  editarCaso(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/casos/editar', id]);
  }

  eliminarCaso(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este caso? Esta acción no se puede deshacer.')) {
      this.casosService.deleteCaso(id).subscribe({
        next: () => {
          this.cargarCasos();
        },
        error: (error) => {
          console.error('Error al eliminar caso:', error);
          alert('Error al eliminar el caso');
        }
      });
    }
  }

  getTipoClass(tipo: string): string {
    const classes: any = {
      'laboral': 'tipo-laboral',
      'civil': 'tipo-civil',
      'penal': 'tipo-penal',
      'familia': 'tipo-familia',
      'comercial': 'tipo-comercial',
      'otro': 'tipo-otro'
    };
    return classes[tipo] || '';
  }

  getTipoTexto(tipo: string): string {
    const textos: any = {
      'laboral': 'Laboral',
      'civil': 'Civil',
      'penal': 'Penal',
      'familia': 'Familia',
      'comercial': 'Comercial',
      'otro': 'Otro'
    };
    return textos[tipo] || tipo;
  }

  getEstadoClass(estado: string): string {
    const classes: any = {
      'pendiente': 'estado-pendiente',
      'en_progreso': 'estado-progreso',
      'suspendido': 'estado-suspendido',
      'cerrado': 'estado-cerrado'
    };
    return classes[estado] || '';
  }

  getEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'suspendido': 'Suspendido',
      'cerrado': 'Cerrado'
    };
    return textos[estado] || estado;
  }

  getPrioridadClass(prioridad: string): string {
    const classes: any = {
      'baja': 'prioridad-baja',
      'media': 'prioridad-media',
      'alta': 'prioridad-alta'
    };
    return classes[prioridad] || '';
  }

  getPrioridadTexto(prioridad: string): string {
    const textos: any = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta'
    };
    return textos[prioridad] || prioridad;
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
