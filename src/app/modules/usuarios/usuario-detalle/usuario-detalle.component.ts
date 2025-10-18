import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';
import { CasosService, Caso } from '../../../core/services/casos.service';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {
  usuario: Usuario | null = null;
  casosAsignados: Caso[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private usuariosService: UsuariosService,
    private casosService: CasosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarUsuario(parseInt(id));
      this.cargarCasosAsignados(parseInt(id));
    }
  }

  cargarUsuario(id: number): void {
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

  cargarCasosAsignados(usuarioId: number): void {
    if (this.usuario?.rol === 'abogado') {
      this.casosService.getCasos().subscribe({
        next: (casos) => {
          this.casosAsignados = casos.filter(c => c.abogado === this.getNombreCompleto());
        },
        error: (error) => {
          console.error('Error al cargar casos:', error);
        }
      });
    }
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
      const nuevoEstado = this.usuario.estado === 'activo' ? 'inactivo' : 'activo';
      const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

      if (confirm(`¿Está seguro de ${accion} este usuario?`)) {
        const operacion = nuevoEstado === 'activo'
          ? this.usuariosService.activarUsuario(this.usuario.id)
          : this.usuariosService.desactivarUsuario(this.usuario.id);

        operacion.subscribe({
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

  verCaso(casoId: number): void {
    this.router.navigate(['/casos', casoId]);
  }

  getNombreCompleto(): string {
    if (this.usuario) {
      return `${this.usuario.nombre} ${this.usuario.apellido}`;
    }
    return '';
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

  getRolIcon(rol: string): string {
    const iconos: any = {
      'administrador': '👑',
      'abogado': '⚖️',
      'asistente_legal': '📋'
    };
    return iconos[rol] || '👤';
  }

  getEstadoClass(estado: string): string {
    return estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  }

  getCasoEstadoClass(estado: string): string {
    const classes: any = {
      'pendiente': 'caso-pendiente',
      'en_progreso': 'caso-progreso',
      'suspendido': 'caso-suspendido',
      'cerrado': 'caso-cerrado'
    };
    return classes[estado] || '';
  }

  getCasoEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'suspendido': 'Suspendido',
      'cerrado': 'Cerrado'
    };
    return textos[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  calcularDiasDesdeAcceso(): number | null {
    if (this.usuario?.ultimo_acceso) {
      const hoy = new Date();
      const ultimoAcceso = new Date(this.usuario.ultimo_acceso + 'T00:00:00');
      const diff = Math.floor((hoy.getTime() - ultimoAcceso.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    }
    return null;
  }
}
