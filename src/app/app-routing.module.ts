import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('./modules/citas/citas.module').then(m => m.CitasModule),canActivate: [AuthGuard]
      },
      {
        path: 'reportes',
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'asistente_legal'] },
        loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule)
      },
      {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard]
  },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
