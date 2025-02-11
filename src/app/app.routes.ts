import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/forms/login/login.component';
import { RegisterWorkoutComponent } from './components/pages/forms/register-workout/register-workout.component';
import { WorkoutsComponent } from './components/pages/workouts/workouts.component';
import { RegisterClientComponent } from './components/pages/forms/register-client/register-client.component';
import { ClientListComponent } from './components/pages/clients/client-list/client-list.component';
import { ClientDetailsComponent } from './components/pages/clients/client-details/client-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login si no está autenticado
  { path: 'login', component: LoginComponent }, // Protegida para evitar acceso si ya está autenticado , canActivate: [AuthGuard]
  { path: 'workouts/:uid', component: WorkoutsComponent },
  { path: 'home/:uid', component: HomeComponent }, // Protegida 
  { path: 'register-workout/:uid', component: RegisterWorkoutComponent },
  { path: 'register-client/:uid', component: RegisterClientComponent },
  { path: 'clients/:uid', component: ClientListComponent },
  { path: 'client/:uid/:id', component: ClientDetailsComponent },

  { path: '**', redirectTo: 'login' } // Página de error 404 que redirige al login
];
