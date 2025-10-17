import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesListComponent } from './reportes-list/reportes-list.component';
import { ReporteCasosComponent } from './reporte-casos/reporte-casos.component';

@NgModule({
  declarations: [
    ReportesListComponent,
    ReporteCasosComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }