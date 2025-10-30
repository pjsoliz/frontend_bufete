import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'nuevo',
    component: UsuarioFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'editar/:id',
    component: UsuarioFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: ':id',
    component: UsuarioDetalleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
