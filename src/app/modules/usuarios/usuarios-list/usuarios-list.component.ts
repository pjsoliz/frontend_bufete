import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = true;

  filtroRol: string = 'todos';
  filtroEstado: string = 'todos';
  filtroBusqueda: string = '';

  stats = {
    total: 0,
    administradores: 0,
    abogados: 0,
    asistentes: 0,
    activos: 0
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.usuarios.length;
    this.stats.administradores = this.usuarios.filter(u => u.rol === 'administrador').length;
    this.stats.abogados = this.usuarios.filter(u => u.rol === 'abogado').length;
    this.stats.asistentes = this.usuarios.filter(u => u.rol === 'asistente_legal').length;
    this.stats.activos = this.usuarios.filter(u => u.estado === 'activo').length;
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const cumpleRol = this.filtroRol === 'todos' || usuario.rol === this.filtroRol;
      const cumpleEstado = this.filtroEstado === 'todos' || usuario.estado === this.filtroEstado;

      const cumpleBusqueda = !this.filtroBusqueda ||
        usuario.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        usuario.username.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleRol && cumpleEstado && cumpleBusqueda;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }

  editarUsuario(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminarUsuario(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  cambiarEstado(id: number, nuevoEstado: 'activo' | 'inactivo', event: Event): void {
    event.stopPropagation();
    const operacion = nuevoEstado === 'activo'
      ? this.usuariosService.activarUsuario(id)
      : this.usuariosService.desactivarUsuario(id);

    operacion.subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
        alert('Error al cambiar el estado');
      }
    });
  }

  getRolClass(rol: string): string {
    const classes: any = {
      'administrador': 'rol-admin',
      'abogado': 'rol-abogado',
      'asistente_legal': 'rol-asistente'
    };
    return classes[rol] || '';
  }

  getRolTexto(rol: string): string {
    const textos: any = {
      'administrador': 'Administrador',
      'abogado': 'Abogado',
      'asistente_legal': 'Asistente Legal'
    };
    return textos[rol] || rol;
  }


  getRolIconName(rol: string): string {
  const icons: any = {
    'administrador': 'shield',
    'abogado': 'scale',
    'asistente_legal': 'clipboard-list'
  };
  return icons[rol] || 'user';
} 
  getEstadoClass(estado: string): string {
    return estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido}`;
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
