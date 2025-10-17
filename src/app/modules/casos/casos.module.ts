import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CasosRoutingModule } from './casos-routing.module';
import { CasosListComponent } from './casos-list/casos-list.component';
import { CasoFormComponent } from './caso-form/caso-form.component';
import { CasoDetalleComponent } from './caso-detalle/caso-detalle.component';

@NgModule({
  declarations: [
    CasosListComponent,
    CasoFormComponent,
    CasoDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CasosRoutingModule
  ]
})
export class CasosModule { }
