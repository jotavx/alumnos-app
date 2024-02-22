import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAlumnoComponent } from './components/create-alumno/create-alumno.component';
import { ListAlumnosComponent } from './components/list-alumnos/list-alumnos.component';
import { EnvioEmailComponent } from './components/envio-email/envio-email.component';
import { LoginComponent } from './components/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  //Para cambiar redireccion al ingresar al url modificar el siguiente path
  { path: '', redirectTo: 'list-alumnos', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'create-alumno',
    component: CreateAlumnoComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'edit-alumno',
    component: CreateAlumnoComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'edit-alumno/:id',
    component: CreateAlumnoComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'envio-email',
    component: EnvioEmailComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
