import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasListComponent } from './citas-list/citas-list.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: CitasListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  }
  // Aquí podrás agregar después:
  // { path: 'nueva', component: CitaFormComponent },
  // { path: ':id/editar', component: CitaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }