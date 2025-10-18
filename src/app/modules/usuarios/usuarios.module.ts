import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';

@NgModule({
  declarations: [
    UsuariosListComponent,
    UsuarioFormComponent,
    UsuarioDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
