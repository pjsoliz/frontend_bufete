import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';

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
    private usuariosService: UsuariosService
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

  eliminarUsuario(): void {
    if (this.usuario && confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(this.usuario.id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  cambiarEstado(): void {
    if (this.usuario) {
      const nuevoEstado = !this.usuario.activo;
      const accion = nuevoEstado ? 'activar' : 'desactivar';

      if (confirm(`¿Está seguro de ${accion} este usuario?`)) {
        this.usuariosService.cambiarEstadoUsuario(this.usuario.id, nuevoEstado).subscribe({
          next: (usuarioActualizado) => {
            this.usuario = usuarioActualizado;
            alert(`Usuario ${accion}do exitosamente`);
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            alert('Error al cambiar el estado del usuario');
          }
        });
      }
    }
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  calcularDiasDesdeAcceso(): number | null {
    if (this.usuario?.ultimoAcceso) {
      const hoy = new Date();
      const ultimoAcceso = new Date(this.usuario.ultimoAcceso);
      const diff = Math.floor((hoy.getTime() - ultimoAcceso.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    }
    return null;
  }
}