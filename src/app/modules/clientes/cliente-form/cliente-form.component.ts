import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  loading = false;
  isEditMode = false;
  clienteId: number | null = null;
  errorMessage = '';
  provincias = [
    'Cercado',
    'Bolívar',
    'Sacaba',
    'Quillacollo',
    'Chapare',
    'Campero',
    'Arani'
  ];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9\-\s]+$/)]],
      tipo_documento: ['cedula', Validators.required],
      documento_identidad: ['', [Validators.required, Validators.minLength(10)]],
      fecha_nacimiento: [''],
      direccion: [''],
      ciudad: [''],
      provincia: [''],
      estado: ['activo', Validators.required],
      notas: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clienteId = parseInt(id);
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: number): void {
    this.loading = true;
    this.clientesService.getClienteById(id).subscribe({
      next: (cliente) => {
        if (cliente) {
          this.clienteForm.patchValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            email: cliente.email,
            telefono: cliente.telefono,
            tipo_documento: cliente.tipo_documento,
            documento_identidad: cliente.documento_identidad,
            fecha_nacimiento: cliente.fecha_nacimiento || '',
            direccion: cliente.direccion || '',
            ciudad: cliente.ciudad || '',
            provincia: cliente.provincia || '',
            estado: cliente.estado,
            notas: cliente.notas || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        this.errorMessage = 'Error al cargar el cliente';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const clienteData = this.clienteForm.value;

      if (this.isEditMode && this.clienteId) {
        // Actualizar cliente existente
        this.clientesService.updateCliente(this.clienteId, clienteData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cliente actualizado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            this.errorMessage = 'Error al actualizar el cliente';
            this.loading = false;
          }
        });
      } else {
        // Crear nuevo cliente
        this.clientesService.createCliente(clienteData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cliente creado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            this.errorMessage = 'Error al crear el cliente';
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
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/clientes']);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.clienteForm.get(fieldName);
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
}
