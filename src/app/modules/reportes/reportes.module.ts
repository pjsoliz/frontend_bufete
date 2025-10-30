import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesRoutingModule } from './reportes-routing.module';

// Componente único
import { ReportesListComponent } from './reportes-list/reportes-list.component';

// Lucide Angular
import { 
  LucideAngularModule,
  BarChart3,
  Calendar,
  Briefcase,
  Users,
  Scale,
  CalendarCheck,
  UserCheck,
  Trophy,
  Award,
  PieChart,
  List,
  RefreshCw,
  Inbox,
  MapPin
} from 'lucide-angular';

@NgModule({
  declarations: [
    ReportesListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,  // ← Para ngModel en los filtros
    ReportesRoutingModule,
    LucideAngularModule.pick({
      BarChart3,
      Calendar,
      Briefcase,
      Users,
      Scale,
      CalendarCheck,
      UserCheck,
      Trophy,
      Award,
      PieChart,
      List,
      RefreshCw,
      Inbox,
      MapPin
    })
  ]
})
export class ReportesModule { }