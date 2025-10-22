import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// Importar Navbar y Sidebar
import { NavbarComponent } from './layouts/main-layout/components/navbar/navbar.component';
import { SidebarComponent } from './layouts/main-layout/components/sidebar/sidebar.component';

// Importar Lucide Angular
import { 
  LucideAngularModule, 
  Menu, 
  Search, 
  Bell, 
  User, 
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,  
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChartNoAxesCombined,
  Briefcase,
  Calendar,
  FileText,
  UserCog,
  Scale,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  BarChart3
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavbarComponent,      // ← Agregado
    SidebarComponent      // ← Agregado
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      Menu,
      Search,
      Bell,
      User,
      LogOut,
      Settings,
      HelpCircle,
      ChevronDown,
      ChevronLeft,
      ChevronRight,
      LayoutDashboard,
      Users,
      Briefcase,
      Calendar,
      ChartNoAxesCombined,
      ShieldCheck,
      FileText,
      UserCog,
      Scale,
      CheckCircle,
      AlertTriangle,
      XCircle,
      Info
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }