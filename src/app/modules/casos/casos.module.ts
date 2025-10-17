import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CasosRoutingModule } from './casos-routing.module';
import { CasosListComponent } from './casos-list/casos-list.component';
import { CasoDetailComponent } from './caso-detail/caso-detail.component';
import { CasoFormComponent } from './caso-form/caso-form.component';

const routes: Routes = [
  {
    path: '',
    component: CasosListComponent
  },
  {
    path: 'nuevo',
    component: CasoFormComponent
  },
  {
    path: 'editar/:id',
    component: CasoFormComponent
  },
  {
    path: ':id',
    component: CasoDetailComponent
  }
];

@NgModule({
  declarations: [
    CasosListComponent,
    CasoDetailComponent,
    CasoFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CasosRoutingModule,
    RouterModule.forChild(routes)
  ]
})
export class CasosModule { }
