import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor() {}

  // ==================== REPORTES DE CASOS ====================
  getReporteCasos(): Observable<any> {
    // Datos mock - después conectarás con el backend
    const data = {
      total: 128,
      por_estado: {
        pendiente: 32,
        en_progreso: 45,
        suspendido: 8,
        cerrado: 43
      },
      por_tipo: {
        laboral: 38,
        civil: 25,
        penal: 20,
        familia: 30,
        comercial: 15
      },
      por_prioridad: {
        baja: 40,
        media: 58,
        alta: 30
      },
      casos_por_mes: [
        { mes: 'Ene', cantidad: 8 },
        { mes: 'Feb', cantidad: 12 },
        { mes: 'Mar', cantidad: 15 },
        { mes: 'Abr', cantidad: 18 },
        { mes: 'May', cantidad: 22 },
        { mes: 'Jun', cantidad: 25 },
        { mes: 'Jul', cantidad: 20 },
        { mes: 'Ago', cantidad: 17 },
        { mes: 'Sep', cantidad: 19 },
        { mes: 'Oct', cantidad: 23 }
      ]
    };

    return of(data).pipe(delay(500));
  }

  // ==================== REPORTES DE CITAS ====================
  getReporteCitas(): Observable<any> {
    const data = {
      total: 245,
      por_estado: {
        programada: 85,
        confirmada: 95,
        completada: 50,
        cancelada: 15
      },
      citas_por_mes: [
        { mes: 'Ene', cantidad: 18 },
        { mes: 'Feb', cantidad: 22 },
        { mes: 'Mar', cantidad: 25 },
        { mes: 'Abr', cantidad: 28 },
        { mes: 'May', cantidad: 30 },
        { mes: 'Jun', cantidad: 32 },
        { mes: 'Jul', cantidad: 28 },
        { mes: 'Ago', cantidad: 24 },
        { mes: 'Sep', cantidad: 26 },
        { mes: 'Oct', cantidad: 32 }
      ],
      por_abogado: [
        { nombre: 'Dr. Juan Pérez', cantidad: 45 },
        { nombre: 'Dra. María López', cantidad: 38 },
        { nombre: 'Dr. Carlos Ruiz', cantidad: 42 },
        { nombre: 'Dra. Ana Torres', cantidad: 35 },
        { nombre: 'Dr. Luis Gómez', cantidad: 40 }
      ],
      tasa_asistencia: 85.5
    };

    return of(data).pipe(delay(500));
  }

  // ==================== REPORTES DE CLIENTES ====================
  getReporteClientes(): Observable<any> {
    const data = {
      total: 95,
      activos: 78,
      inactivos: 17,
      nuevos_mes: 12,
      clientes_por_mes: [
        { mes: 'Ene', cantidad: 5 },
        { mes: 'Feb', cantidad: 8 },
        { mes: 'Mar', cantidad: 10 },
        { mes: 'Abr', cantidad: 12 },
        { mes: 'May', cantidad: 15 },
        { mes: 'Jun', cantidad: 18 },
        { mes: 'Jul', cantidad: 14 },
        { mes: 'Ago', cantidad: 10 },
        { mes: 'Sep', cantidad: 12 },
        { mes: 'Oct', cantidad: 16 }
      ],
      por_tipo_caso: {
        laboral: 28,
        civil: 22,
        penal: 15,
        familia: 20,
        comercial: 10
      },
      satisfaccion: 4.5
    };

    return of(data).pipe(delay(500));
  }

  // ==================== REPORTE GENERAL ====================
  getReporteGeneral(): Observable<any> {
    const data = {
      resumen: {
        total_casos: 128,
        total_citas: 245,
        total_clientes: 95,
        total_abogados: 12
      },
      ingresos_mes: 45000,
      gastos_mes: 28000,
      utilidad_mes: 17000,
      casos_ganados: 38,
      casos_perdidos: 5,
      tasa_exito: 88.4
    };

    return of(data).pipe(delay(500));
  }
}