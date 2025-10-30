import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  // ==================== MÉTODOS REALES DEL BACKEND ====================
  
  getCasosMasSolicitados(mes?: number, anio?: number): Observable<any[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());
    return this.http.get<any[]>(`${this.apiUrl}/casos-mas-solicitados`, { params });
  }

  getAbogadosMasSolicitados(mes?: number, anio?: number): Observable<any[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());
    return this.http.get<any[]>(`${this.apiUrl}/abogados-mas-solicitados`, { params });
  }

  getEstadisticasMes(mes: number, anio: number): Observable<any> {
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('anio', anio.toString());
    return this.http.get<any>(`${this.apiUrl}/estadisticas-mes`, { params });
  }

  getAreasMasSolicitadas(mes?: number, anio?: number): Observable<any[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());
    return this.http.get<any[]>(`${this.apiUrl}/areas-mas-solicitadas`, { params });
  }

  // ==================== MÉTODOS MOCK (Temporal - hasta conectar con backend) ====================

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