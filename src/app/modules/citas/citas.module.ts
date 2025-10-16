import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitasListComponent } from './citas-list/citas-list.component';
import { CitaFormComponent } from './cita-form/cita-form.component';

const routes: Routes = [
  { path: '', component: CitasListComponent },
  { path: 'nueva', component: CitaFormComponent },
  { path: 'editar/:id', component: CitaFormComponent }
];

@NgModule({
  declarations: [
    CitasListComponent,
    CitaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CitasModule { }
