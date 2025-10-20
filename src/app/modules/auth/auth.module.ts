import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Scale, Mail, AtSign, Lock, Key, Eye, EyeOff,
         AlertCircle, CheckCircle, AlertTriangle, HelpCircle, ShieldCheck,
         Briefcase, CheckCircle2, LogIn } from 'lucide-angular';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    LucideAngularModule.pick({
      Scale,
      Mail,
      AtSign,
      Lock,
      Key,
      Eye,
      EyeOff,
      AlertCircle,
      CheckCircle,
      AlertTriangle,
      HelpCircle,
      ShieldCheck,
      Briefcase,
      CheckCircle2,
      LogIn
    })
  ]
})
export class AuthModule { }
