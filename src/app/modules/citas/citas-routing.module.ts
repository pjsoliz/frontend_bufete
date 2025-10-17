import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasListComponent } from './citas-list/citas-list.component';
import { CitaFormComponent } from './cita-form/cita-form.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: CitasListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'nueva',
    component: CitaFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'editar/:id',
    component: CitaFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }