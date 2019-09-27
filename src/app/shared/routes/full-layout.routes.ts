import { Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/auth-guard.service';

// Route for content layout with sidebar, navbar and footer.
export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './setting/setting.module#SettingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'task',
    loadChildren: './task/task.module#TaskModule',
    canActivate: [AuthGuard]
  }
];
