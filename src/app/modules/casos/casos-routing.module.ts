import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasosListComponent } from './casos-list/casos-list.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: CasosListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'abogado', 'asistente_legal'] }
  }
  // Aquí podrás agregar después:
  // { path: 'nuevo', component: CasoFormComponent },
  // { path: ':id', component: CasoDetailComponent },
  // { path: ':id/editar', component: CasoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosRoutingModule { }