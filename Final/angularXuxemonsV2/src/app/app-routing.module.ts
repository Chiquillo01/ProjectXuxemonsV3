import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importamos las rutas de nuestros componentes //
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'landingPage',
    component: LandingComponent,
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'landingPage',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
