import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';

// ⭐ IMPORTAR LUCIDE ANGULAR
import { 
  LucideAngularModule, 
  Users,           // Título y stats
  UserPlus,        // Botón nuevo usuario
  Crown,           // Administradores stats
  Scale,           // Abogados stats y avatar
  ClipboardList,   // Asistentes stats y avatar
  CheckCircle,     // Activos stats
  Search,          // Filtro buscar
  UserCircle,      // Filtro rol
  Activity,        // Filtro estado
  SearchX,         // Sin resultados
  Mail,            // Email
  AtSign,          // Username
  Shield,          // Admin avatar
  Phone,           // Teléfono
  Eye,        // Ver detalle
  Pencil,          // Editar
  PauseCircle,     // Desactivar
  PlayCircle,      // Activar
  Trash2,          // Eliminar
  User,            // Icono genérico usuario
  ArrowLeft,       // Volver (para form y detalle)
  Save,            // Guardar (para form)
  X,               // Cerrar/Cancelar (para form)
  AlertTriangle,   // Alertas (para form)
  Calendar,
  FolderX,
  Folder,
  Lock,
  Monitor,        // Fecha registro (para detalle)
  Clock,           // Último acceso (para detalle)
  FileText,        // Notas (para detalle)
  Briefcase,       // Casos asignados (para detalle)
  MapPin,          // Dirección (para detalle)
  Edit,            // Editar (para detalle)
  UserCheck,       // Usuario activo (para detalle)
  UserX,           // Usuario inactivo (para detalle)
  Info,             // Información adicional (para detalle)
  LucideProjector
} from 'lucide-angular';

@NgModule({
  declarations: [
    UsuariosListComponent,
    UsuarioFormComponent,
    UsuarioDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsuariosRoutingModule,
    // ⭐ LUCIDE MODULE CON TODOS LOS ICONOS
    LucideAngularModule.pick({
      // Iconos para usuarios-list
      Users,
      UserPlus,
      Crown,
      Scale,
      ClipboardList,
      CheckCircle,
      Search,
      UserCircle,
      Activity,
      SearchX,
      Mail,
      AtSign,FolderX,
      Lock,
  Folder,
  Monitor, 
      Shield,
      Phone,
      Eye,
      Pencil,
      PauseCircle,
      PlayCircle,
      Trash2,
      User,
      // Iconos para usuario-form
      ArrowLeft,
      Save,
      X,
      AlertTriangle,
      Calendar,
      FileText,
      // Iconos para usuario-detalle
      Edit,
      Clock,
      Briefcase,
      UserCheck,
      UserX,
      Info,
    })
  ]
})
export class UsuariosModule { }