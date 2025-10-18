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
  usuarioId: number | null = null;
  errorMessage = '';

  roles = [
    { value: 'administrador', label: 'Administrador', icon: '👑' },
    { value: 'abogado', label: 'Abogado', icon: '⚖️' },
    { value: 'asistente_legal', label: 'Asistente Legal', icon: '📋' }
  ];

  especialidades = [
    'Derecho Laboral',
    'Derecho Civil',
    'Derecho Penal',
    'Derecho de Familia',
    'Derecho Comercial',
    'Derecho Tributario',
    'Derecho Administrativo',
    'Derecho Constitucional'
  ];

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['abogado', Validators.required],
      estado: ['activo', Validators.required],
      telefono: ['', [Validators.pattern(/^\+?[0-9\-\s]+$/)]],
      especialidad: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usuarioId = parseInt(id);
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.cargarUsuario(this.usuarioId);
    }
  }

  cargarUsuario(id: number): void {
    this.loading = true;
    this.usuariosService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            username: usuario.username,
            rol: usuario.rol,
            estado: usuario.estado,
            telefono: usuario.telefono || '',
            especialidad: usuario.especialidad || ''
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
            this.errorMessage = 'Error al actualizar el usuario';
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
            this.errorMessage = 'Error al crear el usuario';
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      this.usuarioForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/usuarios']);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.usuarioForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }

  onRolChange(): void {
    const rol = this.usuarioForm.get('rol')?.value;
    const especialidadControl = this.usuarioForm.get('especialidad');

    if (rol === 'abogado') {
      especialidadControl?.setValidators([Validators.required]);
    } else {
      especialidadControl?.clearValidators();
      especialidadControl?.setValue('');
    }
    especialidadControl?.updateValueAndValidity();
  }
}
