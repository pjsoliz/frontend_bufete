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

// Interfaces para las listas desplegables
interface Abogado {
  id: string;
  nombreCompleto: string;
}

interface AreaDerecho {
  id: string;
  nombre: string;
}

interface TipoCita {
  id: string;
  nombre: string;
}

interface TipoCaso {
  id: string;
  nombre: string;
}

interface Oficina {
  id: string;
  nombre: string;
}

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

  // Listas cargadas desde el backend
  clientes: Cliente[] = [];
  abogados: Abogado[] = [];
  areasderecho: AreaDerecho[] = [];
  tiposCita: TipoCita[] = [];
  tiposCaso: TipoCaso[] = [];
  oficinas: Oficina[] = [];  // ⭐ NUEVO

  // Opciones de urgencia y origen
  urgencias = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' }
  ];

  origenes = [
    { value: 'panel_web', label: 'Panel Web' },
    { value: 'chatbot', label: 'Chatbot' },
    { value: 'presencial', label: 'Presencial' }
  ];

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private clientesService: ClientesService,
    private abogadosService: AbogadosService,  // ⭐ NUEVO
    private oficinasService: OficinasService,  // ⭐ NUEVO
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      clienteId: ['', Validators.required],
      abogadoId: ['', Validators.required],
      areaDerechoId: ['', Validators.required],
      tipoCitaId: ['', Validators.required],
      tipoCasoId: ['', Validators.required],  // ⭐ AHORA ES OBLIGATORIO
      oficinaId: ['', Validators.required],   // ⭐ NUEVO Y OBLIGATORIO
      descripcion: [''],  // ⭐ CAMBIO: motivo → descripcion (opcional)
      urgencia: ['media', Validators.required],
      origen: ['panel_web', Validators.required],
      notasAdicionales: [''],
      telefonoContacto: ['']  // ⭐ NUEVO (opcional)
    });
  }

  ngOnInit(): void {
    // Cargar todas las listas necesarias
    this.cargarDatos();

    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.citaId = id;
      this.cargarCita(id);
    }
  }

  cargarDatos(): void {
    this.loading = true;

    // Cargar todas las listas en paralelo
    forkJoin({
      clientes: this.clientesService.getClientes(),
      abogados: this.abogadosService.getAbogados(),  // ⭐ USANDO SERVICIO
      oficinas: this.oficinasService.getOficinas(),  // ⭐ NUEVO
      areas: this.http.get<AreaDerecho[]>(`${environment.apiUrl}/areas-derecho`),
      tiposCita: this.http.get<TipoCita[]>(`${environment.apiUrl}/tipos-cita`),
      tiposCaso: this.http.get<TipoCaso[]>(`${environment.apiUrl}/tipos-caso`)
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.abogados = data.abogados;
        this.oficinas = data.oficinas;  // ⭐ NUEVO
        this.areasderecho = data.areas;
        this.tiposCita = data.tiposCita;
        this.tiposCaso = data.tiposCaso;
        this.loading = false;
        console.log('Datos cargados:', data);
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
            tipoCitaId: cita.tipoCita.id,
            tipoCasoId: cita.tipoCaso?.id || '',
            oficinaId: cita.oficina?.id || '',  // ⭐ NUEVO
            descripcion: cita.descripcion || '',  // ⭐ CAMBIO: motivo → descripcion
            urgencia: cita.urgencia,
            origen: cita.origen,
            notasAdicionales: cita.notasAdicionales || '',
            telefonoContacto: cita.telefonoContacto || ''  // ⭐ NUEVO
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

      // Preparar datos para enviar (coincide 100% con el backend)
      const citaData: CitaCreate = {
        fecha: formValue.fecha,
        hora: formValue.hora,
        clienteId: formValue.clienteId,
        abogadoId: formValue.abogadoId,
        areaDerechoId: formValue.areaDerechoId,
        tipoCitaId: formValue.tipoCitaId,
        tipoCasoId: formValue.tipoCasoId,  // ⭐ OBLIGATORIO
        oficinaId: formValue.oficinaId,    // ⭐ OBLIGATORIO
        urgencia: formValue.urgencia,
        origen: formValue.origen
      };

      // Agregar campos opcionales solo si tienen valor
      if (formValue.descripcion && formValue.descripcion.trim()) {
        citaData.descripcion = formValue.descripcion.trim();  // ⭐ CAMBIO: motivo → descripcion
      }

      if (formValue.notasAdicionales && formValue.notasAdicionales.trim()) {
        citaData.notasAdicionales = formValue.notasAdicionales.trim();
      }

      if (formValue.telefonoContacto && formValue.telefonoContacto.trim()) {
        citaData.telefonoContacto = formValue.telefonoContacto.trim();
      }

      if (this.isEditMode && this.citaId) {
        // Actualizar cita existente
        this.citasService.updateCita(this.citaId, citaData).subscribe({
          next: (response) => {
            console.log('Cita actualizada:', response);
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
        // Crear nueva cita
        this.citasService.createCita(citaData).subscribe({
          next: (response) => {
            console.log('Cita creada:', response);
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

  // Formatear fecha para input type="date"
  formatearFechaParaInput(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Obtener fecha mínima (hoy)
  getFechaMinima(): string {
    return new Date().toISOString().split('T')[0];
  }
}