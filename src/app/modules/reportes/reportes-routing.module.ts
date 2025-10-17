import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesListComponent } from './reportes-list/reportes-list.component';
import { ReporteCasosComponent } from './reporte-casos/reporte-casos.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }