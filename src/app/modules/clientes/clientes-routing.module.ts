import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'asistente_legal'] }
  },
  {
    path: 'nuevo',
    component: ClienteFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'asistente_legal'] }
  },
  {
    path: 'editar/:id',
    component: ClienteFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'asistente_legal'] }
  },
  {
    path: ':id',
    component: ClienteDetalleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'asistente_legal'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
