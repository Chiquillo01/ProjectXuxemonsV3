import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
// Imports extras //
import { TokenService } from '../../../services/token/token.service';
import { XuxemonsService } from '../../../services/xuxemons/xuxemons.service';
import { CurarService } from 'src/app/services/curar/curar.service';
import { XuxemonsUsers } from '../../../models/xuxemons/xuxemons-user.model';
import { EnfermedadesUser } from '../../../models/enfermedadesUser/enfermedadesUser.model';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  xuxemonsUser: XuxemonsUsers[] = [];
  xuxemonsUserActivos: XuxemonsUsers[] = [];
  enfermedades: EnfermedadesUser[] = [];

  constructor(
    private tokenService: TokenService,
    private xuxemonsService: XuxemonsService,
    private curarService: CurarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEnfermedades();
    this.getXuxemons();
    this.getXuxemonsActivos();
  }

  /**
   * Nombre: getImageStyle
   * Función: Modificar el tamaño de la imagen segun el tamaño del xuxemon
   * @param tamano
   * @returns width
   */
  getImageStyle(tamano: string): any {
    let width: number;
    const paqueno = 50;
    const mediano = 100;
    const grande = 150;

    switch (tamano) {
      case 'pequeno':
        width = paqueno;
        break;
      case 'mediano':
        width = mediano;
        break;
      case 'grande':
        width = grande;
        break;
      default:
        width = paqueno;
        break;
    }
    return {
      'width.px': width,
    };
  }

  /**
   * Nombre: getXuxemons
   * Función: obtiene todos los Xuxemons que son del usuario que esta en sessión
   */
  getXuxemons() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.xuxemonsService.getAllXuxemonsUser(userToken).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsUser = xuxemonsUser[0];
          this.xuxemonsUser.forEach((xuxemon) => {
            this.enfermedades.forEach((enfermedad) => {
              if (xuxemon.xuxemon_id === enfermedad.xuxemon_id) {
                if (enfermedad.enfermedad_id == 1) {
                  if (enfermedad.infectado) {
                    xuxemon.noComer = true;
                  } else {
                    xuxemon.noComer = false;
                  }
                }
              }
            });
          });
          console.log(this.xuxemonsUserActivos);
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  /**
   * Nombre: getXuxemons
   * Función: obtiene todos los Xuxemons que son del usuario que esta en sessión
   */
  getXuxemonsActivos() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.xuxemonsService.getAllXuxemonsUserActivos(userToken).subscribe({
        next: (xuxemonsUserActivos: any) => {
          this.xuxemonsUserActivos = xuxemonsUserActivos[0];
          // console.log(xuxemonsUserActivos[0]);
          // console.log(this.xuxemonsUserActivos);
          this.xuxemonsUserActivos.forEach((xuxemonActivo) => {
            this.enfermedades.forEach((enfermedad) => {
              if (xuxemonActivo.xuxemon_id === enfermedad.xuxemon_id) {
                if (enfermedad.enfermedad_id == 1) {
                  if (enfermedad.infectado) {
                    xuxemonActivo.noComer = true;
                  } else {
                    xuxemonActivo.noComer = false;
                  }
                }
                if (enfermedad.enfermedad_id == 2) {
                  if (enfermedad.infectado) {
                    xuxemonActivo.inactivo = true;
                  } else {
                    xuxemonActivo.inactivo = false;
                  }
                }
              }
            });
          });
          console.log(this.xuxemonsUserActivos);
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  /**
   * Nombre: alimentarXuxemon
   * Función: para editar el Xuxemon
   */
  getEnfermedades() {
    // const userToken = this.tokenService.getToken();
    // // const enfId = this.curaId;
    // // console.log(enfId);

    // if (userToken !== null) {
    //   this.curarService.getAllEnfermedades(userToken).subscribe({
    //     next: (Enfermedades: any) => {
    //       this.enfermedades = Enfermedades;
    //       // this.getXuxemons();
    //       // console.log(this.enfermedades);
    //       // console.log(Enfermedades);
    //     },
    //     error: (error) => {
    //       console.error('Error obteniendo enfermedades:', error);
    //     },
    //   });
    // } else {
    //   console.error('User ID is null');
    // }
  }

  /**
   * Nombre: debug
   * Función: crea aleatoriamente un Xuxemon pasandole el id del usuario de la sesión habierta.
   * Despues actualizara la lista de Xuxemons del Usuario
   */
  debug(): void {
    const userToken = this.tokenService.getToken();
    console.log(userToken);
    this.xuxemonsService.createRandomXuxemon(userToken!).subscribe({
      next: (respuesta) => {
        alert('Xuxemon creardo con exito.');
        console.log(respuesta);
        this.getXuxemons();
      },
      error: (error) => {
        alert('Xuxemon no se ha podido crear.');
        console.log(error);
      },
    });
  }

  /**
   * Nombre: activo
   * Función: crea aleatoriamente un Xuxemon pasandole el id del usuario de la sesión habierta.
   * Despues actualizara la lista de Xuxemons del Usuario
   */
  activo(xuxeUser: any) {
    const userToken = this.tokenService.getToken();
    const xuxemon_id = xuxeUser.xuxemon_id;
    const ContadorActivo = this.xuxemonsUserActivos.length;

    if (ContadorActivo < 4 || xuxeUser.activo == 1) {
      this.xuxemonsService.xuxemonActivo(userToken!, xuxemon_id).subscribe({
        next: () => {
          // alert('Se va al activo.');
          this.getXuxemonsActivos();
          this.getXuxemons();
          if (xuxeUser.activo == 0) {
            xuxeUser.activo = 1;
          } else {
            xuxeUser.activo = 0;
          }
        },
        error: (error) => {
          alert('No quiere ser activo');
          throw new Error(error);
        },
      });
    }
  }

  /**
   * Nombre: favorito
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon
   * seleccionado como favorito
   * @param xuxeUser
   */
  favorito(xuxeUser: any) {
    const userToken = this.tokenService.getToken();
    const xuxemon_id = xuxeUser.xuxemon_id;

    this.xuxemonsService.xuxemonFav(userToken!, xuxemon_id).subscribe({
      next: () => {
        // alert('Se ha podido modificar');
        this.getXuxemonsActivos();
        this.getXuxemons();
      },
      error: (error) => {
        alert('No quiere tu mierda de chuche.');
        throw new Error(error);
      },
    });
  }

  /**
   * Nombre: favorito
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon
   * seleccionado como favorito
   * @param xuxeUser
   */
  hospital() {
    this.router.navigate(['/home/home/hospital']);
  }

  /**
   * Nombre: alimentar
   * Función: Envia al usuario a a ruta para alimentar al Xuxemon, a su vez esta enviando los datos del xuxuemon
   */
  alimentar(xuxeUser: any) {
    console.log('Datos de xuxeUser:', xuxeUser);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: xuxeUser.xuxemon_id,
        nombre: xuxeUser.nombre,
        archivo: xuxeUser.archivo,
        tamano: xuxeUser.tamano,
      },
    };
    this.router.navigate(
      ['/alimentar'],
      navigationExtras
    );
  }

  /**
   * Nombre: eliminar
   * Función: Eliminar el xuxemon seleccionado
   */
  eliminar(xuxeUser: number) {
    this.xuxemonsService.XuxeDelete(xuxeUser).subscribe({
      next: (returns) => {
        console.log('Este sale por el next: ' + returns);
        this.getXuxemons();
        // alert('Le ha gustado el alimento.');
      },
      error: (error) => {
        console.log('Esta saliendo por el error: ' + error);
        // alert('No quiere tu mierda de chuche.');
        // throw new Error(error);
      },
    });
  }
}
