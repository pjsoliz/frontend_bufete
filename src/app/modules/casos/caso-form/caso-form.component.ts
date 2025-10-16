import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CasoService } from '../../../core/services/caso.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-caso-form',
  templateUrl: './caso-form.component.html',
  styleUrls: ['./caso-form.component.css']
})
export class CasoFormComponent implements OnInit {
  casoForm!: FormGroup;
  loading = false;
  isEditMode = false;
  casoId: number | null = null;
  errorMessage = '';
  successMessage = '';

  tiposCaso = [
    { value: 'CIVIL', label: 'Civil' },
    { value: 'PENAL', label: 'Penal' },
    { value: 'LABORAL', label: 'Laboral' },
    { value: 'FAMILIA', label: 'Familia' },
    { value: 'COMERCIAL', label: 'Comercial' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' },
    { value: 'TRIBUTARIO', label: 'Tributario' },
    { value: 'OTRO', label: 'Otro' }
  ];

  prioridades = [
    { value: 'BAJA', label: 'Baja' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  estados = [
    { value: 'ABIERTO', label: 'Abierto' },
    { value: 'EN_PROCESO', label: 'En Proceso' },
    { value: 'CERRADO', label: 'Cerrado' },
    { value: 'ARCHIVADO', label: 'Archivado' }
  ];

  constructor(
    private fb: FormBuilder,
    private casoService: CasoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.casoId = +params['id'];
        this.loadCaso(this.casoId);
      }
    });
  }

  initForm(): void {
    const user = this.authService.getCurrentUser();

    this.casoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      tipo_caso: ['CIVIL', Validators.required],
      prioridad: ['MEDIA', Validators.required],
      estado: ['ABIERTO', Validators.required],
      cliente_id: ['', Validators.required],
      abogado_asignado_id: [user?.id || ''],
      monto_reclamado: [''],
      monto_ganado: [''],
      notas_internas: ['']
    });
  }

  loadCaso(id: number): void {
    this.loading = true;
    this.casoService.getCasoById(id).subscribe({
      next: (caso) => {
        this.casoForm.patchValue({
          titulo: caso.titulo,
          descripcion: caso.descripcion,
          tipo_caso: caso.tipo_caso,
          prioridad: caso.prioridad,
          estado: caso.estado,
          cliente_id: caso.cliente.id,
          abogado_asignado_id: caso.abogado_asignado?.id || '',
          monto_reclamado: caso.monto_reclamado || '',
          monto_ganado: caso.monto_ganado || '',
          notas_internas: caso.notas_internas || ''
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el caso';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.casoForm.invalid) {
      this.markFormGroupTouched(this.casoForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.casoForm.value;
    const casoData = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      tipo_caso: formValue.tipo_caso,
      prioridad: formValue.prioridad,
      estado: formValue.estado,
      cliente_id: +formValue.cliente_id,
      abogado_asignado_id: formValue.abogado_asignado_id ? +formValue.abogado_asignado_id : undefined,
      monto_reclamado: formValue.monto_reclamado ? +formValue.monto_reclamado : undefined,
      monto_ganado: formValue.monto_ganado ? +formValue.monto_ganado : undefined,
      notas_internas: formValue.notas_internas || undefined
    };

    if (this.isEditMode && this.casoId) {
      this.casoService.updateCaso(this.casoId, casoData).subscribe({
        next: () => {
          this.successMessage = 'Caso actualizado exitosamente';
          setTimeout(() => this.router.navigate(['/casos']), 1500);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar el caso';
          this.loading = false;
        }
      });
    } else {
      this.casoService.createCaso(casoData).subscribe({
        next: () => {
          this.successMessage = 'Caso creado exitosamente';
          setTimeout(() => this.router.navigate(['/casos']), 1500);
        },
        error: () => {
          this.errorMessage = 'Error al crear el caso';
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/casos']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get titulo() { return this.casoForm.get('titulo'); }
  get descripcion() { return this.casoForm.get('descripcion'); }
  get tipo_caso() { return this.casoForm.get('tipo_caso'); }
  get prioridad() { return this.casoForm.get('prioridad'); }
  get estado() { return this.casoForm.get('estado'); }
  get cliente_id() { return this.casoForm.get('cliente_id'); }
  get abogado_asignado_id() { return this.casoForm.get('abogado_asignado_id'); }
}
