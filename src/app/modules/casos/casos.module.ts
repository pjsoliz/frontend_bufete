import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CasosRoutingModule } from './casos-routing.module';
import { CasosListComponent } from './casos-list/casos-list.component';
import { CasoFormComponent } from './caso-form/caso-form.component';
import { CasoDetalleComponent } from './caso-detalle/caso-detalle.component';
import { LucideAngularModule, FolderOpen, Plus, Briefcase, Clock, Zap, 
  CheckCircle, Search, Activity, Scale, Flag, SearchX, MapPin, User, 
  UserX, Eye, Pencil, Trash2, Calendar } from 'lucide-angular';


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
    CasosRoutingModule,LucideAngularModule.pick({
      FolderOpen, 
      Plus, 
      Briefcase, 
      Clock, 
      Zap, 
      CheckCircle, 
      Search, 
      Activity, 
      Scale, 
      Flag, 
      SearchX, 
      MapPin, 
      User, 
      UserX, 
      Eye, 
      Pencil, 
      Trash2, 
      Calendar 
    })
  ]
})
export class CasosModule { }
