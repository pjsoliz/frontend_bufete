import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';
import { SwalService } from '../../../core/services/swal.service';

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
    asistentes: 0,
    activos: 0
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private swal: SwalService
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
        this.swal.error('Error de carga', 'Verifica la conexión con el servidor.');
      }
    });
  }

  calcularEstadisticas(): void {
    this.stats.total = this.usuarios.length;
    this.stats.administradores = this.usuarios.filter(u => u.rol === 'admin').length;
    this.stats.asistentes = this.usuarios.filter(u => u.rol === 'asistente_legal').length;
    this.stats.activos = this.usuarios.filter(u => u.activo).length;
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const cumpleRol = this.filtroRol === 'todos' || usuario.rol === this.filtroRol;

      let cumpleEstado = true;
      if (this.filtroEstado === 'activo') {
        cumpleEstado = usuario.activo === true;
      } else if (this.filtroEstado === 'inactivo') {
        cumpleEstado = usuario.activo === false;
      }

      const cumpleBusqueda = !this.filtroBusqueda ||
        usuario.nombreCompleto.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleRol && cumpleEstado && cumpleBusqueda;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/usuarios', id]);
  }

  editarUsuario(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminarUsuario(usuario: Usuario, event: Event): void {
    event.stopPropagation();

    if (usuario.rol === 'admin') {
      this.swal.warning('Acción no permitida', 'No se puede eliminar un usuario Administrador.');
      return;
    }

    this.swal.confirmDelete(
      '¿Eliminar usuario?',
      `Esta acción eliminará a "${usuario.nombreCompleto}" de forma permanente.`
    ).then(confirmado => {
      if (confirmado) {
        this.usuariosService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            this.swal.toast('Usuario eliminado exitosamente');
            this.cargarUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.swal.error('Error', 'No se pudo eliminar el usuario.');
          }
        });
      }
    });
  }

  cambiarEstado(usuario: Usuario, activar: boolean, event: Event): void {
    event.stopPropagation();

    if (usuario.rol === 'admin') {
      this.swal.warning('Acción no permitida', 'No se puede cambiar el estado de un Administrador.');
      return;
    }

    const accion = activar ? 'activar' : 'desactivar';
    this.swal.confirm(
      `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      `Se ${accion}á a "${usuario.nombreCompleto}".`,
      `Sí, ${accion}`
    ).then(confirmado => {
      if (confirmado) {
        this.usuariosService.cambiarEstadoUsuario(usuario.id, activar).subscribe({
          next: () => {
            this.swal.toast(`Usuario ${accion}do exitosamente`);
            this.cargarUsuarios();
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.swal.error('Error', 'No se pudo cambiar el estado del usuario.');
          }
        });
      }
    });
  }

  esAdmin(usuario: Usuario): boolean {
    return usuario.rol === 'admin';
  }

  getRolClass(rol: string): string {
    const classes: any = {
      'admin': 'rol-admin',
      'asistente_legal': 'rol-asistente'
    };
    return classes[rol] || '';
  }

  getRolTexto(rol: string): string {
    const textos: any = {
      'admin': 'Administrador',
      'asistente_legal': 'Asistente Legal'
    };
    return textos[rol] || rol;
  }

  getRolIconName(rol: string): string {
    const icons: any = {
      'admin': 'shield',
      'asistente_legal': 'clipboard-list'
    };
    return icons[rol] || 'user';
  }

  getEstadoClass(activo: boolean): string {
    return activo ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoTexto(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  formatearFecha(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}