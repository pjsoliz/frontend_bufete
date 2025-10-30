import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

// Importar Lucide Icons
import {
  LucideAngularModule,
  LayoutDashboard, Calendar, Briefcase, Users, UserCheck,
  TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle,
  BarChart2, FolderOpen, Activity, CalendarDays, Clock,
  UserPlus, Edit3, FileText, Scale, ClipboardList, ArrowRight
} from 'lucide-angular';

// Componentes
import { DashboardAdminComponent } from './admin-dashboard/admin-dashboard.component';
import { AsistenteDashboardComponent } from './asistente-dashboard/asistente-dashboard.component';

@NgModule({
  declarations: [
    DashboardAdminComponent,
    AsistenteDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LucideAngularModule.pick({
      LayoutDashboard,
      Calendar,
      Briefcase,
      Users,
      UserCheck,
      TrendingUp,
      TrendingDown,
      AlertTriangle,
      Info,
      CheckCircle,
      BarChart2,
      FolderOpen,
      Activity,
      CalendarDays,
      Clock,
      UserPlus,
      Edit3,
      FileText,
      Scale,
      ClipboardList,
      ArrowRight
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
