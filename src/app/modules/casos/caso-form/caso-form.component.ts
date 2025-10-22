import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CasosService } from '../../../core/services/casos.service';

@Component({
  selector: 'app-caso-form',
  templateUrl: './caso-form.component.html',
  styleUrls: ['./caso-form.component.css']
})
export class CasoFormComponent implements OnInit {
  casoForm: FormGroup;
  loading = false;
  isEditMode = false;
  casoId: number | null = null;
  errorMessage = '';

  // Opciones para los selects
  tiposCaso = [
    { value: 'civil', label: 'Civil' },
    { value: 'penal', label: 'Penal' },
    { value: 'familia', label: 'Familia' },
  ];

  estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En Progreso' },
    { value: 'suspendido', label: 'Suspendido' },
    { value: 'cerrado', label: 'Cerrado' }
  ];

  prioridades = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' }
  ];

  clientes = [
    'Juan Pérez',
    'María López',
    'Pedro González',
    'Laura Martínez',
    'Roberto Silva',
    'Carmen Ruiz',
    'Jorge Castillo',
    'Sandra Morales'
  ];

  abogados = [
    'Dr. Carlos Méndez',
    'Dra. Ana Torres',
    'Dr. Luis Ramírez',
    'Dra. María González',
    'Dr. Pedro Sánchez'
  ];

  juzgados = [
    'Juzgado Laboral N°1',
    'Juzgado Laboral N°2',
    'Juzgado Laboral N°3',
    'Juzgado Civil N°1',
    'Juzgado Civil N°3',
    'Juzgado Civil N°7',
    'Juzgado Penal N°2',
    'Juzgado Penal N°4',
    'Juzgado de Familia N°2',
    'Juzgado de Familia N°5',
    'Juzgado Comercial N°4'
  ];

  constructor(
    private fb: FormBuilder,
    private casosService: CasosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.casoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      tipo: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      prioridad: ['media', Validators.required],
      cliente: ['', Validators.required],
      abogado: [''],
      fecha_inicio: ['', Validators.required],
      fecha_cierre: [''],
      monto_reclamado: [''],
      monto_ganado: [''],
      juzgado: [''],
      numero_expediente: [''],
      notas: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.casoId = parseInt(id);
      this.cargarCaso(this.casoId);
    } else {
      // Establecer fecha de inicio por defecto
      const hoy = new Date().toISOString().split('T')[0];
      this.casoForm.patchValue({ fecha_inicio: hoy });
    }
  }

  cargarCaso(id: number): void {
    this.loading = true;
    this.casosService.getCasoById(id).subscribe({
      next: (caso) => {
        if (caso) {
          this.casoForm.patchValue({
            titulo: caso.titulo,
            descripcion: caso.descripcion,
            tipo: caso.tipo,
            estado: caso.estado,
            prioridad: caso.prioridad,
            cliente: caso.cliente,
            abogado: caso.abogado || '',
            fecha_inicio: caso.fecha_inicio,
            fecha_cierre: caso.fecha_cierre || '',
            monto_reclamado: caso.monto_reclamado || '',
            monto_ganado: caso.monto_ganado || '',
            juzgado: caso.juzgado || '',
            numero_expediente: caso.numero_expediente || '',
            notas: caso.notas || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar caso:', error);
        this.errorMessage = 'Error al cargar el caso';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.casoForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const casoData = this.casoForm.value;

      if (this.isEditMode && this.casoId) {
        // Actualizar caso existente
        this.casosService.updateCaso(this.casoId, casoData).subscribe({
          next: () => {
            this.loading = false;
            alert('Caso actualizado exitosamente');
            this.router.navigate(['/casos']);
          },
          error: (error) => {
            console.error('Error al actualizar caso:', error);
            this.errorMessage = 'Error al actualizar el caso';
            this.loading = false;
          }
        });
      } else {
        // Crear nuevo caso
        this.casosService.createCaso(casoData).subscribe({
          next: () => {
            this.loading = false;
            alert('Caso creado exitosamente');
            this.router.navigate(['/casos']);
          },
          error: (error) => {
            console.error('Error al crear caso:', error);
            this.errorMessage = 'Error al crear el caso';
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.casoForm.controls).forEach(key => {
      this.casoForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/casos']);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.casoForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }
}
