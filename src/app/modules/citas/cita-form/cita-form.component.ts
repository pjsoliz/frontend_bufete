import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitasService, CitaCreate } from '../../../core/services/citas.service';
import { ClientesService, Cliente } from '../../../core/services/clientes.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs';
import { AbogadosService } from '../../../core/services/abogados.service';
import { OficinasService } from '../../../core/services/oficinas.service';

interface Abogado { id: string; nombre: string; }
interface AreaDerecho { id: string; nombre: string; }
interface TipoCita { id: string; nombre: string; }
interface TipoCaso { id: string; nombre: string; }
interface Oficina { id: string; nombre: string; }

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {
  citaForm: FormGroup;
  loading = false;
  isEditMode = false;
  citaId: string | null = null;
  errorMessage = '';

  clientes: Cliente[] = [];
  abogados: Abogado[] = [];
  areasderecho: AreaDerecho[] = [];
  tiposCita: TipoCita[] = [];
  tiposCaso: TipoCaso[] = [];
  oficinas: Oficina[] = [];

  urgencias = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' }
  ];

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private clientesService: ClientesService,
    private abogadosService: AbogadosService,
    private oficinasService: OficinasService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', [Validators.required, this.validarDiaLaboral()]],
      hora: ['', [Validators.required, this.validarHorarioPermitido()]],
      clienteId: ['', Validators.required],
      abogadoId: ['', Validators.required],
      areaDerechoId: ['', Validators.required],
      tipoCasoId: ['', Validators.required],
      descripcion: [''],
      urgencia: ['media', Validators.required],
      telefonoContacto: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.citaId = id;
      this.cargarCita(id);
    }
  }

  cargarDatos(): void {
    this.loading = true;
    forkJoin({
      clientes: this.clientesService.getClientes(),
      abogados: this.abogadosService.getAbogados(),
      areas: this.http.get<AreaDerecho[]>(`${environment.apiUrl}/areas-derecho`),
      tiposCaso: this.http.get<TipoCaso[]>(`${environment.apiUrl}/tipos-caso`)
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.abogados = data.abogados;
        this.areasderecho = data.areas;
        this.tiposCaso = data.tiposCaso;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.errorMessage = 'Error al cargar los datos necesarios';
        this.loading = false;
      }
    });
  }

  cargarCita(id: string): void {
    this.loading = true;
    this.citasService.getCitaById(id).subscribe({
      next: (cita) => {
        if (cita) {
          this.citaForm.patchValue({
            fecha: this.formatearFechaParaInput(cita.fecha),
            hora: cita.hora,
            clienteId: cita.cliente.id,
            abogadoId: cita.abogado.id,
            areaDerechoId: cita.areaDerecho.id,
            tipoCasoId: cita.tipoCaso?.id || '',
            descripcion: cita.descripcion || '',
            urgencia: cita.urgencia,
            telefonoContacto: cita.telefonoContacto || ''
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
      const formValue = this.citaForm.value;

      if (this.isEditMode && this.citaId) {
        // ✅ UPDATE: sin clienteId
        const updateData: any = {
          fecha: formValue.fecha,
          hora: formValue.hora,
          abogadoId: formValue.abogadoId,
          areaDerechoId: formValue.areaDerechoId,
          tipoCasoId: formValue.tipoCasoId,
          urgencia: formValue.urgencia
        };
        if (formValue.descripcion?.trim()) {
          updateData.descripcion = formValue.descripcion.trim();
        }
        if (formValue.telefonoContacto?.trim()) {
          updateData.telefonoContacto = formValue.telefonoContacto.trim();
        }

        this.citasService.updateCita(this.citaId, updateData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cita actualizada exitosamente');
            this.router.navigate(['/citas']);
          },
          error: (error) => {
            console.error('Error al actualizar cita:', error);
            this.errorMessage = this.getErrorMessage(error);
            this.loading = false;
          }
        });

      } else {
        // ✅ CREATE: incluye clienteId
        const citaData: any = {
          fecha: formValue.fecha,
          hora: formValue.hora,
          clienteId: formValue.clienteId,
          abogadoId: formValue.abogadoId,
          areaDerechoId: formValue.areaDerechoId,
          tipoCasoId: formValue.tipoCasoId,
          urgencia: formValue.urgencia
        };
        if (formValue.descripcion?.trim()) {
          citaData.descripcion = formValue.descripcion.trim();
        }
        if (formValue.telefonoContacto?.trim()) {
          citaData.telefonoContacto = formValue.telefonoContacto.trim();
        }

        this.citasService.createCita(citaData).subscribe({
          next: () => {
            this.loading = false;
            alert('Cita creada exitosamente');
            this.router.navigate(['/citas']);
          },
          error: (error) => {
            console.error('Error al crear cita:', error);
            this.errorMessage = this.getErrorMessage(error);
            this.loading = false;
          }
        });
      }

    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      this.marcarCamposComoTocados();
    }
  }

  getErrorMessage(error: any): string {
    if (error.status === 400) {
      if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          return error.error.message.join(', ');
        }
        return error.error.message;
      }
      return 'Datos inválidos. Verifica los campos del formulario.';
    } else if (error.status === 409) {
      return 'Ya existe una cita en ese horario.';
    } else if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
    return 'Error al guardar la cita. Intenta de nuevo.';
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.citaForm.controls).forEach(key => {
      this.citaForm.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (this.citaForm.dirty) {
      if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
        this.router.navigate(['/citas']);
      }
    } else {
      this.router.navigate(['/citas']);
    }
  }

  formatearFechaParaInput(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFechaMinima(): string {
    return new Date().toISOString().split('T')[0];
  }

  validarHorarioPermitido() {
    return (control: any) => {
      if (!control.value) return null;
      const horasPermitidas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      return horasPermitidas.includes(control.value) ? null : { horaInvalida: true };
    };
  }

  validarDiaLaboral() {
    return (control: any) => {
      if (!control.value) return null;
      const [year, month, day] = control.value.split('-').map(Number);
      const fecha = new Date(year, month - 1, day);
      const dia = fecha.getDay();
      return (dia === 0 || dia === 6) ? { finDeSemana: true } : null;
    };
  }
}