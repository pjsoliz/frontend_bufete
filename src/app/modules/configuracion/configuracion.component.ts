import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  currentUser: any = null;
  
  // Modales
  mostrarModalPerfil = false;
  mostrarModalSeguridad = false;
  
  // Formulario de Perfil
  perfilForm = {
    nombreCompleto: '',
    email: ''
  };
  
  // Formulario de Seguridad
  seguridadForm = {
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmar: ''
  };
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual(): void {
    this.currentUser = this.authService.getUser();
    if (this.currentUser) {
      this.perfilForm.nombreCompleto = this.currentUser.nombreCompleto || '';
      this.perfilForm.email = this.currentUser.email || '';
    }
  }

  // ===== PERFIL DE USUARIO =====
  editarPerfil(): void {
    this.mostrarModalPerfil = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalPerfil(): void {
    this.mostrarModalPerfil = false;
    this.cargarUsuarioActual(); // Recargar datos originales
  }

  guardarPerfil(): void {
    if (!this.perfilForm.nombreCompleto || !this.perfilForm.email) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const userId = this.authService.getUserId();
    
    this.usuariosService.updateUsuario(userId!, {
      nombreCompleto: this.perfilForm.nombreCompleto,
      email: this.perfilForm.email
    }).subscribe({
      next: (response) => {
        // Actualizar usuario en localStorage
        const updatedUser = { ...this.currentUser, ...response };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        this.currentUser = updatedUser;
        this.successMessage = 'Perfil actualizado exitosamente';
        this.loading = false;
        
        setTimeout(() => {
          this.cerrarModalPerfil();
        }, 1500);
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.errorMessage = 'Error al actualizar el perfil. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  // ===== SEGURIDAD =====
  cambiarContrasena(): void {
    this.mostrarModalSeguridad = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.seguridadForm = {
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirmar: ''
    };
  }

  cerrarModalSeguridad(): void {
    this.mostrarModalSeguridad = false;
    this.seguridadForm = {
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirmar: ''
    };
  }

  guardarContrasena(): void {
    if (!this.seguridadForm.passwordActual || !this.seguridadForm.passwordNuevo || !this.seguridadForm.passwordConfirmar) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.seguridadForm.passwordNuevo.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.seguridadForm.passwordNuevo !== this.seguridadForm.passwordConfirmar) {
      this.errorMessage = 'Las contraseñas nuevas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const userId = this.authService.getUserId();
    
    this.usuariosService.updateUsuario(userId!, {
      password: this.seguridadForm.passwordNuevo
    }).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada exitosamente';
        this.loading = false;
        
        setTimeout(() => {
          this.cerrarModalSeguridad();
        }, 1500);
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.errorMessage = 'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.';
        this.loading = false;
      }
    });
  }
}