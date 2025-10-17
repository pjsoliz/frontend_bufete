import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasosListComponent } from './casos-list/casos-list.component';
import { CasoFormComponent } from './caso-form/caso-form.component';
import { CasoDetalleComponent } from './caso-detalle/caso-detalle.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: CasosListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'nuevo',
    component: CasoFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: 'editar/:id',
    component: CasoFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  },
  {
    path: ':id',
    component: CasoDetalleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosRoutingModule { }
