import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CasosListComponent } from './casos-list/casos-list.component';
import { CasoDetailComponent } from './caso-detail/caso-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CasosListComponent
  },
  {
    path: ':id',
    component: CasoDetailComponent
  }
];

@NgModule({
  declarations: [
    CasosListComponent,
    CasoDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CasosModule { }
