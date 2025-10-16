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
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Para pruebas sin backend - auto login
    this.loginWithMockData();
  }

  // MÉTODO TEMPORAL PARA PRUEBAS SIN BACKEND
  loginWithMockData(): void {
    // Simular usuario logueado
    const mockUser = {
      id: 1,
      email: 'admin@genesis.com',
      nombre: 'Admin',
      apellido: 'Genesis',
      telefono: '555-0100',
      rol: 'ADMIN' as 'ADMIN',
      estado: true,
      fecha_registro: new Date().toISOString()
    };

    // Guardar en localStorage
    localStorage.setItem('access_token', 'mock_token_123');
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    // Redirigir automáticamente
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 500);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    // Con backend real, descomentar esto:
    /*
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
    */

    // Para pruebas sin backend
    this.loginWithMockData();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}