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
      email: ['', [Validators.required]], // Removemos validación de email para aceptar username
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

    // Convertir email a username para el mock
    // Si el usuario ingresa "admin@genesis.com", extraemos "admin"
    const username = email.includes('@') ? email.split('@')[0] : email;

    const credentials = {
      username: username,
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
