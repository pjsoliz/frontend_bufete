import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './admin-dashboard/admin-dashboard.component';
import { AbogadoDashboardComponent } from './abogado-dashboard/abogado-dashboard.component';
import { AsistenteDashboardComponent } from './asistente-dashboard/asistente-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'asistente',
    component: AsistenteDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['asistente_legal'] }
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
