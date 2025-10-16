import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {
  citaForm!: FormGroup;
  loading = false;
  isEditMode = false;
  citaId: number | null = null;
  errorMessage = '';
  successMessage = '';

  tiposCita = [
    { value: 'CONSULTA', label: 'Consulta Inicial' },
    { value: 'SEGUIMIENTO', label: 'Seguimiento' },
    { value: 'AUDIENCIA', label: 'Audiencia' },
    { value: 'FIRMA', label: 'Firma de Documentos' }
  ];

  modalidades = [
    { value: 'PRESENCIAL', label: 'Presencial' },
    { value: 'VIRTUAL', label: 'Virtual' },
    { value: 'TELEFONICA', label: 'Telefónica' }
  ];

  duraciones = [
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' }
  ];

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si es modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.citaId = +params['id'];
        this.loadCita(this.citaId);
      }
    });
  }

  initForm(): void {
    const user = this.authService.getCurrentUser();
    
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      duracion_minutos: [60, Validators.required],
      tipo_cita: ['CONSULTA', Validators.required],
      modalidad: ['PRESENCIAL', Validators.required],
      cliente_id: ['', Validators.required],
      abogado_id: [user?.id || '', Validators.required],
      caso_id: [''],
      ubicacion: [''],
      link_virtual: [''],
      notas: ['']
    });

    // Validación condicional según modalidad
    this.citaForm.get('modalidad')?.valueChanges.subscribe(modalidad => {
      if (modalidad === 'PRESENCIAL') {
        this.citaForm.get('ubicacion')?.setValidators(Validators.required);
        this.citaForm.get('link_virtual')?.clearValidators();
      } else if (modalidad === 'VIRTUAL') {
        this.citaForm.get('link_virtual')?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
        this.citaForm.get('ubicacion')?.clearValidators();
      } else {
        this.citaForm.get('ubicacion')?.clearValidators();
        this.citaForm.get('link_virtual')?.clearValidators();
      }
      this.citaForm.get('ubicacion')?.updateValueAndValidity();
      this.citaForm.get('link_virtual')?.updateValueAndValidity();
    });
  }

  loadCita(id: number): void {
    this.loading = true;
    this.citaService.getCitaById(id).subscribe({
      next: (cita) => {
        const fechaHora = new Date(cita.fecha_hora);
        const fecha = fechaHora.toISOString().split('T')[0];
        const hora = fechaHora.toTimeString().slice(0, 5);

        this.citaForm.patchValue({
          fecha: fecha,
          hora: hora,
          duracion_minutos: cita.duracion_minutos,
          tipo_cita: cita.tipo_cita,
          modalidad: cita.modalidad,
          cliente_id: cita.cliente.id,
          abogado_id: cita.abogado.id,
          caso_id: cita.caso?.id || '',
          ubicacion: cita.ubicacion || '',
          link_virtual: cita.link_virtual || '',
          notas: cita.notas || ''
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar la cita';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.citaForm.invalid) {
      this.markFormGroupTouched(this.citaForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.citaForm.value;
    const fecha_hora = `${formValue.fecha}T${formValue.hora}:00`;

    const citaData = {
      ...formValue,
      fecha_hora,
      cliente_id: +formValue.cliente_id,
      abogado_id: +formValue.abogado_id,
      caso_id: formValue.caso_id ? +formValue.caso_id : undefined
    };

    delete citaData.fecha;
    delete citaData.hora;

    if (this.isEditMode && this.citaId) {
      this.citaService.updateCita(this.citaId, citaData).subscribe({
        next: () => {
          this.successMessage = 'Cita actualizada exitosamente';
          setTimeout(() => this.router.navigate(['/citas']), 1500);
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar la cita';
          this.loading = false;
        }
      });
    } else {
      this.citaService.createCita(citaData).subscribe({
        next: () => {
          this.successMessage = 'Cita creada exitosamente';
          setTimeout(() => this.router.navigate(['/citas']), 1500);
        },
        error: (error) => {
          this.errorMessage = 'Error al crear la cita';
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/citas']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validación
  get fecha() { return this.citaForm.get('fecha'); }
  get hora() { return this.citaForm.get('hora'); }
  get duracion_minutos() { return this.citaForm.get('duracion_minutos'); }
  get tipo_cita() { return this.citaForm.get('tipo_cita'); }
  get modalidad() { return this.citaForm.get('modalidad'); }
  get cliente_id() { return this.citaForm.get('cliente_id'); }
  get abogado_id() { return this.citaForm.get('abogado_id'); }
  get ubicacion() { return this.citaForm.get('ubicacion'); }
  get link_virtual() { return this.citaForm.get('link_virtual'); }
}