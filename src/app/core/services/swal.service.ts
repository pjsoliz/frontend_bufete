import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SwalService {

  private baseConfig = {
    background: '#1a1a2e',
    color: '#e8c97e',
    confirmButtonColor: '#c9a84c',
    cancelButtonColor: '#1e3a5f',
    iconColor: '#c9a84c',
  };

  /** Alerta de éxito */
  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Aceptar',
      iconColor: '#4caf50',
    });
  }

  /** Alerta de error */
  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Cerrar',
      iconColor: '#e57373',
    });
  }

  /** Alerta de advertencia */
  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'Aceptar',
      iconColor: '#ffb74d',
    });
  }

  /** Alerta de información */
  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'info',
      title,
      text,
      confirmButtonText: 'Aceptar',
    });
  }

  /** Confirmación (devuelve true si el usuario confirma) */
  confirm(title: string, text?: string, confirmText = 'Sí, continuar'): Promise<boolean> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
      iconColor: '#e8c97e',
    }).then(result => result.isConfirmed);
  }

  /** Confirmación de eliminación (botón rojo) */
  confirmDelete(title: string, text?: string): Promise<boolean> {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#d32f2f',
      cancelButtonText: 'Cancelar',
      iconColor: '#e57373',
    }).then(result => result.isConfirmed);
  }

  /** Toast pequeño (esquina superior derecha) */
  toast(title: string, icon: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2800,
      timerProgressBar: true,
      background: '#1a1a2e',
      color: '#e8c97e',
      iconColor: icon === 'success' ? '#4caf50' : icon === 'error' ? '#e57373' : '#e8c97e',
    });
    Toast.fire({ icon, title });
  }
}
