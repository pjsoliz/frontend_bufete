import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm!: FormGroup;
  loading = false;
  isEditMode = false;
  clienteId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.loadCliente(this.clienteId);
      }
    });
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      direccion: [''],
      ciudad: [''],
      pais: [''],
      dni: ['', [Validators.pattern(/^[A-Z0-9]{5,15}$/)]],
      fecha_nacimiento: [''],
      profesion: [''],
      notas: ['']
    });

    // En modo edición, el email es readonly
    if (this.isEditMode) {
      this.clienteForm.get('email')?.disable();
    }
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getClienteById(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email,
          telefono: cliente.telefono || ''
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el cliente';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.markFormGroupTouched(this.clienteForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const clienteData = {
      ...this.clienteForm.value,
      rol: 'CLIENTE'
    };

    if (this.isEditMode && this.clienteId) {
      this.clienteService.updateCliente(this.clienteId, clienteData).subscribe({
        next: () => {
          this.successMessage = 'Cliente actualizado exitosamente';
          setTimeout(() => this.router.navigate(['/clientes']), 1500);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar el cliente';
          this.loading = false;
        }
      });
    } else {
      this.clienteService.createCliente(clienteData).subscribe({
        next: () => {
          this.successMessage = 'Cliente creado exitosamente';
          setTimeout(() => this.router.navigate(['/clientes']), 1500);
        },
        error: () => {
          this.errorMessage = 'Error al crear el cliente';
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombre() { return this.clienteForm.get('nombre'); }
  get apellido() { return this.clienteForm.get('apellido'); }
  get email() { return this.clienteForm.get('email'); }
  get telefono() { return this.clienteForm.get('telefono'); }
  get dni() { return this.clienteForm.get('dni'); }
}