import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private usuariosService: UsuariosService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarUsuario(id);
    }
  }

  cargarUsuario(id: string): void {
    this.loading = true;
    this.usuariosService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
        } else {
          this.errorMessage = 'Usuario no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.errorMessage = 'Error al cargar el usuario';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/usuarios']);
  }

  editarUsuario(): void {
    if (this.usuario) {
      this.router.navigate(['/usuarios/editar', this.usuario.id]);
    }
  }

  esAdmin(): boolean {
    return this.usuario?.rol === 'admin';
  }

  eliminarUsuario(): void {
    if (!this.usuario) return;

    if (this.esAdmin()) {
      this.swal.warning('Acción no permitida', 'No se puede eliminar un usuario Administrador.');
      return;
    }

    this.swal.confirmDelete(
      '¿Eliminar usuario?',
      `Esta acción eliminará a "${this.usuario.nombreCompleto}" de forma permanente.`
    ).then(confirmado => {
      if (confirmado) {
        this.usuariosService.deleteUsuario(this.usuario!.id).subscribe({
          next: () => {
            this.swal.toast('Usuario eliminado exitosamente');
            this.router.navigate(['/usuarios']);
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.swal.error('Error', 'No se pudo eliminar el usuario.');
          }
        });
      }
    });
  }

  cambiarEstado(): void {
    if (!this.usuario) return;

    if (this.esAdmin()) {
      this.swal.warning('Acción no permitida', 'No se puede cambiar el estado de un Administrador.');
      return;
    }

    const nuevoEstado = !this.usuario.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    this.swal.confirm(
      `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      `Se ${accion}á a "${this.usuario.nombreCompleto}".`,
      `Sí, ${accion}`
    ).then(confirmado => {
      if (confirmado) {
        this.usuariosService.cambiarEstadoUsuario(this.usuario!.id, nuevoEstado).subscribe({
          next: (usuarioActualizado) => {
            this.usuario = usuarioActualizado;
            this.swal.toast(`Usuario ${accion}do exitosamente`);
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.swal.error('Error', 'No se pudo cambiar el estado del usuario.');
          }
        });
      }
    });
  }

  getRolClass(rol: string): string {
    const classes: any = { 'admin': 'rol-admin', 'asistente_legal': 'rol-asistente' };
    return classes[rol] || '';
  }

  getRolTexto(rol: string): string {
    const textos: any = { 'admin': 'Administrador', 'asistente_legal': 'Asistente Legal' };
    return textos[rol] || rol;
  }

  getRolIconName(rol: string): string {
    const icons: any = { 'admin': 'shield', 'asistente_legal': 'clipboard-list' };
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
    return fechaObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatearFechaCorta(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  calcularDiasDesdeAcceso(): number | null {
    if (this.usuario?.ultimoAcceso) {
      const hoy = new Date();
      const ultimoAcceso = new Date(this.usuario.ultimoAcceso);
      return Math.floor((hoy.getTime() - ultimoAcceso.getTime()) / (1000 * 60 * 60 * 24));
    }
    return null;
  }
}