import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CitasService } from '../../../core/services/citas.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { ClientesService } from '../../../core/services/clientes.service';
import { AbogadosService } from '../../../core/services/abogados.service';

interface Estadistica {
  titulo: string;
  valor: number;
  icon: string;
  color: string;
  cambio: number;
  tendencia: 'up' | 'down';
}

interface ActividadReciente {
  id: string;
  tipo: 'cita' | 'cliente' | 'usuario';
  titulo: string;
  descripcion: string;
  fecha: string;
  icon: string;
  color: string;
}

interface CitaProxima {
  id: string;
  titulo: string;
  cliente: string;
  fecha: Date;
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

  loading = true;
  isAdmin = false; // ⭐ NUEVO
  
  estadisticas: Estadistica[] = [
    {
      titulo: 'Total Citas',
      valor: 0,
      icon: '📅',
      color: 'blue',
      cambio: 0,
      tendencia: 'up'
    },
    {
      titulo: 'Citas Hoy',
      valor: 0,
      icon: '📅',
      color: 'orange',
      cambio: 0,
      tendencia: 'up'
    },
    {
      titulo: 'Total Clientes',
      valor: 0,
      icon: '👥',
      color: 'green',
      cambio: 0,
      tendencia: 'up'
    },
    {
      titulo: 'Usuarios Sistema',
      valor: 0,
      icon: '👤',
      color: 'purple',
      cambio: 0,
      tendencia: 'up'
    }
  ];

  actividadesRecientes: ActividadReciente[] = [];
  citasProximas: CitaProxima[] = [];

  // Datos para gráficas
  citasPorMes: any[] = [];
  citasPorEstado: any[] = [];
  
  // Resumen del equipo
  totalAdmins = 0;
  totalAsistentes = 0;
  totalAbogados = 0;

  fechaActual = new Date();

  constructor(
    private router: Router,
    private citasService: CitasService,
    private usuariosService: UsuariosService,
    private clientesService: ClientesService,
    private abogadosService: AbogadosService
  ) {}

  ngOnInit(): void {
    // ⭐ Detectar si es admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user.rol === 'admin' || user.rol === 'administrador';
    
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    // ⭐ Si es admin, cargar TODO
    if (this.isAdmin) {
      forkJoin({
        citas: this.citasService.getCitas(),
        usuarios: this.usuariosService.getUsuarios(),
        clientes: this.clientesService.getClientes(),
        abogados: this.abogadosService.getAbogados()
      }).subscribe({
        next: (data) => {
          this.procesarDatosCompletos(data);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.loading = false;
        }
      });
    } else {
      // ⭐ Si es asistente, cargar SOLO citas y clientes
      forkJoin({
        citas: this.citasService.getCitas(),
        clientes: this.clientesService.getClientes()
      }).subscribe({
        next: (data) => {
          this.procesarDatosAsistente(data);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.loading = false;
        }
      });
    }
  }

  // ⭐ Procesar datos completos (ADMIN)
  private procesarDatosCompletos(data: any): void {
    // Procesar citas
    const citas = data.citas;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Estadística: Total de citas
    this.estadisticas[0].valor = citas.length;

    // Estadística: Citas de hoy
    const citasHoy = citas.filter((cita: any) => {
      const fechaCita = new Date(cita.fecha);
      fechaCita.setHours(0, 0, 0, 0);
      return fechaCita.getTime() === hoy.getTime();
    });
    this.estadisticas[1].valor = citasHoy.length;

    // Estadística: Total de clientes
    this.estadisticas[2].valor = data.clientes.length;

    // Estadística: Usuarios del sistema (activos)
    this.estadisticas[3].valor = data.usuarios.filter((u: any) => u.activo).length;

    // Procesar próximas citas
    const ahora = new Date();
    this.citasProximas = citas
      .filter((cita: any) => new Date(cita.fecha) >= ahora && cita.estado !== 'cancelada')
      .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 4)
      .map((cita: any) => ({
        id: cita.id,
        titulo: cita.tipoCita?.nombre || 'Consulta',
        cliente: cita.cliente?.nombreCompleto || 'Cliente no especificado',
        fecha: new Date(cita.fecha),
        hora: cita.hora || '00:00',
        tipo: cita.tipoCita?.nombre || 'Consulta',
        estado: cita.estado
      }));

    // Actividad reciente
    this.actividadesRecientes = citas
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map((cita: any) => ({
        id: cita.id,
        tipo: 'cita',
        titulo: `Cita ${this.getEstadoTexto(cita.estado)}`,
        descripcion: `${cita.cliente?.nombreCompleto || 'Cliente'} - ${cita.descripcion || 'Sin descripción'}`,
        fecha: this.calcularTiempoTranscurrido(cita.createdAt),
        icon: 'calendar',
        color: this.getColorPorEstado(cita.estado)
      }));

    // Citas por mes
    this.calcularCitasPorMes(citas);

    // Citas por estado
    this.calcularCitasPorEstado(citas);

    // Resumen del equipo
    this.totalAdmins = data.usuarios.filter((u: any) => u.rol === 'admin' && u.activo).length;
    this.totalAsistentes = data.usuarios.filter((u: any) => u.rol === 'asistente_legal' && u.activo).length;
    this.totalAbogados = data.abogados.filter((a: any) => a.activo).length;
  }

  // ⭐ Procesar datos limitados (ASISTENTE)
  private procesarDatosAsistente(data: any): void {
    const citas = data.citas;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Solo estadísticas básicas
    this.estadisticas[0].valor = citas.length;
    
    const citasHoy = citas.filter((cita: any) => {
      const fechaCita = new Date(cita.fecha);
      fechaCita.setHours(0, 0, 0, 0);
      return fechaCita.getTime() === hoy.getTime();
    });
    this.estadisticas[1].valor = citasHoy.length;
    this.estadisticas[2].valor = data.clientes.length;
    this.estadisticas[3].valor = 0; // Ocultar usuarios

    // Próximas citas
    const ahora = new Date();
    this.citasProximas = citas
      .filter((cita: any) => new Date(cita.fecha) >= ahora && cita.estado !== 'cancelada')
      .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 4)
      .map((cita: any) => ({
        id: cita.id,
        titulo: cita.tipoCita?.nombre || 'Consulta',
        cliente: cita.cliente?.nombreCompleto || 'Cliente no especificado',
        fecha: new Date(cita.fecha),
        hora: cita.hora || '00:00',
        tipo: cita.tipoCita?.nombre || 'Consulta',
        estado: cita.estado
      }));

    // Actividad reciente
    this.actividadesRecientes = citas
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map((cita: any) => ({
        id: cita.id,
        tipo: 'cita',
        titulo: `Cita ${this.getEstadoTexto(cita.estado)}`,
        descripcion: `${cita.cliente?.nombreCompleto || 'Cliente'} - ${cita.descripcion || 'Sin descripción'}`,
        fecha: this.calcularTiempoTranscurrido(cita.createdAt),
        icon: 'calendar',
        color: this.getColorPorEstado(cita.estado)
      }));

    // Gráficas
    this.calcularCitasPorMes(citas);
    this.calcularCitasPorEstado(citas);

    // No cargar resumen del equipo para asistentes
    this.totalAdmins = 0;
    this.totalAsistentes = 0;
    this.totalAbogados = 0;
  }

  calcularCitasPorMes(citas: any[]): void {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ahora = new Date();
    const citasPorMesMap: { [key: string]: number } = {};

    // Inicializar últimos 10 meses
    for (let i = 9; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      citasPorMesMap[key] = 0;
    }

    // Contar citas por mes
    citas.forEach(cita => {
      const fecha = new Date(cita.fecha);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      if (citasPorMesMap[key] !== undefined) {
        citasPorMesMap[key]++;
      }
    });

    // Convertir a array
    this.citasPorMes = Object.keys(citasPorMesMap).map(key => {
      const [year, month] = key.split('-').map(Number);
      return {
        mes: meses[month],
        citas: citasPorMesMap[key]
      };
    });
  }

  calcularCitasPorEstado(citas: any[]): void {
    const estados = ['pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio'];
    const colores = ['#FFA500', '#007BFF', '#28A745', '#DC3545', '#6C757D'];

    this.citasPorEstado = estados.map((estado, index) => ({
      tipo: this.getEstadoTexto(estado),
      cantidad: citas.filter(c => c.estado === estado).length,
      color: colores[index]
    })).filter(item => item.cantidad > 0);
  }

  getEstadoTexto(estado: string): string {
    const textos: any = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'no_asistio': 'No Asistió'
    };
    return textos[estado] || estado;
  }

  getColorPorEstado(estado: string): string {
    const colores: any = {
      'pendiente': 'orange',
      'confirmada': 'blue',
      'completada': 'green',
      'cancelada': 'red',
      'no_asistio': 'gray'
    };
    return colores[estado] || 'blue';
  }

  calcularTiempoTranscurrido(fecha: any): string {
    if (!fecha) return 'Hace un momento';
    
    const ahora = new Date();
    const fechaObj = new Date(fecha);
    const diff = ahora.getTime() - fechaObj.getTime();
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  verCita(id: string): void {
    this.router.navigate(['/citas', id]);
  }

  getMaxCitas(): number {
    return Math.max(...this.citasPorMes.map(c => c.citas), 1);
  }

  getCitasTotal(): number {
    return this.citasPorEstado.reduce((sum, item) => sum + item.cantidad, 0);
  }

  getPorcentaje(cantidad: number): number {
    const total = this.getCitasTotal();
    if (total === 0) return 0;
    return Math.round((cantidad / total) * 100);
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return hoy.toDateString() === fecha.toDateString();
  }

  getIconName(emoji: string): string {
    const iconMap: { [key: string]: string } = {
      '📁': 'briefcase',
      '📅': 'calendar',
      '👥': 'users',
      '👤': 'user-check'
    };
    return iconMap[emoji] || 'calendar';
  }

  getActivityIcon(tipo: string): string {
    const iconMap: { [key: string]: string } = {
      'cita': 'calendar',
      'cliente': 'user-plus',
      'usuario': 'edit-3'
    };
    return iconMap[tipo] || 'activity';
  }
}