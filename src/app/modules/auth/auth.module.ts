import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

// Importar Lucide Icons
import { 
  LucideAngularModule, 
  Scale, Mail, AtSign, Lock, Key, Eye, EyeOff, 
  AlertCircle, CheckCircle, AlertTriangle, HelpCircle, 
  ShieldCheck, Briefcase, CheckCircle2, LogIn, User,
} from 'lucide-angular';

// Componentes
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
      User,
      AlertCircle,
      CheckCircle,
      AlertTriangle,
      HelpCircle,
      ShieldCheck,
      Briefcase,
      CheckCircle2,
      LogIn
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }