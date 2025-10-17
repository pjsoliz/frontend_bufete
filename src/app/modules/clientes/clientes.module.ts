import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteDetailComponent } from './cliente-detail/cliente-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent
  },
  {
    path: 'nuevo',
    component: ClienteFormComponent
  },
  {
    path: 'editar/:id',
    component: ClienteFormComponent
  },
  {
    path: ':id',
    component: ClienteDetailComponent
  }
];

@NgModule({
  declarations: [
    ClientesListComponent,
    ClienteFormComponent,
    ClienteDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientesRoutingModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientesModule { }
