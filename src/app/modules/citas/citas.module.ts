import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CitasRoutingModule } from './citas-routing.module';
import { CitasListComponent } from './citas-list/citas-list.component';
import { CitaFormComponent } from './cita-form/cita-form.component';
import { CitaDetalleComponent } from './cita-detalle/cita-detalle.component';

// ⭐ IMPORTAR LUCIDE ANGULAR - COMPLETO CON ICONOS FALTANTES
import { 
  LucideAngularModule, 
  Calendar, 
  Plus, 
  Search, 
  Activity, 
  Clock, 
  User, 
  Briefcase, 
  CheckCircle, 
  Check, 
  Pencil, 
  XCircle, 
  Trash2, 
  CalendarX, 
  AlertTriangle, 
  ArrowLeft,
  Edit, 
  PlusCircle, 
  ClipboardList, 
  FileText, 
  AlignLeft,
  Folder, 
  Flag, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Scale,
  Landmark, 
  Hash, 
  FileEdit, 
  X, 
  Save, 
  AlertCircle, 
  MapPin,
  Phone,
  Timer,          // ⭐ FALTABA
  Bell,           // ⭐ FALTABA
  PauseCircle,    // ⭐ FALTABA
  StickyNote,     // ⭐ FALTABA
  Info,           // ⭐ FALTABA
  Inbox           // ⭐ FALTABA (por si usas historial)
} from 'lucide-angular';

@NgModule({
  declarations: [
    CitasListComponent,
    CitaFormComponent,
    CitaDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CitasRoutingModule,
    // ⭐ LUCIDE MODULE CON TODOS LOS ICONOS - INCLUYENDO LOS QUE FALTABAN
    LucideAngularModule.pick({
      // Iconos para citas-list
      Calendar,
      Plus,
      Search,
      Activity,
      Clock,
      User,
      Briefcase,
      CheckCircle,
      Check,
      Pencil,
      XCircle,
      Trash2,
      CalendarX,
      // Iconos para cita-form
      AlertTriangle,
      ArrowLeft,
      Edit,
      PlusCircle,
      ClipboardList,
      FileText,
      AlignLeft,
      Folder,
      Flag,
      Users,
      CalendarCheck,
      DollarSign,
      X,
      Save,
      AlertCircle,
      // Iconos para cita-detalle
      Scale,
      Landmark,
      Hash,
      FileEdit,
      MapPin,
      Phone,
      Timer,          // ⭐ AGREGADO
      Bell,           // ⭐ AGREGADO
      PauseCircle,    // ⭐ AGREGADO
      StickyNote,     // ⭐ AGREGADO
      Info,           // ⭐ AGREGADO
      Inbox           // ⭐ AGREGADO
    })
  ]
})
export class CitasModule { }