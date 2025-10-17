import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';

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
    component: ClienteDetalleComponent
  }
];

@NgModule({
  declarations: [
    ClientesListComponent,
    ClienteFormComponent,
    ClienteDetalleComponent
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
