import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAdminComponent } from './admin-dashboard/admin-dashboard.component';
import { AbogadoDashboardComponent } from './abogado-dashboard/abogado-dashboard.component';
import { AsistenteDashboardComponent } from './asistente-dashboard/asistente-dashboard.component';

@NgModule({
  declarations: [
    DashboardAdminComponent,
    AbogadoDashboardComponent,
    AsistenteDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
