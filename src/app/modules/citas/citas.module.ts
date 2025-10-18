import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CitasRoutingModule } from './citas-routing.module';
import { CitasListComponent } from './citas-list/citas-list.component';
import { CitaFormComponent } from './cita-form/cita-form.component';
import { CitaDetalleComponent } from './cita-detalle/cita-detalle.component';

@NgModule({
  declarations: [
    CitasListComponent,
    CitaFormComponent,
    CitaDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CitasRoutingModule
  ]
})
export class CitasModule { }
