import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesRoutingModule } from './clientes-routing.module';

// Importar Lucide Icons
import { 
  LucideAngularModule, 
  Users, UserPlus, UserCheck, UserX, Search, Filter, Users2,
  Eye, Edit2, PauseCircle, PlayCircle, Trash2, Phone, MapPin,
  Calendar, User, Mail, FileText, MapPinned, ArrowLeft, AlertTriangle,
  AlertCircle, CreditCard, Hash, Home, Map, ToggleRight, X, Check, Save,
  // Nuevos iconos para cliente-detalle
  Edit, Smartphone, Activity, CheckCircle, XCircle, CalendarDays,
  Clock, Scale, Circle, Plus, Inbox, Tag, Heart, FolderOpen, 
  Briefcase, AtSign
} from 'lucide-angular';

// Componentes
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

@NgModule({
  declarations: [
    ClientesListComponent,
    ClienteDetalleComponent,
    ClienteFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientesRoutingModule,
    LucideAngularModule.pick({
      Users,
      UserPlus,
      UserCheck,
      UserX,
      Search,
      Filter,
      Users2,
      Eye,
      Edit2,
      PauseCircle,
      PlayCircle,
      Trash2,
      Phone,
      MapPin,
      Calendar,
      User,
      Mail,
      FileText,
      MapPinned,
      ArrowLeft,
      AlertTriangle,
      AlertCircle,
      CreditCard,
      Hash,
      Home,
      Map,
      ToggleRight,
      X,
      Check,
      Save,
      // Nuevos iconos para cliente-detalle
      Edit,
      Smartphone,
      Activity,
      CheckCircle,
      XCircle,
      CalendarDays,
      Clock,
      Scale,
      Circle,
      Plus,
      Inbox,
      Tag,
      Heart,
      FolderOpen,
      Briefcase,
      AtSign
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesModule { }