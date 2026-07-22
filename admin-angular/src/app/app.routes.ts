import { Routes } from '@angular/router';
import { adminGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent },
  { path: 'cursos', component: CoursesComponent },
  { path: 'usuarios', component: UsersComponent },
  { path: '**', redirectTo: '' },
];
