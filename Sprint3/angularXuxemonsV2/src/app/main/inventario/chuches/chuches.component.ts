import { Component, OnInit } from '@angular/core';
// Imports extras //
import { TokenService } from '../../../services/token/token.service';
import { ChuchesService } from '../../../services/chuches/chuches.service';
import { ChuchesUser } from '../../../models/chuches/chuches-user.model';
import { Horario } from '../../../models/horario/horario.model';

@Component({
  selector: 'app-chuches',
  templateUrl: './chuches.component.html',
  styleUrls: ['./chuches.component.css'],
})

export class ChuchesComponent implements OnInit {
  chucheUser: ChuchesUser[] = [];
  horario: Horario[] = [];
  userRol!: number;

  constructor(
    private tokenService: TokenService,
    private chuchesService: ChuchesService
  ) { }

  ngOnInit(): void {
    // this.getHorario();
    this.getChuches();
    // this.activarHorario();
  }

  /**
   * Nombre: getChuches
   * Función: obtiene todas las chuches que son del usuario que esta en sessión
   */
  getChuches() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.chuchesService.getAllChuchesUser(userToken).subscribe({
        next: (chuchesUser: any) => {
          this.chucheUser = chuchesUser[0];
          // this.activarHorario();
        },
        error: (error) => {
          window.alert(JSON.stringify(error));
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  /**
   * Nombre: getHorario
   * Función: obtiene la info del horario del usuario
   */
  getHorario() {
    // const userToken = this.tokenService.getToken();
    // console.log('userToken getHorario: ' + userToken);

    // if (userToken !== null) {
    //   this.chuchesService.getHorario(userToken).subscribe({
    //     next: (Horario: any) => {
    //       this.horario = Horario[0];
    //     },
    //     error: (error) => {
    //       console.error('Error fetching Xuxemons:', error);
    //     },
    //   });
    // } else {
    //   console.error('User ID is null');
    // }
  }

  /**
   * Nombre: getHorario
   * Función: obtiene todas las chuches que son del usuario que esta en sessión
   */
  activarHorario() {
    // const userToken = this.tokenService.getToken();
    // console.log('userToken: ' + userToken);
    // if (userToken !== null) {
    //   this.chuchesService.activarHorario(userToken).subscribe({
    //     next: (Horario: any) => {
    //       console.log("debug activado ?");
    //     },
    //     error: (error) => {
    //       console.error('Error activando el debug:', error);
    //     },
    //   });
    // } else {
    //   console.error('User ID is null');
    // }
  }

  /**
   * Nombre: debug
   * Función: crea aleatoriamente una chuche pasandole el id del usuario de la sesión habierta.
   * Despues actualizara la lista de chuches del Usuario
   */
  debug(): void {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.chuchesService.createChuchesAleatorios(userToken).subscribe({
        next: () => {
          this.getChuches();
        },
        error: (error) => {
          console.log(error)
          window.alert(JSON.stringify(error));
        },
      });
    } else {
      console.error('User ID is null');
    }
  }
}