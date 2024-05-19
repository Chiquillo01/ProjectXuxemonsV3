import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// --- //
import { MainComponent } from './main.component';
import { ErrorComponent } from './error/error.component';
import { ConfigComponent } from './header/config/config.component';
import { HomeComponent } from './home/home.component';
import { HospitalComponent } from './hospital/hospital.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ChuchesComponent } from './inventario/chuches/chuches.component';
import { TiendaComponent } from './tienda/tienda.component';
import { XuxemonsComponent } from './xuxemons/xuxemons.component';
import { XuxedexComponent } from './xuxemons/xuxedex/xuxedex.component';
import { CrearComponent } from './xuxemons/xuxedex/crear/crear.component';
import { EditarComponent } from './xuxemons/xuxedex/editar/editar.component';
import { CajaComponent } from './xuxemons/caja/caja.component';
import { AlimentarComponent } from './xuxemons/caja/alimentar/alimentar.component';
import { ObjetosComponent } from './inventario/objetos/objetos.component';
import { ContactosComponent } from './contactos/contactos.component';
import { IntercambioComponent } from './intercambio/intercambio.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'config', component: ConfigComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'home', component: HomeComponent },
      { path: 'hospital', component: HospitalComponent },
      { path: 'contactos', component: ContactosComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'chuches', component: ChuchesComponent },
      { path: 'objetos', component: ObjetosComponent },
      { path: 'tienda', component: TiendaComponent },
      { path: 'xuxemons', component: XuxemonsComponent },
      { path: 'xuxedex', component: XuxedexComponent },
      { path: 'crear', component: CrearComponent },
      { path: 'editar', component: EditarComponent },
      { path: 'caja', component: CajaComponent },
      { path: 'alimentar', component: AlimentarComponent },
      { path: 'intercambio', component: IntercambioComponent},
      { path: 'profile-user', component: ProfileUserComponent}
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    HospitalComponent,
    InventarioComponent,
    TiendaComponent,
    XuxemonsComponent,
    CajaComponent,
    XuxedexComponent,
    CrearComponent,
    EditarComponent,
    AlimentarComponent,
    ChuchesComponent,
    ObjetosComponent,
    ConfigComponent,
    ContactosComponent,
    IntercambioComponent,
    ProfileUserComponent,
  ],
  imports: [RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, FormsModule,],
  exports: [RouterModule,],
})
export class MainModule { }
