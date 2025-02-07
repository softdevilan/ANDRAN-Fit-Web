import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/forms/login/login.component';
import { RegisterWorkoutComponent } from './components/pages/forms/register-workout/register-workout.component';
import { RegisterClientComponent } from './components/pages/forms/register-client/register-client.component';
import { ClientListComponent } from './components/pages/clients/client-list/client-list.component';
import { ClientDetailsComponent } from './components/pages/clients/client-details/client-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login si no está autenticado
  { path: 'login', component: LoginComponent }, // Protegida para evitar acceso si ya está autenticado , canActivate: [AuthGuard]
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protegida 
  { path: 'register-workout', component: RegisterWorkoutComponent, canActivate: [AuthGuard]  },
  { path: 'register-client', component: RegisterClientComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
  { path: 'clients/:id', component: ClientDetailsComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' } // Página de error 404 que redirige al login
];
