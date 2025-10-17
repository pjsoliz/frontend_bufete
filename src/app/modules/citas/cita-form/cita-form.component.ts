import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitasService } from '../../../core/services/citas.service';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {
  citaForm: FormGroup;
  loading = false;
  isEditMode = false;
  citaId: number | null = null;
  errorMessage = '';

  // Opciones para los selects
  tiposCita = [
    'Consulta Inicial',
    'Seguimiento',
    'Audiencia Preparatoria',
    'Audiencia',
    'Reunión de Estrategia',
    'Firma de Documentos',
    'Otro'
  ];

  abogados = [
    'Dr. Carlos Méndez',
    'Dra. Ana Torres',
    'Dr. Luis Ramírez',
    'Dra. María González',
    'Dr. Pedro Sánchez'
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

  duraciones = [
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' },
    { value: 180, label: '3 horas' }
  ];

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cliente: ['', Validators.required],
      abogado: ['', Validators.required],
      tipo: ['', Validators.required],
      duracion: [60, Validators.required],
      estado: ['programada'],
      notas: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.citaId = parseInt(id);
      this.cargarCita(this.citaId);
    }

    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (fechaInput) {
      fechaInput.min = hoy;
    }
  }

  cargarCita(id: number): void {
    this.loading = true;
    this.citasService.getCitaById(id).subscribe({
      next: (cita) => {
        if (cita) {
          this.citaForm.patchValue({
            fecha: cita.fecha,
            hora: cita.hora,
            cliente: cita.cliente,
            abogado: cita.abogado,
            tipo: cita.tipo,
            duracion: cita.duracion,
            estado: cita.estado,
            notas: cita.notas || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cita:', error);
        this.errorMessage = 'Error al cargar la cita';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const citaData = this.citaForm.value;

      if (this.isEditMode && this.citaId) {
        // Actualizar cita existente
        this.citasService.updateCita(this.citaId, citaData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cita actualizada exitosamente');
            this.router.navigate(['/citas']);
          },
          error: (error) => {
            console.error('Error al actualizar cita:', error);
            this.errorMessage = 'Error al actualizar la cita';
            this.loading = false;
          }
        });
      } else {
        // Crear nueva cita
        this.citasService.createCita(citaData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cita creada exitosamente');
            this.router.navigate(['/citas']);
          },
          error: (error) => {
            console.error('Error al crear cita:', error);
            this.errorMessage = 'Error al crear la cita';
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
    }
  }

  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/citas']);
    }
  }
}