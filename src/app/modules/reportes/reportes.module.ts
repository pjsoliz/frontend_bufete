import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesListComponent } from './reportes-list/reportes-list.component';
import { ReporteCasosComponent } from './reporte-casos/reporte-casos.component';
import { ReporteCitasComponent } from './reporte-citas/reporte-citas.component';
import { ReporteClientesComponent } from './reporte-clientes/reporte-clientes.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';

@NgModule({
  declarations: [
    ReportesListComponent,
    ReporteCasosComponent,
    ReporteCitasComponent,
    ReporteClientesComponent,
    ReporteGeneralComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }