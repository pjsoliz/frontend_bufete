import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  
  // ⭐ Variables para recuperar contraseña
  showRecuperarModal = false;
  recuperarEmail = '';
  recuperarLoading = false;
  recuperarError = '';
  recuperarSuccess = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkAutoLogin();
  }

  /**
   * Inicializa el formulario de login
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  /**
   * Verifica si hay una sesión guardada
   */
  private checkAutoLogin(): void {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        remember: true
      });
    }
  }

  /**
   * Toggle para mostrar/ocultar contraseña
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * ⭐ ABRIR MODAL DE RECUPERAR CONTRASEÑA
   */
  abrirRecuperarModal(event: Event): void {
    event.preventDefault();
    this.showRecuperarModal = true;
    this.recuperarEmail = '';
    this.recuperarError = '';
    this.recuperarSuccess = '';
  }

  /**
   * ⭐ CERRAR MODAL DE RECUPERAR CONTRASEÑA
   */
  cerrarRecuperarModal(): void {
    this.showRecuperarModal = false;
    this.recuperarEmail = '';
    this.recuperarError = '';
    this.recuperarSuccess = '';
  }

  /**
   * ⭐ ENVIAR EMAIL DE RECUPERACIÓN
   */
  enviarRecuperacion(): void {
    this.recuperarError = '';
    this.recuperarSuccess = '';

    // Validar email
    if (!this.recuperarEmail) {
      this.recuperarError = 'Debes ingresar un correo electrónico';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.recuperarEmail)) {
      this.recuperarError = 'Ingresa un correo válido';
      return;
    }

    this.recuperarLoading = true;

    this.authService.recuperarContrasena(this.recuperarEmail).subscribe({
      next: (response) => {
        console.log('Email enviado:', response);
        this.recuperarLoading = false;
        this.recuperarSuccess = '¡Correo enviado! Revisa tu bandeja de entrada.';
        
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          this.cerrarRecuperarModal();
        }, 3000);
      },
      error: (error) => {
        console.error('Error al enviar email:', error);
        this.recuperarLoading = false;
        this.recuperarError = error.error?.message || 'No se pudo enviar el correo. Verifica el email ingresado.';
      }
    });
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password, remember } = this.loginForm.value;

    const credentials = {
      email: email,
      password: password
    };

    console.log('Intentando login con:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.successMessage = '¡Inicio de sesión exitoso!';

        // Guardar email si está marcado "Recordar"
        if (remember) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redireccionar después de 500ms
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Obtiene el mensaje de error apropiado
   */
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
    } else if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  }

  /**
   * Marca todos los controles del formulario como touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}