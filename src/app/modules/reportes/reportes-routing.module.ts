import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesListComponent } from './reportes-list/reportes-list.component';
import { ReporteCasosComponent } from './reporte-casos/reporte-casos.component';
import { ReporteCitasComponent } from './reporte-citas/reporte-citas.component';
import { ReporteClientesComponent } from './reporte-clientes/reporte-clientes.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportesListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'casos',
    component: ReporteCasosComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'citas',
    component: ReporteCitasComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'clientes',
    component: ReporteClientesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'general',
    component: ReporteGeneralComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }