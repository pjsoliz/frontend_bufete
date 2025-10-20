import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Menu, Scale, Search, ArrowRight, Bell, HelpCircle, User, ChevronDown,
  UserCircle, Settings, LogOut, CheckCheck, Info, XCircle, AlertTriangle,
  CheckCircle, ArrowRight as ArrowRightIcon, ChevronLeft, ChevronRight,
  LayoutDashboard, Users, Briefcase, Calendar, MessageCircle, Sparkles,
  BarChart3, FileText, UserCog, ShieldCheck
} from 'lucide-angular';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Menu,
      Scale,
      Search,
      ArrowRight,
      Bell,
      HelpCircle,
      User,
      ChevronDown,
      UserCircle,
      Settings,
      LogOut,
      CheckCheck,
      Info,
      XCircle,
      AlertTriangle,
      CheckCircle,
      ChevronLeft,
      ChevronRight,
      LayoutDashboard,
      Users,
      Briefcase,
      Calendar,
      MessageCircle,
      Sparkles,
      BarChart3,
      FileText,
      UserCog,
      ShieldCheck
    })
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class SharedModule { }
