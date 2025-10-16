import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
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
        path: 'casos',
        loadChildren: () => import('./modules/casos/casos.module').then(m => m.CasosModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('./modules/citas/citas.module').then(m => m.CitasModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)
      },
      {
        path: 'reportes',
        loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'ABOGADO'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }