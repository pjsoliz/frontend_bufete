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
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      this.redirectByRole(userRole);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          const userRole = this.authService.getUserRole();
          console.log('Rol del usuario:', userRole);

          this.redirectByRole(userRole);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.errorMessage = error.error?.message || 'Usuario o contraseña incorrectos';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete todos los campos';
    }
  }
  llenarCredenciales(usuario: string, password: string): void {
    this.loginForm.patchValue({
      username: usuario,
      password: password
    });
  }

  redirectByRole(role: string | null): void {
    console.log('Redirigiendo por rol:', role);

    switch(role) {
      case 'administrador':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'abogado':
        this.router.navigate(['/dashboard/abogado']);
        break;
      case 'asistente_legal':
        this.router.navigate(['/dashboard/asistente']);
        break;
      default:
        console.log('Rol no reconocido, usando admin');
        this.router.navigate(['/dashboard/admin']);
    }
  }
}
