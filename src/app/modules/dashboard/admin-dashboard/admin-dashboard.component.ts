import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Estadistica {
  titulo: string;
  valor: number;
  icon: string;
  color: string;
  cambio: number;
  tendencia: 'up' | 'down';
}

interface ActividadReciente {
  id: number;
  tipo: 'caso' | 'cita' | 'cliente' | 'usuario';
  titulo: string;
  descripcion: string;
  fecha: string;
  icon: string;
  color: string;
}

interface CitaProxima {
  id: number;
  titulo: string;
  cliente: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class DashboardAdminComponent implements OnInit {

  estadisticas: Estadistica[] = [
    {
      titulo: 'Casos Activos',
      valor: 128,
      icon: '📁',
      color: 'blue',
      cambio: 12,
      tendencia: 'up'
    },
    {
      titulo: 'Citas Hoy',
      valor: 8,
      icon: '📅',
      color: 'orange',
      cambio: -2,
      tendencia: 'down'
    },
    {
      titulo: 'Clientes Activos',
      valor: 45,
      icon: '👥',
      color: 'green',
      cambio: 5,
      tendencia: 'up'
    },
    {
      titulo: 'Usuarios Sistema',
      valor: 12,
      icon: '👤',
      color: 'purple',
      cambio: 1,
      tendencia: 'up'
    }
  ];

  actividadesRecientes: ActividadReciente[] = [
    {
      id: 1,
      tipo: 'caso',
      titulo: 'Nuevo Caso Creado',
      descripcion: 'Demanda Laboral - Despido Injustificado',
      fecha: 'Hace 2 horas',
      icon: '📁',
      color: 'blue'
    },
    {
      id: 2,
      tipo: 'cita',
      titulo: 'Cita Confirmada',
      descripcion: 'Consulta con Juan Pérez - 10:00 AM',
      fecha: 'Hace 3 horas',
      icon: '✅',
      color: 'green'
    },
    {
      id: 3,
      tipo: 'cliente',
      titulo: 'Nuevo Cliente Registrado',
      descripcion: 'Sandra Morales - Caso Comercial',
      fecha: 'Hace 5 horas',
      icon: '👤',
      color: 'purple'
    },
    {
      id: 4,
      tipo: 'usuario',
      titulo: 'Usuario Actualizado',
      descripcion: 'Dr. Carlos Méndez - Perfil actualizado',
      fecha: 'Hace 1 día',
      icon: '✏️',
      color: 'orange'
    },
    {
      id: 5,
      tipo: 'caso',
      titulo: 'Caso Cerrado',
      descripcion: 'Reclamo Laboral - Salarios Impagos',
      fecha: 'Hace 1 día',
      icon: '✔️',
      color: 'green'
    }
  ];

  citasProximas: CitaProxima[] = [
    {
      id: 1,
      titulo: 'Consulta Inicial',
      cliente: 'Juan Pérez',
      fecha: '2025-10-20',
      hora: '09:00',
      tipo: 'Consulta',
      estado: 'confirmada'
    },
    {
      id: 2,
      titulo: 'Audiencia de Divorcio',
      cliente: 'María López',
      fecha: '2025-10-22',
      hora: '10:30',
      tipo: 'Audiencia',
      estado: 'confirmada'
    },
    {
      id: 3,
      titulo: 'Firma de Documentos',
      cliente: 'Laura Martínez',
      fecha: '2025-10-25',
      hora: '11:00',
      tipo: 'Firma',
      estado: 'pendiente'
    },
    {
      id: 4,
      titulo: 'Audiencia Preliminar',
      cliente: 'Carmen Ruiz',
      fecha: '2025-10-28',
      hora: '09:30',
      tipo: 'Audiencia',
      estado: 'pendiente'
    }
  ];

  // Datos para gráficas
  casosPorMes = [
    { mes: 'Ene', casos: 45 },
    { mes: 'Feb', casos: 52 },
    { mes: 'Mar', casos: 48 },
    { mes: 'Abr', casos: 61 },
    { mes: 'May', casos: 55 },
    { mes: 'Jun', casos: 67 },
    { mes: 'Jul', casos: 71 },
    { mes: 'Ago', casos: 69 },
    { mes: 'Sep', casos: 75 },
    { mes: 'Oct', casos: 82 }
  ];

  casosPorTipo = [
    { tipo: 'Laboral', cantidad: 45, color: '#3498db' },
    { tipo: 'Civil', cantidad: 32, color: '#9b59b6' },
    { tipo: 'Penal', cantidad: 18, color: '#e74c3c' },
    { tipo: 'Familia', cantidad: 25, color: '#2ecc71' },
    { tipo: 'Comercial', cantidad: 8, color: '#f39c12' }
  ];

  alertas = [
    {
      tipo: 'urgente',
      titulo: '3 Audiencias esta semana',
      descripcion: 'Revisa el calendario de audiencias',
      icon: '⚠️'
    },
    {
      tipo: 'info',
      titulo: '5 Casos pendientes de asignación',
      descripcion: 'Asigna abogados a los casos nuevos',
      icon: 'ℹ️'
    },
    {
      tipo: 'exito',
      titulo: '12 Casos cerrados este mes',
      descripcion: 'Excelente progreso del equipo',
      icon: '✅'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Componente inicializado
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  verCita(id: number): void {
    this.router.navigate(['/citas', id]);
  }

  getMaxCasos(): number {
    return Math.max(...this.casosPorMes.map(c => c.casos));
  }

  getCasosTotal(): number {
    return this.casosPorTipo.reduce((sum, item) => sum + item.cantidad, 0);
  }

  getPorcentaje(cantidad: number): number {
    const total = this.getCasosTotal();
    return Math.round((cantidad / total) * 100);
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  esHoy(fecha: string): boolean {
    const hoy = new Date();
    const fechaCita = new Date(fecha + 'T00:00:00');
    return hoy.toDateString() === fechaCita.toDateString();
  }
  getIconName(emoji: string): string {
    const iconMap: { [key: string]: string } = {
      '📁': 'briefcase',
      '📅': 'calendar',
      '👥': 'users',
      '👤': 'user-check'
    };
    return iconMap[emoji] || 'briefcase';
  }

  /**
   * Obtiene el icono según el tipo de alerta
   */
  getAlertIcon(tipo: string): string {
    const iconMap: { [key: string]: string } = {
      'urgente': 'alert-triangle',
      'info': 'info',
      'exito': 'check-circle'
    };
    return iconMap[tipo] || 'info';
  }

  /**
   * Obtiene el icono según el tipo de actividad
   */
  getActivityIcon(tipo: string): string {
    const iconMap: { [key: string]: string } = {
      'caso': 'briefcase',
      'cita': 'calendar',
      'cliente': 'user-plus',
      'usuario': 'edit-3'
    };
    return iconMap[tipo] || 'activity';
  }
}
