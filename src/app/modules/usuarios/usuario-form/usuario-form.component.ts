import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  isEditMode = false;
  usuarioId: string | null = null;
  errorMessage = '';

  roles = [
    { value: 'admin', label: 'Administrador', icon: '👑' },
    { value: 'asistente_legal', label: 'Asistente Legal', icon: '📋' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['asistente_legal', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usuarioId = id;
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.cargarUsuario(this.usuarioId);
    }
  }

  cargarUsuario(id: string): void {
    this.loading = true;
    this.usuariosService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioForm.patchValue({
            nombreCompleto: usuario.nombreCompleto,
            email: usuario.email,
            rol: usuario.rol
          });
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

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const usuarioData = this.usuarioForm.value;

      // Si es edición y no se cambió password, no enviarlo
      if (this.isEditMode && !usuarioData.password) {
        delete usuarioData.password;
      }

      if (this.isEditMode && this.usuarioId) {
        this.usuariosService.updateUsuario(this.usuarioId, usuarioData).subscribe({
          next: () => {
            this.loading = false;
            alert('Usuario actualizado exitosamente');
            this.router.navigate(['/usuarios']);
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.errorMessage = this.getErrorMessage(error);
            this.loading = false;
          }
        });
      } else {
        this.usuariosService.createUsuario(usuarioData).subscribe({
          next: () => {
            this.loading = false;
            alert('Usuario creado exitosamente');
            this.router.navigate(['/usuarios']);
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.errorMessage = this.getErrorMessage(error);
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      this.marcarCamposComoTocados();
    }
  }

  getErrorMessage(error: any): string {
    if (error.status === 400) {
      if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          return error.error.message.join(', ');
        }
        return error.error.message;
      }
      return 'Datos inválidos. Verifica los campos del formulario.';
    } else if (error.status === 409) {
      return 'El email ya está registrado.';
    } else if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
    return 'Error al guardar el usuario. Intenta de nuevo.';
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      this.usuarioForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (this.usuarioForm.dirty) {
      if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
        this.router.navigate(['/usuarios']);
      }
    } else {
      this.router.navigate(['/usuarios']);
    }
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.usuarioForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
}