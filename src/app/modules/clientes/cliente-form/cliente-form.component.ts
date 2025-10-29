import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService, ClienteCreate } from '../../../core/services/clientes.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  loading = false;
  isEditMode = false;
  clienteId: string | null = null;
  errorMessage = '';

  // Plataformas disponibles
  plataformas = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'panel_web', label: 'Panel Web' }
  ];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.email]], // Email es opcional
      plataforma: ['panel_web', Validators.required],
      userIdPlataforma: [''] // Opcional: para ID de Telegram/WhatsApp
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clienteId = id;
      this.cargarCliente(id);
    }
  }

  cargarCliente(id: string): void {
    this.loading = true;
    this.clientesService.getClienteById(id).subscribe({
      next: (cliente) => {
        if (cliente) {
          this.clienteForm.patchValue({
            nombreCompleto: cliente.nombreCompleto,
            telefono: cliente.telefono,
            email: cliente.email || '',
            plataforma: cliente.plataforma || 'panel_web',
            userIdPlataforma: cliente.userIdPlataforma || ''
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

      // Preparar datos: eliminar campos vacíos opcionales
      const formValue = this.clienteForm.value;
      const clienteData: ClienteCreate = {
        nombreCompleto: formValue.nombreCompleto.trim(),
        telefono: formValue.telefono.trim(),
        plataforma: formValue.plataforma
      };

      // Agregar email solo si tiene valor
      if (formValue.email && formValue.email.trim()) {
        clienteData.email = formValue.email.trim();
      }

      // Agregar userIdPlataforma solo si tiene valor
      if (formValue.userIdPlataforma && formValue.userIdPlataforma.trim()) {
        clienteData.userIdPlataforma = formValue.userIdPlataforma.trim();
      }

      if (this.isEditMode && this.clienteId) {
        // Actualizar cliente existente
        this.clientesService.updateCliente(this.clienteId, clienteData).subscribe({
          next: (response) => {
            console.log('Cliente actualizado:', response);
            this.loading = false;
            alert('Cliente actualizado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            this.errorMessage = this.getErrorMessageFromResponse(error);
            this.loading = false;
          }
        });
      } else {
        // Crear nuevo cliente
        this.clientesService.createCliente(clienteData).subscribe({
          next: (response) => {
            console.log('Cliente creado:', response);
            this.loading = false;
            alert('Cliente creado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            this.errorMessage = this.getErrorMessageFromResponse(error);
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      this.marcarCamposComoTocados();
    }
  }

  getErrorMessageFromResponse(error: any): string {
    if (error.status === 400) {
      if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          return error.error.message.join(', ');
        }
        return error.error.message;
      }
      return 'Datos inválidos. Verifica los campos del formulario.';
    } else if (error.status === 409) {
      return 'Ya existe un cliente con ese teléfono o email.';
    } else if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    return 'Error al guardar el cliente. Intenta de nuevo.';
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (this.clienteForm.dirty) {
      if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
        this.router.navigate(['/clientes']);
      }
    } else {
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
      if (fieldName === 'telefono') {
        return 'El teléfono debe tener 8 dígitos';
      }
      return 'Formato inválido';
    }
    
    return '';
  }

  // Método auxiliar para mostrar info sobre el campo userIdPlataforma
  getMensajeAyudaPlataforma(): string {
    const plataforma = this.clienteForm.get('plataforma')?.value;
    
    if (plataforma === 'whatsapp') {
      return 'Número de WhatsApp con código de país (ej: 59171234567)';
    } else if (plataforma === 'telegram') {
      return 'ID de usuario de Telegram (opcional)';
    } else {
      return 'No requerido para Panel Web';
    }
  }
}