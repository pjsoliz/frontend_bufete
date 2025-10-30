import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesListComponent } from './reportes-list/reportes-list.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportesListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'abogado', 'asistente_legal'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }