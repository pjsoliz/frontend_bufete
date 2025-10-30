import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

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
  Clock,
  Calendar,
  FileText,
  UserCog,
  Scale,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Key,
  Info,
  BarChart3,
  Book,
  BookOpen,
  Mail,
  Phone,
  Send,
  AlertCircle,
  X,
  Video,
  MessageCircle,
  Shield,
  Database,
  BellRing,
  Check
} from 'lucide-angular';
import { ConfiguracionComponent } from './modules/configuracion/configuracion.component';
import { AyudaComponent } from './modules/ayuda/ayuda.component';

// Registrar locale español
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    ConfiguracionComponent,
    AyudaComponent
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
      Lock,
      Key,
      Check,
      AlertCircle,
      X,
      Settings,
      HelpCircle,
      Database,
      BellRing,
      ChevronDown,
      ChevronLeft,
      BookOpen,
      Mail,
      Phone,
      Clock,
      ChevronRight,
      Edit,
      LayoutDashboard,
      Users,
      Briefcase,
      Book,
      Send,
      Video,
      MessageCircle,
      Shield,
      Calendar,
      ChartNoAxesCombined,
      ShieldCheck,
      FileText,
      UserCog,
      Scale,
      CheckCircle,
      AlertTriangle,
      XCircle,
      Info,
      BarChart3
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es'
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }